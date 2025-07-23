const express = require('express');
// const { createProject } = require('../controllers/projectController');
const projectController = require('../controllers/projectController')
const authJwt = require('../middleware/authJwt');
const validatePriorityObjectives = require('../middleware/validatePriorityObjectives');
const validateWorkerExists = require('../middleware/validateWorkerExists');

const router = express.Router();

// router.post('/', authJwt, createProject);

router.route("/", validatePriorityObjectives, validateWorkerExists)
.post(projectController.createProject);

module.exports = router;

// router.post('/', createProject); // Sin authJwt

