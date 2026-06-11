module.exports = {
  apps: [
    {
      name: "creators-hub",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
    {
      name: "creators-hub-webhook",
      script: "scripts/webhook.js",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        WEBHOOK_PORT: 3002,
        // WEBHOOK_SECRET must be set in the server environment or via pm2 env override
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "64M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
