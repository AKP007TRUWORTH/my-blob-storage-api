// import { BlobServiceClient } from '@azure/storage-blob';
// import express from 'express';
// import { blobServiceConnect } from '../config/azureBlobConfig.js';

// const router = express.Router();

// router.get('/api/containers', async (req, res) => () => {

//     const options = {
//         includeDeleted: false,
//         includeMetadata: true,
//         includeSystem: true,
//         prefix: containerNamePrefix
//     }

//     console.log("Containers (by page):");
//     for await (const response of blobServiceClient.listContainers(options).byPage({
//         maxPageSize: 20,
//     })) {
//         console.log("- Page:");
//         if (response.containerItems) {
//             for (const container of response.containerItems) {
//                 console.log(`  - ${container.name}`);
//             }
//         }
//     }


//     // try {
//     //     const blobServiceClient = BlobServiceClient.fromConnectionString(
//     //         process.env.AZURE_STORAGE_CONNECTION_STRING
//     //     );
//     //    console.log('Blob Service Client Connected', blobServiceClient);
//     //    return blobServiceClient;
//     // } catch {
//     //     console.error('Error connecting to Blob Service Client');
//     // }



//     // try {
//     //     // Get the list of containers





//     //     const containers = [];
//     //     // for await (const container of blobServiceConnect().listContainers()) {
//     //     //     containers.push(container.name);
//     //     // }

//     //     // Send the list of containers as a response
//     //     res.status(200).json({ containers });
//     // } catch (error) {
//     //     console.error('Error listing containers:', error);
//     //     res.status(500).json({ error: 'Failed to list blob containers' });
//     // }
// });

// export { router as blobRoutes };


// routes/blobRoutes.js
import express from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential, AzureCliCredential } from '@azure/identity';
import dotenv from 'dotenv';
import { blobServiceClient } from '../config/azureBlobConfig.js';

dotenv.config();

const router = express.Router();

// Load environment variables
// const accountName = process.env.STORAGE_ACCOUNT_NAME;

// // Create BlobServiceClient instance
// const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

// // Helper function to simulate folder structure
// const listFolders = (blobList) => {
//     const folderStructure = {};

//     blobList.forEach((blob) => {
//         const parts = blob.name.split('/');
//         let currentFolder = folderStructure;

//         // Traverse the folder structure
//         parts.forEach((part, index) => {
//             if (!currentFolder[part]) {
//                 currentFolder[part] = index === parts.length - 1 ? null : {}; // leaf is null, folder is an object
//             }
//             currentFolder = currentFolder[part];
//         });
//     });

//     return folderStructure;
// };

// Route to list blob containers and their folder structure
router.get('/containers', async (req, res) => {
    try {
        // const containers = [];

        // const options = {
        //     includeDeleted: false,
        //     includeMetadata: true,
        //     includeSystem: true,
        //     prefix: "packagehistoryv1"
        // }

        // console.log("Containers (by page):");
        // for await (const response of blobServiceClient.listContainers(options).byPage({
        //     maxPageSize: 20,
        // })) {
        //     console.log("- Page:");
        //     if (response.containerItems) {
        //         for (const container of response.containerItems) {
        //             console.log(`  - ${container.name}`);
        //         }
        //     }
        // }

        // Get a reference to the container
        const containerClient = blobServiceClient.getContainerClient('packagehistoryv1');

        // Iterate through blobs
        for await (const blob of containerClient.listBlobsFlat()) {
            console.log(`- ${blob.name} | Last Modified: ${blob.properties.lastModified} | Access Tier: ${blob.properties.accessTier}`);
        }

        // for await (const container of blobServiceClient.listContainers()) {
        //     const containerName = container;

        //     const containerClient = blobServiceClient.getContainerClient(containerName);
        //     const blobList = [];

        //     //   List blobs inside the container
        //     for await (const blob of containerClient.listBlobsFlat()) {
        //         console.log('====================================');
        //         console.log(blob);
        //         console.log('====================================');
        //     }



        //     // //   Build folder structure from blobs
        //     //   const folderStructure = listFolders(blobList);
        //     //   containers.push({ containerName, folderStructure });
        // }

        res.status(200).json({ containers });
    } catch (error) {
        console.error('Error listing containers and folders:', error);
        res.status(500).json({ error: 'Failed to list blob containers and folder structure' });
    }
});

export { router as blobRoutes };