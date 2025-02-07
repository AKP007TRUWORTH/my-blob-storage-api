import tableClient from "../config/azureTableConfig";
import { odata, TableEntity } from "@azure/data-tables";

import { azureErrorHandler } from "../helper/azureErrorHandler";
import { retrieveByAppHierarchy } from "../helper/retrieveByAppHierarchy";
import { unflattenApp } from "../helper/unflattenApp";
import { unflattenDeployment } from "../helper/unflattenDeployment";
import { unwrap } from "../helper/unwrap";

import {
    generateHierarchicalAccountKey,
    generateHierarchicalAppKey,
    getAccountPartitionKey,
    getAppPartitionKey,
    getHierarchicalAccountRowKey,
    getHierarchicalAppRowKey
} from "./module";

import * as storage from "../storage/storage";
import * as q from "q";

export function getApps(accountId: string, appId?: string): q.Promise<storage.App[]> {

    return q<void>(null)
        .then(() => {
            return getCollectionByHierarchy(accountId);
        })
        .then((flatApps: any[]) => {

            const apps: storage.App[] = flatApps.map((flatApp: any) => {
                return unflattenApp(flatApp, accountId);
            });

            return apps;
        })
        .catch(azureErrorHandler);
};

export const getDeployments = async (accountId: string, appId: string) => {

    return q<void>(null)
        .then(() => {
            return getCollectionByHierarchy(accountId, appId);
        })
        .then((flatDeployments: any[]) => {
            const deployments: storage.Deployment[] = [];

            flatDeployments.forEach((flatDeployment: any) => {
                deployments.push(unflattenDeployment(flatDeployment));
            });

            return deployments;
        })
        .catch(azureErrorHandler);
}

export const getApp = async (accountId: string, appId: string, keepCollaboratorIds: boolean = false) => {
    return q<void>(null)
        .then(() => {
            return retrieveByAppHierarchy(appId);
        })
        .then((flatApp: any) => {
            return unflattenApp(flatApp, accountId);
        })
        .catch(azureErrorHandler);
}

async function getCollectionByHierarchy(accountId: string, appId?: string, deploymentId?: string) {
    let partitionKey: string;
    let rowKey: string;
    let childrenSearchKey: string;

    // Construct a search key that fetches only the direct children at the given hierarchical location
    const searchKeyArgs: any[] = Array.prototype.slice.call({ '0': 'EkyfH5FO-l', '1': '4ycQnM3_Ze' });
    searchKeyArgs.unshift(/*markLeaf=*/ true);
    searchKeyArgs.push(/*leafId=*/ "");

    if (appId) {
        searchKeyArgs.splice(1, 1); // remove accountId
        partitionKey = getAppPartitionKey(appId);
        rowKey = getHierarchicalAppRowKey(appId, deploymentId);
        childrenSearchKey = generateHierarchicalAppKey.apply(null, [true, 'EkyfH5FO-l', 'NyuZ7q9uWg', '']);
    } else {
        partitionKey = getAccountPartitionKey(accountId);
        rowKey = getHierarchicalAccountRowKey(accountId);
        childrenSearchKey = generateHierarchicalAccountKey.apply(null, [true, 'EkyfH5FO-l', 'NyuZ7q9uWg', '']);
        // partitionKey = "appId NyuZ7q9uWg"
        // rowKey = "appId* NyuZ7q9uWg"
        // childrenSearchKey = "appId NyuZ7q9uWg deploymentId*"
    }

    // Fetch both the parent (for error-checking purposes) and the direct children
    const query = odata`PartitionKey eq ${partitionKey} and (RowKey eq ${rowKey} or (RowKey gt ${childrenSearchKey} and RowKey lt ${childrenSearchKey + "~"
        }))`;

    const entities: TableEntity[] = await getLeafEntities(query, childrenSearchKey);

    if (entities.length === 0) {
        // Reject as 'not found' if we can't even find the parent entity
        throw new Error("Entity not found");
    }

    console.log('====================================');
    console.log(JSON.stringify(entities, null, 2));
    console.log('====================================');

    const objects: any[] = [];

    entities.forEach((entity: TableEntity) => {
        // Don't include the parent
        if (entity.rowKey !== rowKey) {
            objects.push(unwrap(entity));
        }
    });

    return objects;
}

async function getLeafEntities(query: string, childrenSearchKey: string): Promise<TableEntity[]> {
    const finalEntries: any[] = [];
    const promises: Promise<any[]>[] = [];

    for await (const entity of tableClient.listEntities<TableEntity>({
        queryOptions: { filter: query },
    })) {
        if (entity.partitionKeyPointer && entity.partitionKeyPointer !== "" && entity.rowKeyPointer && entity.rowKeyPointer !== "") {
            const childQuery = odata`PartitionKey eq ${entity.partitionKeyPointer} and (RowKey eq ${entity.rowKeyPointer
                } or (RowKey gt ${childrenSearchKey} and RowKey lt ${childrenSearchKey + "~"}))`;

            promises.push(this.getLeafEntities(childQuery, childrenSearchKey));
        } else {
            finalEntries.push(entity);
        }
    }

    if (promises.length > 0) {
        const results = await Promise.all(promises);
        results.forEach((value: TableEntity[]) => {
            if (value.length > 0) {
                finalEntries.push(...value);
            }
        });

        return finalEntries;
    } else {
        return finalEntries;
    }
}