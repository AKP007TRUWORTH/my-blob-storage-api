
import * as storage from "../storage/storage";

const DELIMITER = " ";
const LEAF_MARKER = "*";

export function getAccountPartitionKey(accountId: string): string {
    validateParameters(Array.prototype.slice.apply(arguments));
    return "accountId" + DELIMITER + accountId;
}

export function getHierarchicalAccountRowKey(accountId: string, appId?: string): string {
    validateParameters(Array.prototype.slice.apply(arguments));
    return generateHierarchicalAccountKey(/*markLeaf=*/ true, accountId, appId);
}

export function generateHierarchicalAccountKey(markLeaf: boolean, accountId: string, appId?: string): string {
    validateParameters(Array.prototype.slice.apply(arguments).slice(1));
    let key = delimit("accountId", accountId, /*prependDelimiter=*/ false);

    if (typeof appId !== "undefined") {
        key += delimit("appId", appId);
    }

    // Mark leaf key with a '*', e.g. 'accountId 123 appId 456' -> 'accountId 123 appId* 456'
    if (markLeaf) {
        const lastIdDelimiter: number = key.lastIndexOf(DELIMITER);
        key = key.substring(0, lastIdDelimiter) + LEAF_MARKER + key.substring(lastIdDelimiter);
    }

    return key;
}

export function getAppPartitionKey(appId: string): string {
    validateParameters(Array.prototype.slice.apply(arguments));
    return "appId" + DELIMITER + appId;
}

export function getHierarchicalAppRowKey(appId?: string, deploymentId?: string): string {
    validateParameters(Array.prototype.slice.apply(arguments));
    return generateHierarchicalAppKey(/*markLeaf=*/ true, appId, deploymentId);
}

export function generateHierarchicalAppKey(markLeaf: boolean, appId: string, deploymentId?: string): string {
    validateParameters(Array.prototype.slice.apply(arguments).slice(1));
    let key = delimit("appId", appId, /*prependDelimiter=*/ false);

    if (typeof deploymentId !== "undefined") {
        key += delimit("deploymentId", deploymentId);
    }

    // Mark leaf key with a '*', e.g. 'appId 123 deploymentId 456' -> 'appId 123 deploymentId* 456'
    if (markLeaf) {
        const lastIdDelimiter: number = key.lastIndexOf(DELIMITER);
        key = key.substring(0, lastIdDelimiter) + LEAF_MARKER + key.substring(lastIdDelimiter);
    }

    return key;
}

// Last layer of defense against uncaught injection attacks - raise an uncaught exception
function validateParameters(parameters: string[]): void {
    parameters.forEach((parameter: string): void => {
        if (parameter && (parameter?.indexOf(DELIMITER) >= 0 || parameter?.indexOf(LEAF_MARKER) >= 0)) {
            throw storage.storageError(storage.ErrorCode.Invalid, `The parameter '${parameter}' contained invalid characters.`);
        }
    });
}

function delimit(fieldName: string, value: string, prependDelimiter = true): string {
    const prefix = prependDelimiter ? DELIMITER : "";
    return prefix + fieldName + DELIMITER + value;
}