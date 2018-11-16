#!/usr/bin/env sh

# abort on errors
set -e

# lint
npm run lint:libs

# build
gulp --gulpfile ./gulpfile.js

# finish
echo 'Build Libs Finish...'
