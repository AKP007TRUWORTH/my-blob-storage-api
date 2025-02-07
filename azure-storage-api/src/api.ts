import { Router } from "express";

import { getManagementRouter, ManagementConfig } from "./routes/management";
import { PassportAuthentication, AuthenticationConfig } from "./routes/passport-authentication";

export function auth(config: AuthenticationConfig): any {
    const passportAuthentication = new PassportAuthentication(config);
    return {
        router: passportAuthentication.getRouter.bind(passportAuthentication),
        legacyRouter: passportAuthentication.getLegacyRouter.bind(passportAuthentication),
        authenticate: passportAuthentication.authenticate,
    };
}

export function management(config: ManagementConfig): Router {
    return getManagementRouter(config);
}
