#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
export PATH=$PATH:/usr/local/bin:/usr/bin:~/.nvm/versions/node/$(ls ~/.nvm/versions/node 2>/dev/null | tail -n 1)/bin

echo "Deploying Kenny API..."
npm install
npm run build

# Restart/Start API server using PM2
pm2 restart "kenny-api" || pm2 start dist/index.js --name "kenny-api"

echo "Kenny API deployed successfully!"
