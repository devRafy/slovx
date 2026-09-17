// PM2 process manager config for the Express backend.
// Runs one Node instance bound to :8080; nginx proxies /api/* to it.
//
// Usage on the EC2 instance:
//   pm2 start deploy/ecosystem.config.cjs
//   pm2 save
//   pm2 startup   # follow the printed instructions to enable on boot
module.exports = {
  apps: [
    {
      name: 'xavier-api',
      cwd: '/home/ec2-user/xavier_saas/backend',
      script: 'server.js',
      instances: 1,
      exec_mode: 'fork',            // single instance — t2.micro has 1 vCPU
      max_memory_restart: '500M',   // hard cap so a leak can't OOM the box
      env: {
        NODE_ENV: 'production',
        PORT: '8080',
      },
      // Env-file loading: server.js already uses dotenv, so PM2 doesn't need
      // to inject env — the .env in backend/ is read at process start.
      error_file: '/home/ec2-user/logs/xavier-api.err.log',
      out_file:   '/home/ec2-user/logs/xavier-api.out.log',
      time: true,
    },
  ],
};
