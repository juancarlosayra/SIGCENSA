const express = require('express');
const knowledgeFieldController = require('../controllers/knowledgeFieldsController');

const router = express.Router();

router.route('/').get(knowledgeFieldController.getAllKnowledgeFields)