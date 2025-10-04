#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const TIMEOUT = 30000; // 30 seconds

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function checkServerHealth() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}`, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Server is responding with status 200');
        resolve(true);
      } else {
        console.log(`❌ Server responded with status ${res.statusCode}`);
        reject(new Error(`Server returned status ${res.statusCode}`));
      }
    });

    req.on('error', (err) => {
      console.log('❌ Server is not responding:', err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log('❌ Server request timed out');
      reject(new Error('Request timeout'));
    });
  });
}

function checkHealthEndpoint() {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${PORT}/api/health`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('✅ Health endpoint is working:', health);
          resolve(true);
        } catch (err) {
          console.log('⚠️  Health endpoint returned invalid JSON');
          resolve(false);
        }
      });
    });

    req.on('error', () => {
      console.log('⚠️  Health endpoint not available (this is optional)');
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.log('⚠️  Health endpoint request timed out');
      resolve(false);
    });
  });
}

function checkStaticFiles() {
  const staticFiles = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ];

  return Promise.all(staticFiles.map(file => {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${PORT}${file}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ Static file ${file} is accessible`);
          resolve(true);
        } else {
          console.log(`⚠️  Static file ${file} returned status ${res.statusCode}`);
          resolve(false);
        }
      });

      req.on('error', () => {
        console.log(`⚠️  Static file ${file} is not accessible`);
        resolve(false);
      });

      req.setTimeout(3000, () => {
        console.log(`⚠️  Static file ${file} request timed out`);
        resolve(false);
      });
    });
  }));
}

async function testProductionBuild() {
  console.log('🚀 Starting production build test...\n');

  // Check if build output exists
  const buildDir = path.join(__dirname, '..', 'out');
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build output directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  console.log('✅ Build output directory exists');

  // Start the production server
  console.log('🔄 Starting production server...');
  const server = spawn('npm', ['start'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });

  let serverStarted = false;
  let serverOutput = '';

  server.stdout.on('data', (data) => {
    const output = data.toString();
    serverOutput += output;
    console.log('Server:', output.trim());
    
    if (output.includes('ready') && output.includes('started server')) {
      serverStarted = true;
    }
  });

  server.stderr.on('data', (data) => {
    console.error('Server Error:', data.toString());
  });

  // Wait for server to start
  console.log('⏳ Waiting for server to start...');
  const startTime = Date.now();
  
  while (!serverStarted && (Date.now() - startTime) < TIMEOUT) {
    await sleep(1000);
  }

  if (!serverStarted) {
    console.error('❌ Server failed to start within timeout period');
    console.error('Server output:', serverOutput);
    server.kill();
    process.exit(1);
  }

  console.log('✅ Server started successfully\n');

  try {
    // Test server health
    await checkServerHealth();
    
    // Test health endpoint
    await checkHealthEndpoint();
    
    // Test static files
    await checkStaticFiles();
    
    console.log('\n🎉 All production tests passed!');
    
  } catch (error) {
    console.error('\n❌ Production test failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up
    console.log('\n🔄 Stopping server...');
    server.kill();
    await sleep(2000);
    console.log('✅ Server stopped');
  }
}

// Run the test
testProductionBuild().catch(console.error);
