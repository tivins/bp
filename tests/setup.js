#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up BP test system...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js detected: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if npm is available
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm detected: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm is not available.');
  process.exit(1);
}

// Create screenshots folder if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('✅ Screenshots folder created');
}

// Check if build exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.log('⚠️  dist folder does not exist. Running build...');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log('✅ Build completed');
  } catch (error) {
    console.error('❌ Build error:', error.message);
    process.exit(1);
  }
}

console.log('\n🎯 Installing test dependencies...');

try {
  // Installer Playwright
  execSync('npx playwright install', { stdio: 'inherit' });
  console.log('✅ Playwright installed');
} catch (error) {
  console.error('❌ Playwright installation error:', error.message);
  process.exit(1);
}

console.log('\n🚀 Setup completed!');
console.log('\nAvailable commands:');
console.log('  npm test              - Run all tests');
console.log('  npm run test:ui       - Test UI interface');
console.log('  npm run test:headed   - Tests with visible browser');
console.log('  npm run test:debug    - Debug mode');
console.log('\nTo start the development server:');
console.log('  npm run http');
console.log('\nThen in another terminal:');
console.log('  npm test');
