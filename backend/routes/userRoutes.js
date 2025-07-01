const express = require('express');

const {createUser} = require('../controllers/userController');

const router = express.Router();

router.post('/user', createUser);

module.exports = router;