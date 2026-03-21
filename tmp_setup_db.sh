#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/xg/czb
npm install
npx prisma db push --accept-data-loss
npx prisma db seed
