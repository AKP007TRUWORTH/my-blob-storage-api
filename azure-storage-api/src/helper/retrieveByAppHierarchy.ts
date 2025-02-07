import tableClient from "../config/azureTableConfig";
import { unwrap } from "./unwrap";
import { getAppPartitionKey, getHierarchicalAppRowKey } from "../services/module";
import q from "q";

export function retrieveByAppHierarchy(appId: string, deploymentId?: string): q.Promise<any> {
    const partitionKey: string = getAppPartitionKey(appId);
    const rowKey: string = getHierarchicalAppRowKey(appId, deploymentId);
    return retrieveByKey(partitionKey, rowKey);
}

function retrieveByKey(partitionKey: string, rowKey: string): any {
    return tableClient.getEntity(partitionKey, rowKey).then((entity: any) => {
        return unwrap(entity);
    });
}