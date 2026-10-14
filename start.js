const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

let javaCmd = 'java';
const localJava = path.join(__dirname, 'jre', 'bin', process.platform === 'win32' ? 'java.exe' : 'java');

if (fs.existsSync(localJava)) {
  javaCmd = localJava;
}

let jarFile = path.join(__dirname, 'app.jar');
if (!fs.existsSync(jarFile)) {
  const targetJar = path.join(__dirname, 'backend', 'target', 'school-fee-management-0.0.1-SNAPSHOT.jar');
  if (fs.existsSync(targetJar)) {
    jarFile = targetJar;
  }
}

const port = process.env.PORT || '8080';
const args = [
  `-Dserver.port=${port}`,
  '-jar',
  jarFile
];

console.log(`Starting backend with: ${javaCmd} ${args.join(' ')}`);

const child = spawn(javaCmd, args, {
  stdio: 'inherit',
  env: process.env
});

child.on('error', (err) => {
  console.error('Failed to start Java backend process:', err);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  console.log(`Backend process exited with code ${code} and signal ${signal}`);
  process.exit(code || 0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, forwarding to backend...');
  child.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, forwarding to backend...');
  child.kill('SIGINT');
});
