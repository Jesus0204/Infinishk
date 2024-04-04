const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const sessionController = require('../controllers/sesion.controller');

router.get('/login', sessionController.get_login);