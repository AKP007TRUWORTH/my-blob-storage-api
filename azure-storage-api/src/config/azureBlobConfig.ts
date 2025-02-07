
import dotenv from 'dotenv';
import { BlobServiceClient } from '@azure/storage-blob';

dotenv.config();

// Connect to Azure Blob Storage using the connection string
export const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
