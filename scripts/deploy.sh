#!/bin/bash
#集群IP列表，多个用空格分开
#NODE_LIST="192.168.161.118 192.168.161.117"
NODE_LIST="39.97.124.144"
#应用部署到的远程服务器目录
REMOTE_DIR="/opt/apache-tomcat-9.0.36/webapps" 
# Date/Time Veriables
LOG_DATE='date "+%Y-%m-%d"'
LOG_TIME='date "+%H:%M:%S"' 
#Shell Env
TARGET_DIR="/var/jenkins_home/deploy"
MOUNT_DIR="/data/jenkins_home/deploy"
SHELL_NAME="deploy.sh"
SHELL_DIR="/deploy/log"
SHELL_LOG="${SHELL_DIR}/${SHELL_NAME}.log" 
#Code Env
LOCK_FILE="/tmp/deploy.lock"
usage(){
    echo  $"Usage: $0 [projectJarPath] [ deploy | rollback ]"
} 
init() {
    create_dir $SHELL_DIR;
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
#拷贝应用的jar包到远程服务器
scp_dist(){
    WORKSPACE=$1
    write_log "Scp jar file to remote machine..."
    for node in $NODE_LIST;do
      scp -r ${WORKSPACE}/dist $node:${REMOTE_DIR}
      write_log "Scp ${WORKSPACE}/dist to $node:${REMOTE_DIR} complete."
      ssh $node "mv ${REMOTE_DIR}/dist ${REMOTE_DIR}/ROOT"
      write_log "mv ${REMOTE_DIR}/dist ${REMOTE_DIR}/ROOT complete."
    done
} 
# 杀掉远程服务器上正在运行的项目
cluster_node_remove(){
    write_log "Kill all runing project on the cluster..."
    for node in $NODE_LIST;do
        ssh $node "/opt/apache-tomcat-9.0.36/bin/shutdown.sh"
        ssh $node "rm -rf /opt/apache-tomcat-9.0.36/webapps/ROOT"
    done
} 
#在远程服务器上启动项目
cluster_deploy(){
    write_log "Up all project on the cluster..."
    for project in $NEED_DEPLOY_PROJECT;do
      for node in $NODE_LIST;do
        ssh $node "/opt/apache-tomcat-9.0.36/bin/startup.sh"
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
    # shell_lock;
    touch ${LOCK_FILE}
    cluster_node_remove;
    scp_dist ${WORKSPACE};
    cluster_deploy;
    shell_unlock;
    usage;
}
main $1 $2