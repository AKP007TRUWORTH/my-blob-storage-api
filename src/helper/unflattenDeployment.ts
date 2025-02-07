import * as storage from "../storage/storage";

export function unflattenDeployment(flatDeployment: any): storage.Deployment {
    delete flatDeployment.packageHistory;
    flatDeployment.package = flatDeployment.package ? JSON.parse(flatDeployment.package) : null;

    return flatDeployment;
}