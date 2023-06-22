#!/bin/bash
source /home/bubify/.bashrc

cd /home/bubify/frontend
/usr/bin/npm install

while true; do
  /usr/bin/npm run start >> logging
  exit_code=$?
  if [ $exit_code -eq 0 ]; then
    echo "npm application exited gracefully."
    break
  else
    echo "npm application exited with error. Restarting..."
    sleep 2s
  fi
done