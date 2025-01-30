// Route to fetch JSON from Azure Blob Storage
import express from 'express';
import { streamToString } from '../helper/streamToString.js';
import { blobServiceClient } from '../config/azureBlobConfig.js';

const router = express.Router();

router.get("/get-json", async (req, res) => {
    const { blobName, containerName } = req.query;

    const containerClient = blobServiceClient.getContainerClient(containerName ?? "packagehistoryv1");

    try {
        const jsonData = await getBlobContent(blobName ?? "41bfsC_DB-e", containerClient);

        if (jsonData) {
            res.json(jsonData);
        } else {
            res.status(404).json({ error: "File not found or invalid JSON" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function getBlobContent(blobName, containerClient) {
    try {
        const blobClient = containerClient.getBlobClient(blobName);
        const downloadBlockBlobResponse = await blobClient.download();
        const downloadedContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        return JSON.parse(downloadedContent);
    } catch (error) {
        console.error("Error fetching blob:", error.message);
        return null;
    }
}

export { router as blobHistoryList };
