import * as storage from "../storage/storage";

export function unflattenApp(flatApp: any, currentAccountId: string): storage.App {
    flatApp.collaborators = flatApp.collaborators ? JSON.parse(flatApp.collaborators) : {};

    const currentUserEmail: string = getEmailForAccountId(flatApp.collaborators, currentAccountId);
    if (currentUserEmail && flatApp.collaborators[currentUserEmail]) {
        flatApp.collaborators[currentUserEmail].isCurrentAccount = true;
    }

    return flatApp;
}

function getEmailForAccountId(collaboratorsMap: storage.CollaboratorMap, accountId: string): string {
    if (collaboratorsMap) {
        for (const email of Object.keys(collaboratorsMap)) {
            if ((<storage.CollaboratorProperties>collaboratorsMap[email]).accountId === accountId) {
                return email;
            }
        }
    }

    return null;
}
