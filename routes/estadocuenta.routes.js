const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const estadocuentaController = require('../controllers/estadocuenta.controller');

const isAuth = require('../util/is-Auth');
const can_ConsultarPropuestaHorario = require('../util/privileges/alumno/can_consultar_propuestaHorario');
const can_ConsultarEstadoCuenta = require('../util/privileges/can_consultar_EstadoCuenta');

// Estado cuenta
router.get('/estado_cuenta', isAuth, can_ConsultarEstadoCuenta, estadocuentaController.get_estado_cuenta);


module.exports = router;