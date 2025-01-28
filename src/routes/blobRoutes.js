const express = require('express');
const { fetchCodePushJSON } = require('../controllers/blobController');

const router = express.Router();

// Define a route to fetch blob data
router.get('/blob/:containerName', fetchCodePushJSON);

module.exports = router;``