#!/bin/bash
#集群IP列表，多个用空格分开
#NODE_LIST="192.168.161.118 192.168.161.117"
NODE_LIST="39.97.124.144"
#应用部署到的远程服务器目录
REMOTE_DIR="/opt/coin" 
#需要部署的项目名称（需和maven的project名一样,多个用空格分开）
#NEED_DEPLOY_PROJECT="user-server user-mgr info-mgr"
NEED_DEPLOY_PROJECT="coin-web"
# Date/Time Veriables
LOG_DATE='date "+%Y-%m-%d"'
LOG_TIME='date "+%H:%M:%S"' 
CDATE=$(date "+%Y%m%d")
CTIME=$(date "+%H%M%S") 
#Shell Env
TARGET_DIR="/var/jenkins_home/deploy"
MOUNT_DIR="/data/jenkins_home/deploy"
SHELL_NAME="deploy.sh"
SHELL_DIR="/deploy/log"
SHELL_LOG="${SHELL_DIR}/${SHELL_NAME}.log" 
#Code Env
JAR_DIR="/deploy/jar"
CONFIG_DIR="/deploy/config"
LOCK_FILE="/tmp/deploy.lock"
REMOTE_JAVA_HOME="/opt/jdk-14.0.1/bin" 
usage(){
    echo  $"Usage: $0 [projectJarPath] [ deploy | rollback ]"
} 
init() {
    create_dir $SHELL_DIR;
    create_dir $JAR_DIR;
    create_dir $CONFIG_DIR;
}
create_dir() {
   if [ ! -d $1 ]; then  
       mkdir -p $1
   fi
}
shell_lock(){
    touch ${LOCK_FILE}
}
shell_unlock(){
    rm -f ${LOCK_FILE}
}
write_log(){
    LOGINFO=$1
    echo "`eval ${LOG_DATE}` `eval ${LOG_TIME}` : ${SHELL_NAME} : ${LOGINFO}"|tee -a ${SHELL_LOG}
}
#拷贝jenkins的工作空间构建的jar包到特定目录，备份，为以后回滚等等操作
copy_jar() { 
    write_log "Copy jenkins workspace jar file to ${TARGET_DIR}"
    mkdir -p $TARGET_DIR
    for project in $NEED_DEPLOY_PROJECT;do
      mkdir -p $TARGET_DIR/${project}
      find $1 -name ${project}*.jar -exec cp {} $TARGET_DIR/${project}/ \;
    done 
} 
#拷贝应用的jar包到远程服务器
scp_jar(){
    SOURCE_DIR=${JAR_DIR}/${CDATE}${CTIME}
    write_log "Scp jar file to remote machine..."
    for node in $NODE_LIST;do
      scp -r ${SOURCE_DIR}/* $node:${REMOTE_DIR}
      write_log "Scp to ${node} complete."
    done
} 
# 杀掉远程服务器上正在运行的项目
cluster_node_remove(){
    write_log "Kill all runing project on the cluster..."
    for project in $NEED_DEPLOY_PROJECT;do
      for node in $NODE_LIST;do
        pid=$(ssh $node "ps aux|grep ${project}|grep -v grep|awk '{print $2}'"|awk '{print $2}')
        if [ ! -n "$pid" ]; then  
      write_log "${project} is not runing..."
    else  
          ssh $node "kill -9 $pid"
      write_log "Killed ${project} at ${node}..."
    fi  
      done
    done
} 
#在远程服务器上启动项目
cluster_deploy(){
    write_log "Up all project on the cluster..."
    for project in $NEED_DEPLOY_PROJECT;do
      for node in $NODE_LIST;do
      	ssh $node "cp ${MOUNT_DIR}/${project}/${project}*.jar ${REMOTE_DIR}"
        ssh $node "cd ${REMOTE_DIR}"
        write_log "${REMOTE_DIR}"
        ssh $node "nohup ${REMOTE_JAVA_HOME}/java -jar ${REMOTE_DIR}/${project}*.jar >${REMOTE_DIR}/log 2>&1 &" 
    	write_log "Up ${project} on $node complete..."
      done
    done
} 
#回滚（暂未实现）
rollback(){
    echo rollback
} 
#入口
main(){
    if [ -f ${LOCK_FILE} ];then
        write_log "Deploy is running"  && exit;
    fi
    WORKSPACE=$1
    DEPLOY_METHOD=$2
    init;
    case $DEPLOY_METHOD in
    deploy)
        shell_lock;
        copy_jar $WORKSPACE;
        # scp_jar;
        cluster_node_remove;
        cluster_deploy;
        shell_unlock;
        ;;
    rollback)
        shell_lock;
        rollback;
        shell_unlock;
        ;;
    *)
        usage;
    esac 
}
main $1 $2