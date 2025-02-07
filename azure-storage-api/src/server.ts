import * as express from "express";
import * as defaultServer from "./default-server";

const https = require("https");
const fs = require("fs");

const dotenv = require("dotenv");

dotenv.config();

defaultServer.start((err?: any, app?: express.Express, storage?: any) => {
    if (err) {
        throw err;
    }

    const httpsEnabled: boolean = Boolean(process.env.HTTPS) || false;
    const defaultPort: number = httpsEnabled ? 8443 : 3000;

    const port: number = Number(process.env.PORT) || defaultPort;

    let server: any;

    if (httpsEnabled) {
        const options = {
            key: fs.readFileSync("./certs/cert.key", "utf8"),
            cert: fs.readFileSync("./certs/cert.crt", "utf8"),
        };

        server = https.createServer(options, app).listen(port, function () {
            console.log("API host listening at https://localhost:" + port);
        });
    } else {
        server = app.listen(port, function () {
            console.log("API host listening at http://localhost:" + port);
        });
    }

    server.setTimeout(0);
});


































// import express from 'express';
// import morgan from 'morgan';
// import dotenv from 'dotenv';

// import { blobHistoryList } from './routes/blobHistoryList';
// import { containerList } from './routes/containerList';
// import { tableStorageRoutes } from './routes/tableStorage';

// import * as bodyParser from "body-parser";

// dotenv.config();

// const app = express();

// app.use(morgan('dev'));

// app.use(bodyParser.urlencoded({ extended: true }));

// // If body-parser throws an error, catch it and set the request body to null.
// app.use(bodyParserErrorHandler);

// // Code-Push-Server routes
// // app.use(containerList);
// // app.use(blobHistoryList);
// app.use(tableStorageRoutes)

// app.get('/', (req, res) => {
//     res.send('Welcome to the Microsoft Azure Blob Storage API');
// })

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on http://localhost:${process.env.PORT}`);
// });



// function bodyParserErrorHandler(err: any, req: express.Request, res: express.Response, next: Function): void {
//     if (err) {
//         if (err.message === "invalid json" || (err.name === "SyntaxError" && ~err.stack.indexOf("body-parser"))) {
//             req.body = null;
//             next();
//         } else {
//             next(err);
//         }
//     } else {
//         next();
//     }
// }
