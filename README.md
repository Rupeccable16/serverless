# Serverless

This repository contains a Node.js AWS Lambda function designed for serverless deployments. Follow the instructions below to prepare and deploy your function.

## Deployment Options

You can deploy your Lambda function using one of the following methods:

1. **S3 Bucket**: Upload the zipped code to an S3 bucket and provide the S3 URL during deployment.
2. **Local Zip File**: Directly upload the zipped file while creating or updating the Lambda function.

## Prerequisites

Before zipping your project files for deployment, make sure to:

1. Install dependencies:
   ```bash
   npm install