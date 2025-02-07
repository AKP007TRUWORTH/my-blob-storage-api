import { config } from 'dotenv';
import { TableClient } from '@azure/data-tables';

config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const tableName = process.env.AZURE_TABLE_NAME!;

if (!connectionString || !tableName) {
  throw new Error("Missing Azure configuration in .env file.");
}

const tableClient = TableClient.fromConnectionString(connectionString, tableName,{
    allowInsecureConnection: true
});

export default tableClient;