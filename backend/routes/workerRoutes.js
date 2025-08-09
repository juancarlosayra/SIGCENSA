const express = require('express');
const workerController = require('../controllers/workerController');

const router = express.Router();

console.log('workerController:', Object.keys(workerController));

// Rutas
router.get('/', workerController.getAllWorkers);
router.get('/search', workerController.searchWorkers);

console.log('✅ workerRoutes cargado correctamente');

module.exports = router;