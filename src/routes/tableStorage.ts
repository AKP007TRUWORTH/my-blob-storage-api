
import express from 'express';
import { getApp, getApps, getDeployments } from '../services/tableService';
import q from 'q';

import * as storageTypes from "../storage/storage";
import * as validationUtils from "../utils/validation";
import * as restTypes from "../types/rest-definitions";
import * as converterUtils from "../utils/converter";
import * as error from "../error";
import * as errorUtils from "../utils/rest-error-handling";
import { AzureStorage } from '../storage/azure-storage';

const router = express.Router();

router.get("/apps", async (req, res) => {
    const appId = "4ycQnM3_Ze"
    const accountId: string = "EkyfH5FO-l";

    getApps(accountId)
        .then((apps: storageTypes.App[]) => {
           

            const restAppPromises: Promise<restTypes.App>[] = apps.map(async (app: storageTypes.App) => {
                return getDeployments(accountId, app.id).then((deployments: storageTypes.Deployment[]) => {
                    const deploymentNames: string[] = deployments.map((deployment: storageTypes.Deployment) => deployment?.name);
                    return converterUtils.toRestApp(app, app?.name, deploymentNames);
                });
            });
            return q.all(restAppPromises);
        })
        .then((restApps: restTypes.App[]) => {
            res.send({ apps: converterUtils.sortAndUpdateDisplayNameOfRestAppsList(restApps) });
        })
    // .catch((error: error.CodePushError) => errorUtils.restErrorHandler(res, error, next))
});


router.get("/app", async (req, res) => {
    const appId = "4ycQnM3_Ze"
    const accountId: string = "EkyfH5FO-l";

    getApp(accountId, appId).then((app: any) => {
        return res.send(app);
    })
})

export { router as tableStorageRoutes };