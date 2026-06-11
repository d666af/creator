#!/bin/bash
set -e

APP_DIR="/var/www/creators-hub/creator"
BRANCH="claude/minimal-design-platform-jhzm4d"
LOG="/var/log/creators-hub-deploy.log"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deploy started" >> "$LOG"

cd "$APP_DIR"

git fetch origin "$BRANCH" >> "$LOG" 2>&1
git reset --hard "origin/$BRANCH" >> "$LOG" 2>&1

npm install --omit=dev >> "$LOG" 2>&1
npm run build >> "$LOG" 2>&1

pm2 restart creators-hub >> "$LOG" 2>&1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Deploy finished OK" >> "$LOG"
