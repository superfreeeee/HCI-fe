node {
   def workspace = pwd()
   stage('Preparation') { // for display purposes
      // Get some code from a GitHub repository
      git branch: 'release', credentialsId: 'e3ebf0ed-c6bf-4707-9749-0a58eb72f88b', url: 'http://212.129.149.40/co-in/frontend'
   }
  stage('install') {
    sh 'echo ${workspace}'
    sh 'npm install'
  }
  stage('build') {
    sh "npm run build"
  }
}