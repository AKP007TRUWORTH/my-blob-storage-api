require('dotenv').config();
// const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require('@azure/storage-blob');

// Connect to Azure Blob Storage using the connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);

module.exports = { blobServiceClient };
