import { Request, Response, Router } from "express";
import * as q from "q";
import * as error from "../error";
import * as storageTypes from "../storage/storage";
import * as restTypes from "../types/rest-definitions";
import * as converterUtils from "../utils/converter";

import * as errorUtils from "../utils/rest-error-handling";

const ACCESS_KEY_MASKING_STRING = "(hidden)";

import NameResolver = storageTypes.NameResolver;

import Promise = q.Promise;

export interface ManagementConfig {
  storage: storageTypes.Storage;
}

export function getManagementRouter(config: ManagementConfig): Router {
  const storage: storageTypes.Storage = config.storage;
  const router: Router = Router();

  const nameResolver: NameResolver = new NameResolver(config.storage);

  router.get("/account", (req: Request, res: Response, next: (err?: any) => void): any => {
    const accountId: string = req.user.id;
    
    storage
      .getAccount(accountId)
      .then((storageAccount: storageTypes.Account) => {
        // const restAccount: restTypes.Account = converterUtils.toRestAccount(storageAccount);
        res.send({ account: storageAccount });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  router.get("/accessKeys", (req: Request, res: Response, next: (err?: any) => void): any => {
    const accountId: string = "EkyfH5FO-l";

    storage
      .getAccessKeys(accountId)
      .then((accessKeys: storageTypes.AccessKey[]): void => {
        accessKeys.sort((first: storageTypes.AccessKey, second: storageTypes.AccessKey) => {
          const firstTime = first.createdTime || 0;
          const secondTime = second.createdTime || 0;
          return firstTime - secondTime;
        });

        // Hide the actual key string and replace it with a message for legacy CLIs (up to 1.11.0-beta) that still try to display it
        accessKeys.forEach((accessKey: restTypes.AccessKey) => {
          accessKey.name = ACCESS_KEY_MASKING_STRING;
        });

        res.send({ accessKeys: accessKeys });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  router.get("/accessKeys/:accessKeyName", (req: Request, res: Response, next: (err?: any) => void): any => {
    const accessKeyName: string = req.params.accessKeyName;
    const accountId: string = "EkyfH5FO-l";

    nameResolver
      .resolveAccessKey(accountId, accessKeyName)
      .then((accessKey: storageTypes.AccessKey): void => {
        delete accessKey.name;
        res.send({ accessKey: accessKey });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  router.get("/apps", (req: Request, res: Response, next: (err?: any) => void): any => {

    const accountId: string = "EkyfH5FO-l";

    storage
      .getApps(accountId)
      .then((apps: storageTypes.App[]) => {
        const restAppPromises: Promise<restTypes.App>[] = apps.map((app: storageTypes.App) => {
          return storage.getDeployments(accountId, app.id).then((deployments: storageTypes.Deployment[]) => {
            const deploymentNames: string[] = deployments.map((deployment: storageTypes.Deployment) => deployment.name);
            return converterUtils.toRestApp(app, app.name, deploymentNames);
          });
        });

        return q.all(restAppPromises);
      })
      .then((restApps: restTypes.App[]) => {
        res.send({ apps: converterUtils.sortAndUpdateDisplayNameOfRestAppsList(restApps) });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  router.get("/apps/:appName", (req: Request, res: Response, next: (err?: any) => void): any => {
    const accountId: string = "EkyfH5FO-l";
    const appName: string = req.params.appName;
    let storageApp: storageTypes.App;

    nameResolver
      .resolveApp(accountId, appName)
      .then((app: storageTypes.App) => {
        storageApp = app;
        return storage.getDeployments(accountId, app.id);
      })
      .then((deployments: storageTypes.Deployment[]) => {
        const deploymentNames: string[] = deployments.map((deployment) => deployment.name);
        res.send({ app: converterUtils.toRestApp(storageApp, /*displayName=*/ appName, deploymentNames) });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  router.get("/apps/:appName/deployments", (req: Request, res: Response, next: (err?: any) => void): any => {
    const accountId: string = "EkyfH5FO-l";
    const appName: string = req.params.appName;
    let appId: string;

    nameResolver
      .resolveApp(accountId, appName)
      .then((app: storageTypes.App) => {
        appId = app.id;
        throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
        return storage.getDeployments(accountId, appId);
      })
      .then((deployments: storageTypes.Deployment[]) => {
        deployments.sort((first: restTypes.Deployment, second: restTypes.Deployment) => {
          return first.name.localeCompare(second.name);
        });

        res.send({ deployments: deployments });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  router.get("/apps/:appName/deployments/:deploymentName", (req: Request, res: Response, next: (err?: any) => void): any => {
    const accountId: string = "EkyfH5FO-l";
    const appName: string = req.params.appName;
    const deploymentName: string = req.params.deploymentName;
    let appId: string;

    nameResolver
      .resolveApp(accountId, appName)
      .then((app: storageTypes.App) => {
        appId = app.id;
        throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
        return nameResolver.resolveDeployment(accountId, appId, deploymentName);
      })
      .then((deployment: storageTypes.Deployment) => {
        // const restDeployment: restTypes.Deployment = converterUtils.toRestDeployment(deployment);
        res.send({ deployment: deployment });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  router.get("/apps/:appName/deployments/:deploymentName/history", (req: Request, res: Response, next: (err?: any) => void): any => {
    const accountId: string = "EkyfH5FO-l";
    const appName: string = req.params.appName;
    const deploymentName: string = req.params.deploymentName;
    let appId: string;

    nameResolver
      .resolveApp(accountId, appName)
      .then((app: storageTypes.App) => {
        appId = app.id;
        throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
        return nameResolver.resolveDeployment(accountId, appId, deploymentName);
      })
      .then((deployment: storageTypes.Deployment): Promise<storageTypes.Package[]> => {
        return storage.getPackageHistory(accountId, appId, deployment.id);
      })
      .then((packageHistory: storageTypes.Package[]) => {
        res.send({ history: packageHistory });
      })
      .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
      .done();
  });

  // router.get("/apps/:appName/deployments/:deploymentName/metrics", (req: Request, res: Response, next: (err?: any) => void): any => {
  //   if (!redisManager.isEnabled) {
  //     res.send({ metrics: {} });
  //   } else {
  //     const accountId: string = req.user.id;
  //     const appName: string = req.params.appName;
  //     const deploymentName: string = req.params.deploymentName;
  //     let appId: string;

  //     nameResolver
  //       .resolveApp(accountId, appName)
  //       .then((app: storageTypes.App) => {
  //         appId = app.id;
  //         throwIfInvalidPermissions(app, storageTypes.Permissions.Collaborator);
  //         return nameResolver.resolveDeployment(accountId, appId, deploymentName);
  //       })
  //       .then((deployment: storageTypes.Deployment): Promise<redis.DeploymentMetrics> => {
  //         return redisManager.getMetricsWithDeploymentKey(deployment.key);
  //       })
  //       .then((metrics: redis.DeploymentMetrics) => {
  //         const deploymentMetrics: restTypes.DeploymentMetrics = converterUtils.toRestDeploymentMetrics(metrics);
  //         res.send({ metrics: deploymentMetrics });
  //       })
  //       .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
  //       .done();
  //   }
  // });

  return router;
}

function throwIfInvalidPermissions(app: storageTypes.App, requiredPermission: string): boolean {
  const collaboratorsMap: storageTypes.CollaboratorMap = app.collaborators;

  let isPermitted: boolean = false;

  if (collaboratorsMap) {
    for (const email of Object.keys(collaboratorsMap)) {
      if ((<storageTypes.CollaboratorProperties>collaboratorsMap[email]).isCurrentAccount) {
        const permission: string = collaboratorsMap[email].permission;
        isPermitted = permission === storageTypes.Permissions.Owner || permission === requiredPermission;
        break;
      }
    }
  }

  if (!isPermitted)
    throw errorUtils.restError(
      errorUtils.ErrorCode.Unauthorized,
      "This action requires " + requiredPermission + " permissions on the app!"
    );

  return true;
}
