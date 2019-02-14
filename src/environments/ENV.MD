# To Encrypt Environment Variables in Ubuntu Bash using Windows Subsystem for Linux:
Turn Windows features on or off > Windows Subsystem for Linux
Install Ubuntu from Windows Store and open
`sudo apt-get install ruby-all-dev` (Ruby is already installed but need dev packages also)
`sudo apt-get install make`
`sudo apt-get install libffi-dev`
`sudo apt-get update` (possibly required before installing gcc)
`sudo apt-get install gcc`
`sudo gem install travis`
`sudo travis version` (to check it's ready)
`sudo travis login --com` (now following https://docs.travis-ci.com/user/encrypting-files/)
`cd /mnt/c/Apps/talking-dictionaries/src/environments` (directory to env variables in repo on computer)
`tar cvf env.tar environment.prod.ts environment.ts`
`sudo travis encrypt-file env.tar`
Follow Travis' instructions to place the encryption line into your .travis.yml file:
`before_install:`
  `- openssl aes-256-cbc -K $encrypted_...... -iv $encrypted_...... -in src/environments/env.tar.enc -out src/environments/env.tar -d`
  `- tar xvf src/environments/env.tar --directory src/environments`
Add environment variables files and the tar file to your .gitignore file and commit changes to GitHub!
