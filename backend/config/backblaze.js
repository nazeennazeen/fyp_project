// config/backblaze.js
// Configures the AWS SDK v3 client to connect to Backblaze B2
// Backblaze B2 supports the S3-compatible API, so we use @aws-sdk/client-s3

const { S3Client } = require('@aws-sdk/client-s3');

// Create a reusable S3 client configured for Backblaze B2
const b2Client = new S3Client({
  endpoint: process.env.B2_ENDPOINT,       // e.g. https://s3.us-west-004.backblazeb2.com
  region: process.env.B2_REGION,           // e.g. us-west-004
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,               // Backblaze Key ID
    secretAccessKey: process.env.B2_APPLICATION_KEY,  // Backblaze Application Key
  },
  // Force path-style URLs required by some S3-compatible services
  forcePathStyle: false,
});

module.exports = b2Client;
