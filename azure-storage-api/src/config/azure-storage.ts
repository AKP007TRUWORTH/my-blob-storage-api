import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import {
    TableServiceClient,
    TableClient,
    AzureNamedKeyCredential,
    GetTableEntityResponse,
    TableEntity,
    odata,
    TransactionAction,
    CreateDeleteEntityAction,
} from "@azure/data-tables";

const AzureStorage = () => {
    const tableClient = TableClient
    const blobService = BlobServiceClient
}

// const setup = (accountName: any, accountKey: any) => {
//     let tableServiceClient
//     let tableClient
//     let blobServiceClient

//     if (process.env.EMULATED) {
//         const devConnectionString = "UseDevelopmentStorage=true";

//         tableServiceClient = TableServiceClient.fromConnectionString(devConnectionString);
//         tableClient = TableClient.fromConnectionString(devConnectionString, AzureStorage.TABLE_NAME);
//         blobServiceClient = BlobServiceClient.fromConnectionString(devConnectionString);
//     } else {
//         if ((!accountName && !process.env.AZURE_STORAGE_ACCOUNT) || (!accountKey && !process.env.AZURE_STORAGE_ACCESS_KEY)) {
//             throw new Error("Azure credentials not set");
//         }

//         const _accountName = accountName ?? process.env.AZURE_STORAGE_ACCOUNT;
//         const _accountKey = accountKey ?? process.env.AZURE_STORAGE_ACCESS_KEY;

//         const tableStorageCredential = new AzureNamedKeyCredential(_accountName, _accountKey);
//         const blobStorageCredential = new StorageSharedKeyCredential(_accountName, _accountKey);

//         const tableServiceUrl = `https://${_accountName}.table.core.windows.net`;
//         const blobServiceUrl = `https://${_accountName}.blob.core.windows.net`;

//         tableServiceClient = new TableServiceClient(tableServiceUrl, tableStorageCredential, {
//             retryOptions: {
//                 maxRetries: 3,
//                 maxRetryDelayInMs: 2000,
//                 retryDelayInMs: 500,
//             },
//         });
//         tableClient = new TableClient(tableServiceUrl, AzureStorage.TABLE_NAME, tableStorageCredential);
//         blobServiceClient = new BlobServiceClient(blobServiceUrl, blobStorageCredential, {
//             retryOptions: {
//                 maxTries: 4,
//                 maxRetryDelayInMs: 2000,
//                 retryDelayInMs: 500,
//             },
//         });
//     }
// }