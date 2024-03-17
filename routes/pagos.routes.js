const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const pagosController = require('../controllers/pagos.controller');