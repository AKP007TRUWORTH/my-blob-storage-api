// import { TableClient, TableServiceClient } from "@azure/data-tables";
// import { BlobServiceClient } from "@azure/storage-blob";
// import Q from "q";

// let tableServiceClient: TableServiceClient;
// let tableClient: TableClient;
// let blobServiceClient: BlobServiceClient;


// export const _setupPromise = async (accountName?: string, accountKey?: string) => {

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

//     const tableHealthEntity: any = this.wrap({ health: "health" }, /*partitionKey=*/ "health", /*rowKey=*/ "health");

//     return Q
//         .all([
//             tableServiceClient.createTable(AzureStorage.TABLE_NAME),
//             blobServiceClient.createContainer(AzureStorage.TABLE_NAME, { access: "blob" }),
//             blobServiceClient.createContainer(AzureStorage.HISTORY_BLOB_CONTAINER_NAME),
//         ])
//         .then(() => {
//             return q.all<any>([
//                 tableClient.createEntity(tableHealthEntity),
//                 blobServiceClient.getContainerClient(AzureStorage.TABLE_NAME).uploadBlockBlob("health", "health", "health".length),
//                 blobServiceClient
//                     .getContainerClient(AzureStorage.HISTORY_BLOB_CONTAINER_NAME)
//                     .uploadBlockBlob("health", "health", "health".length),
//             ]);
//         })
//         .then(() => {
//             // Do not assign these unless everything completes successfully, as this will cause in-flight promise chains to start using
//             // the initialized services
//             _tableClient = tableClient;
//             _blobService = blobServiceClient;
//         })
//         .catch((error) => {
//             if (error.code == "ContainerAlreadyExists") {
//                 _tableClient = tableClient;
//                 _blobService = blobServiceClient;
//             } else {
//                 throw error;
//             }
//         });
// }