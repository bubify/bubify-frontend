#!/bin/bash
source /home/bubify/.bashrc

cd /home/bubify/frontend
yarn install
npm run build

sudo service nginx start # -g daemon off
tail -f /dev/null
