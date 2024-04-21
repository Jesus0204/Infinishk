const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const horarioController = require('../controllers/estadocuenta.controller');

const isAuth = require('../util/is-Auth');
const can_ConsultarEstadoCuenta = require('../util/privileges/can_consultar_EstadoCuenta');

module.exports = router;