import { AzureStorage } from "./storage/azure-storage";
import { fileUploadMiddleware } from "./file-upload-manager";
import { Storage } from "./storage/storage";
import { Response } from "express";
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

import * as api from "./api";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as q from "q";

const domain = require("express-domain-middleware");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();

interface Secret {
    id: string;
    value: string;
}

export function start(done: (err?: any, server?: express.Express, storage?: Storage) => void, useJsonStorage?: boolean): void {
    let storage: Storage;
    let isKeyVaultConfigured: boolean;

    q<void>(null)
        .then(async () => {
            if (!process.env.AZURE_KEYVAULT_ACCOUNT) {
                storage = new AzureStorage();
            } else {
                isKeyVaultConfigured = true;

                const credential = new DefaultAzureCredential();

                const vaultName = process.env.AZURE_KEYVAULT_ACCOUNT;
                const url = `https://${vaultName}.vault.azure.net`;

                const keyvaultClient = new SecretClient(url, credential);
                const secret = await keyvaultClient.getSecret(`storage-${process.env.AZURE_STORAGE_ACCOUNT}`);
                storage = new AzureStorage(process.env.AZURE_STORAGE_ACCOUNT, secret);
            }
        })
        .then(() => {
            const app = express();

            const auth = api.auth({ storage: storage });

            app.use(cors())

            app.use(morgan('dev'));

            app.use(domain);

            // Monkey-patch res.send and res.setHeader to no-op after the first call and prevent "already sent" errors.
            app.use((req: express.Request, res: express.Response, next: (err?: any) => void): any => {
                const originalSend = res.send;
                const originalSetHeader = res.setHeader;
                res.setHeader = (name: string, value: string | number | readonly string[]): Response => {
                    if (!res.headersSent) {
                        originalSetHeader.apply(res, [name, value]);
                    }

                    return {} as Response;
                };

                res.send = (body: any) => {
                    if (res.headersSent) {
                        return res;
                    }

                    return originalSend.apply(res, [body]);
                };

                next();
            });

            if (process.env.LOGGING) {
                app.use((req: express.Request, res: express.Response, next: (err?: any) => void): any => {
                    console.log(); // Newline to mark new request
                    console.log(`[REST] Received ${req.method} request at ${req.originalUrl}`);
                    next();
                });
            }

            // body-parser must be before the Application Insights router.
            app.use(bodyParser.urlencoded({ extended: true }));
            // const jsonOptions: any = { limit: "10kb", strict: true };
            // if (process.env.LOG_INVALID_JSON_REQUESTS === "true") {
            //     jsonOptions.verify = (req: express.Request, res: express.Response, buf: Buffer, encoding: string) => {
            //         if (buf && buf.length) {
            //             (<any>req).rawBody = buf.toString();
            //         }
            //     };
            // }

            app.use(bodyParser.json());

            // If body-parser throws an error, catch it and set the request body to null.
            app.use(bodyParserErrorHandler);

            app.get("/", (req: express.Request, res: express.Response, next: (err?: Error) => void): any => {
                res.send("Welcome to the CodePush REST API!");
            });

            // app.set("etag", false);
            // app.set("views", __dirname + "/views");
            // app.set("view engine", "ejs");
            // app.use("/auth/images/", express.static(__dirname + "/views/images"));

            app.use(auth.router());

            app.use(auth.authenticate, fileUploadMiddleware, api.management({ storage: storage }));

            done(null, app, storage);
        })
        .done();
}

function bodyParserErrorHandler(err: any, req: express.Request, res: express.Response, next: Function): void {
    if (err) {
        if (err.message === "invalid json" || (err.name === "SyntaxError" && ~err.stack.indexOf("body-parser"))) {
            req.body = null;
            next();
        } else {
            next(err);
        }
    } else {
        next();
    }
}