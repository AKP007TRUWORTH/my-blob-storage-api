import express from 'express';
import { blobServiceClient } from '../config/azureBlobConfig.js';

const router = express.Router();

router.get("/containers", async (req, res) => {
    try {
        // Get a reference to the container
        const containerName = "packagehistoryv1";
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Array to store blob details
        const blobsList = [];

        // Iterate through blobs and collect their metadata
        for await (const blob of containerClient.listBlobsFlat()) {
            blobsList.push({
                name: blob.name,
                lastModified: blob.properties.lastModified,
                accessTier: blob.properties.accessTier,
                contentLength: blob.properties.contentLength,
                blobType: blob.properties.blobType
            });
        }

        // Send the response as JSON
        res.status(200).json({
            container: containerName,
            totalBlobs: blobsList.length,
            blobs: blobsList
        });
    } catch (error) {
        console.error("Error listing blobs:", error);
        res.status(500).json({ error: "Failed to list blob containers and files" });
    }
});

export { router as containerList };