const express = require('express');
const { createProject } = require('../controllers/projectController');
// const authJwt = require('../middleware/authJwt');

const router = express.Router();

// router.post('/', authJwt, createProject);

module.exports = router;

// Quitar authJwt por ahora
router.post('/', createProject); // Sin authJwt

