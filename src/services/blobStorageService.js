const { blobServiceClient } = require('../config/azureBlobConfig');

// Fetch blob content from Azure Blob Storage
async function getBlobContent(containerName, blobName) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();
    const content = await streamToString(downloadBlockBlobResponse.readableStreamBody);

    return JSON.parse(content); // Parse JSON content if needed
  } catch (error) {
    console.error('Error fetching blob content:', error.message);
    throw error;
  }
}

// Utility function to convert stream to string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (data) => chunks.push(data.toString()));
    readableStream.on('end', () => resolve(chunks.join('')));
    readableStream.on('error', reject);
  });
}

module.exports = { getBlobContent };