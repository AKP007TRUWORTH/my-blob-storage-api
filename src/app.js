const express = require('express');
const blobRoutes = require('./routes/blobRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Set up routes
app.use('/api', blobRoutes);

module.exports = app;