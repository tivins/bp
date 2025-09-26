#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('🚀 Quick test of BP application...\n');

// Start HTTP server in background
console.log('📡 Starting HTTP server...');
const serverProcess = spawn('npm', ['run', 'http'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'pipe'
});

// Wait for server to start
setTimeout(async () => {
  try {
    console.log('🧪 Running quick test...');
    
    // Run quick test
    execSync('npx playwright test quick-test.spec.ts --headed', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('\n✅ Quick test successful!');
    console.log('\nTo run all tests:');
    console.log('  npm test');
    console.log('\nFor test UI interface:');
    console.log('  npm run test:ui');
    
  } catch (error) {
    console.error('\n❌ Quick test failed:', error.message);
  } finally {
    // Stop server
    serverProcess.kill();
    console.log('\n🛑 Server stopped');
  }
}, 3000);

// Handle clean shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping test...');
  serverProcess.kill();
  process.exit(0);
});
