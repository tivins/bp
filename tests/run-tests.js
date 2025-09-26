#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('🚀 BP Test System - Starting...\n');

// Check if server is already running
function checkServer() {
  try {
    execSync('curl -s http://localhost:8080/tests/simple-test.html > nul 2>&1', { shell: true });
    return true;
  } catch {
    return false;
  }
}

async function runTests() {
  if (!checkServer()) {
    console.log('📡 Starting HTTP server...');
    const serverProcess = spawn('npm', ['run', 'http'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });

    // Wait for server to start
    console.log('⏳ Waiting for server to start...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  } else {
    console.log('✅ Server already running');
  }

  try {
    console.log('🧪 Running tests...\n');
    
    // Run simple tests
    console.log('📋 Basic tests...');
    execSync('npx playwright test simple.spec.ts', {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    console.log('\n✅ All tests completed!');
    console.log('\n📊 Reports available:');
    console.log('  - HTML Report: npx playwright show-report');
    console.log('  - Screenshots: test-results/');
    
    console.log('\n🔧 Useful commands:');
    console.log('  npm test              - All tests');
    console.log('  npm run test:ui       - UI interface');
    console.log('  npm run test:headed   - Visible tests');
    console.log('  npm run test:debug    - Debug mode');
    
  } catch (error) {
    console.error('\n❌ Test execution error:', error.message);
    process.exit(1);
  }
}

// Handle clean shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping tests...');
  process.exit(0);
});

runTests();
