// Load environment variables
require('dotenv').config();

// Import necessary modules
const express = require('express');
const AWS = require('aws-sdk');

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Configure AWS SDK with credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

// Set up AWS Config service
const configService = new AWS.ConfigService();

// Default route for testing the server
app.get('/', (req, res) => {
  res.send('Welcome to the CaaS backend!');
});

// Route to fetch compliance status
app.get('/compliance-status', (req, res) => {
  const params = {
    ComplianceType: 'NON_COMPLIANT', // Change to COMPLIANT if needed
    Limit: 10
  };

  // Call AWS Config to get compliance details
  configService.describeComplianceByConfigRule(params, (err, data) => {
    if (err) {
      console.error('AWS Config Error:', err); // Log error for debugging
      return res.status(500).json({ error: 'Failed to fetch compliance data', details: err.message });
    }
    // Send compliance data as a response
    res.json(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

