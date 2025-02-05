const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const estadocuentaController = require('../controllers/estadocuenta.controller');

const isAuth = require('../util/is-Auth');
const can_ConsultarEstadoCuenta = require('../util/privileges/can_consultar_EstadoCuenta');
const can_RealizarPago = require('../util/privileges/alumno/can_realizar_pago');

router.get('/pagar', isAuth, can_RealizarPago, estadocuentaController.get_pago_alumno);
router.post('/mandar_pago', isAuth, can_RealizarPago, estadocuentaController.post_mandar_pago);

router.get('/confirmacion_pago', estadocuentaController.get_confirmacion_pago);

router.post('/notificacion_pago', estadocuentaController.post_notificacion_pago);

// Estado cuenta
router.get('/estado_cuenta', isAuth, can_ConsultarEstadoCuenta, estadocuentaController.get_estado_cuenta);

module.exports = router;