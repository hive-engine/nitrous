#!/bin/bash

git checkout HEAD src/app/client_config.js

git rm -rf src/app/assets/images
git checkout HEAD src/app/assets/images
git rm -rf src/app/assets/static
git checkout HEAD src/app/assets/static
git checkout HEAD src/app/assets/stylesheets
