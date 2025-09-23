const http = require('http');

// Test the backend API
async function testBackend() {
  console.log('🧪 Testing Backend API...\n');
  
  const baseUrl = 'http://localhost:5000';
  
  const tests = [
    { name: 'Health Check', path: '/api/health', method: 'GET' },
    { name: 'Root Endpoint', path: '/', method: 'GET' },
    { name: 'Projects (Public)', path: '/api/projects', method: 'GET' }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await makeRequest(`${baseUrl}${test.path}`, test.method);
      console.log(`✅ ${test.name}: ${response.status}`);
      if (response.data) {
        console.log(`   Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
    console.log('');
  }
}

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Run tests
testBackend().catch(console.error);
