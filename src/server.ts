import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { blobHistoryList } from './routes/blobHistoryList';
import { containerList } from './routes/containerList';
import { tableStorageRoutes } from './routes/tableStorage';

import * as bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));

// If body-parser throws an error, catch it and set the request body to null.
app.use(bodyParserErrorHandler);

// Code-Push-Server routes
app.use(containerList);
app.use(blobHistoryList);
app.use(tableStorageRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to the Microsoft Azure Blob Storage API');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});


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
