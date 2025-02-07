import nodeDeepCopy = require("node-deepcopy");

import {
    AccessKey,
    AccessKeyRequest,
    Account,
    App,
    AppCreationRequest,
    CollaboratorMap,
    CollaboratorProperties,
    Deployment,
    DeploymentMetrics,
    Package,
} from "../types/rest-definitions";
import Storage = require("../storage/storage");


export function sortAndUpdateDisplayNameOfRestAppsList(apps: App[]): App[] {
    const nameToCountMap: { [name: string]: number } = {};
    apps.forEach((app: App) => {
        nameToCountMap[app.name] = nameToCountMap[app.name] || 0;
        nameToCountMap[app.name]++;
    });

    return apps
        .sort((first: App, second: App) => {
            // Sort by raw name instead of display name
            return first.name.localeCompare(second.name);
        })
        .map((app: App) => {
            const storageApp = toStorageApp(app, 0);

            let name: string = app.name;
            if (nameToCountMap[app.name] > 1 && !Storage.isOwnedByCurrentUser(storageApp)) {
                const ownerEmail: string = Storage.getOwnerEmail(storageApp);
                name = `${ownerEmail}:${app.name}`;
            }

            return toRestApp(storageApp, name, app.deployments);
        });
}

export function toStorageApp(restApp: App, createdTime: number): Storage.App {
    const storageApp: Storage.App = {
        createdTime: createdTime,
        name: restApp.name,
        collaborators: toStorageCollaboratorMap(restApp.collaborators),
    };
    return storageApp;
}

export function toRestApp(storageApp: Storage.App, displayName: string, deploymentNames: string[]): App {
    const sortedDeploymentNames: string[] = deploymentNames
        ? deploymentNames.sort((first: string, second: string) => {
            return first.localeCompare(second);
        })
        : null;

    return <App>{
        name: displayName,
        collaborators: toRestCollaboratorMap(storageApp.collaborators),
        deployments: sortedDeploymentNames,
    };
}

export function toStorageCollaboratorMap(restCollaboratorMap: CollaboratorMap): Storage.CollaboratorMap {
    if (!restCollaboratorMap) return null;

    return <Storage.CollaboratorMap>nodeDeepCopy.deepCopy(restCollaboratorMap);
}

export function toRestCollaboratorMap(storageCollaboratorMap: Storage.CollaboratorMap): CollaboratorMap {
    const collaboratorMap: CollaboratorMap = {};

    Object.keys(storageCollaboratorMap)
        .sort()
        .forEach(function (key: string) {
            collaboratorMap[key] = <CollaboratorProperties>{
                isCurrentAccount: storageCollaboratorMap[key].isCurrentAccount,
                permission: storageCollaboratorMap[key].permission,
            };
        });

    return collaboratorMap;
}

export function toRestAccount(storageAccount: Storage.Account): Account {
  throw new Error("Function not implemented.");
}
