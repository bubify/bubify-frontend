#!/bin/bash
source /home/bubify/.bashrc

cd /home/bubify/frontend
sudo chown -R bubify:bubify .
yarn install
npm run build

sudo service nginx start # -g daemon off
tail -f /dev/null
