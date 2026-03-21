#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
cd /home/xg/czb
# Run npm run dev in background and redirect output to a log file
nohup npm run dev > /home/xg/czb/dev-server.log 2>&1 &
# Wait for port 3000 to be open
for i in {1..30}; do
  if ss -tuln | grep -q ":3000"; then
    echo "Server is up on port 3000"
    exit 0
  fi
  echo "Waiting for server to start... ($i/30)"
  sleep 2
done
echo "Server failed to start within 60 seconds"
cat /home/xg/czb/dev-server.log
exit 1
