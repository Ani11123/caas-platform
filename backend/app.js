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
  region: 'us-east-1'  // Use your desired AWS region
});

// Set up AWS Config service
const configService = new AWS.ConfigService();

// Default route for testing the server
app.get('/', (req, res) => {
  res.send('Welcome to the CaaS backend!');
});

// Route to fetch compliance status
app.get('/compliance-status', (req, res) => {
  // Define the parameters to get compliance details
  const params = {
    ComplianceType: 'COMPLIANT', // You can change this to NON_COMPLIANT if needed
    Limit: 10 // Return the first 10 compliance results
  };

  // Call AWS Config to get compliance details
  configService.describeComplianceByConfigRule(params, (err, data) => {
    if (err) {
      console.error('Error fetching compliance data:', err);
      return res.status(500).json({ error: 'Failed to fetch compliance data' });
    }
    // Send the compliance data as a response
    res.json(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

