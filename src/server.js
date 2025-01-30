import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { blobHistoryList } from './routes/blobHistoryList.js';
import { containerList } from './routes/ContainerList.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));

app.use(containerList);
app.use(blobHistoryList);

app.get('/', (req, res) => {
    res.send('Welcome to the Microsoft Azure Blob Storage API');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});