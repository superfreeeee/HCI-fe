node {
   def workspace = pwd()
   stage('Preparation') { // for display purposes
      // Get some code from a GitHub repository
    git branch: 'release', credentialsId: '3a3b66e9-42b3-405e-adb1-b5ae35bee98f', url: 'http://212.129.149.40/co-in/frontend.git'
   }
  stage('install') {
    sh 'cnpm install'
  }
  stage('build') {
    sh "npm run build"
  }   
  stage('Deploy') {
      sh "/bin/bash '${workspace}/scripts/deploy.sh' ${workspace}"
  }
}