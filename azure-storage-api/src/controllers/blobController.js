const { BlobServiceClient } = require('@azure/storage-blob');
// const { getBlobContent } = require('../services/blobStorageService');

// Controller to fetch a specific blob's content
async function fetchCodePushJSON(req, res) {
    const { containerName, blobName } = req.params;
    // console.log('====================================');
    // console.log(containerName, blobName);
    // console.log('====================================');

    try {
        const blobList = [];
        const containerClient = await BlobServiceClient.getContainerClient('devstoreaccount1');

        console.log(containerClient, 'containerClient');
        

        for await (const blob of containerClient.listBlobsFlat()) {
          blobList.push(blob.name);
        }
        res.json(blobList);


        // res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { fetchCodePushJSON };