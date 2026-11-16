const { spawn } = require('child_process');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');

console.log('\x1b[35m%s\x1b[0m', '==================================================');
console.log('\x1b[36m%s\x1b[0m', '   🍷 The Date Inc — Launching All Services...    ');
console.log('\x1b[35m%s\x1b[0m', '==================================================\n');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Define the 3 services
const services = [
  {
    name: 'BACKEND',
    color: '\x1b[36m', // Cyan
    dir: path.join(__dirname, 'backend'),
    args: ['run', 'dev'],
    port: 5000,
    url: 'http://localhost:5000/api/health',
  },
  {
    name: 'FRONTEND',
    color: '\x1b[32m', // Green
    dir: path.join(__dirname, 'frontend'),
    args: ['run', 'dev'],
    port: 3000,
    url: 'http://localhost:3000',
  },
  {
    name: 'DASHBOARD',
    color: '\x1b[33m', // Yellow
    dir: path.join(__dirname, 'dashboard'),
    args: ['run', 'dev'],
    port: 3001,
    url: 'http://localhost:3001',
  },
];

const processes = [];

services.forEach((service) => {
  console.log(`${service.color}[${service.name}]\x1b[0m Starting on port ${service.port}...`);

  const proc = spawn(npmCmd, service.args, {
    cwd: service.dir,
    shell: true,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]\x1b[0m ${line}`);
      }
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${service.color}[${service.name} ERR]\x1b[0m ${line}`);
      }
    });
  });

  proc.on('close', (code) => {
    console.log(`${service.color}[${service.name}]\x1b[0m Exited with code ${code}`);
  });

  processes.push(proc);
});

// Automatically open browser after 3 seconds
setTimeout(() => {
  console.log('\n\x1b[32m%s\x1b[0m', '✨ All services are running!');
  console.log('   🔗 Frontend (Desktop & Mobile): \x1b[34mhttp://localhost:3000\x1b[0m');
  console.log('   🔗 Dashboard:                   \x1b[34mhttp://localhost:3001\x1b[0m');
  console.log('   🔗 Backend API:                 \x1b[34mhttp://localhost:5000\x1b[0m\n');
  console.log('🚀 Opening browser at http://localhost:3000 ...\n');

  const startCmd = isWindows ? 'start http://localhost:3000' : 'open http://localhost:3000';
  exec(startCmd);
}, 3500);

// Graceful shutdown on Ctrl+C
const shutdown = () => {
  console.log('\n\x1b[31m%s\x1b[0m', 'Shutting down all services...');
  processes.forEach((p) => {
    try {
      if (isWindows) {
        exec(`taskkill /pid ${p.pid} /T /F`);
      } else {
        p.kill('SIGTERM');
      }
    } catch (e) {
      // ignore
    }
  });
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
