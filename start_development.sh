#!/bin/bash
source /home/bubify/.bashrc

cd /home/bubify/frontend
sudo chown -R bubify:bubify .
yarn install
npm run start
