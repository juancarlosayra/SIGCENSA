const express = require('express');
const { getWorkerById } = require('../controllers/workerController');

const router = express.Router();

router.get('/:id', getWorkerById);

module.exports = router;