const { spawn } = require('child_process');
const path = require('path');

console.log('🌿 Iniciando entorno completo de CasaViva (Servidor API + Frontend React)...');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Iniciar servidor backend
const serverProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Iniciar frontend cliente
const clientProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  console.log('\n🌿 Deteniendo CasaViva...');
  serverProcess.kill('SIGINT');
  clientProcess.kill('SIGINT');
  process.exit();
});
