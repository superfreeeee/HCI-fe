pipeline {
    agent none
    stages {
        stage('yarn') {
            agent {
                docker {
                    image 'node:latest'
                }
            }
            steps {
                echo 'yarn config'
                sh 'yarn config set ignore-engines true'
                sh 'yarn config set registry https://registry.npm.taobao.org'
                sh 'yarn config set "chromedriver_cdnurl" "https://npm.taobao.org/mirrors/chromedriver"'
                echo 'yarn install'
                sh 'yarn'
                echo 'yarn build'
                sh 'yarn build'
            }
        }
    }
}
