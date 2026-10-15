// scratch/push-to-github.js
// Pushes all project files to GitHub repository using GitHub Git Data API

const fs = require('fs');
const path = require('path');
const https = require('https');

const OWNER = 'nazeennazeen';
const REPO = 'fyp_project';
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Helper to make GitHub API requests
function githubRequest(token, method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request(
      {
        hostname: 'api.github.com',
        path: endpoint,
        method: method,
        headers: {
          'User-Agent': 'Node-GitHub-Pusher',
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
          ...(data
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
              }
            : {}),
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(raw));
            } catch (e) {
              resolve(raw);
            }
          } else {
            reject(new Error(`GitHub API [${res.statusCode}] ${res.statusMessage}: ${raw}`));
          }
        });
      }
    );

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

// Get all files recursively except node_modules, .env, .git, scratch, etc.
function getFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (['node_modules', '.env', '.git', 'scratch', 'npm-bootstrap'].includes(file)) continue;
    const fullPath = path.join(dir, file);
    const relPath = path.posix.join(base, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, relPath));
    } else {
      results.push({ fullPath, relPath });
    }
  }
  return results;
}

async function push(token) {
  if (!token || !token.trim()) {
    console.error('Error: GitHub token is required.');
    process.exit(1);
  }
  token = token.trim();

  console.log(`🚀 Starting push to https://github.com/${OWNER}/${REPO}...`);

  const files = getFiles(PROJECT_ROOT);
  console.log(`📁 Found ${files.length} project files to upload.`);

  // 1. Create blobs for each file
  const treeItems = [];
  for (const f of files) {
    const content = fs.readFileSync(f.fullPath);
    const isBinary = /[\x00-\x08\x0E-\x1F]/.test(content.slice(0, 512).toString('binary'));
    const blobData = {
      content: content.toString(isBinary ? 'base64' : 'utf8'),
      encoding: isBinary ? 'base64' : 'utf-8',
    };

    const blob = await githubRequest(token, 'POST', `/repos/${OWNER}/${REPO}/git/blobs`, blobData);
    treeItems.push({
      path: f.relPath,
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    });
    process.stdout.write(`  ✓ ${f.relPath}\n`);
  }

  // 2. Create Git tree
  console.log('🌳 Creating Git tree...');
  const tree = await githubRequest(token, 'POST', `/repos/${OWNER}/${REPO}/git/trees`, {
    tree: treeItems,
  });

  // 3. Create Commit
  console.log('📝 Creating initial commit...');
  const commit = await githubRequest(token, 'POST', `/repos/${OWNER}/${REPO}/git/commits`, {
    message: 'Initial commit: WanderVista Tourism Booking Website (University Project)',
    tree: tree.sha,
    parents: [],
  });

  // 4. Update or create branch ref
  console.log('🌿 Updating main branch ref...');
  try {
    await githubRequest(token, 'POST', `/repos/${OWNER}/${REPO}/git/refs`, {
      ref: 'refs/heads/main',
      sha: commit.sha,
    });
  } catch (err) {
    // If ref already exists, update it with PATCH
    await githubRequest(token, 'PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/main`, {
      sha: commit.sha,
      force: true,
    });
  }

  console.log('🎉 SUCCESS! All files pushed to https://github.com/' + OWNER + '/' + REPO);
}

const tokenArg = process.argv[2] || process.env.GITHUB_TOKEN;
push(tokenArg).catch((e) => {
  console.error('❌ Push failed:', e.message);
  process.exit(1);
});
