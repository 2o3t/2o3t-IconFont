#!/usr/bin/env sh

# abort on errors
set -e

# version ctrl
node ./.2o3t/bin/libsVersionCtrl.js

# publish
npm run deploy:libs

# deploy
npm run deploy

# finish
echo 'Deploy Finish...'
