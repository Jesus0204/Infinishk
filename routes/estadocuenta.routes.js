const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const estadoCuentaController = require('../controllers/estadocuenta.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_ConsultarEstadoCuenta = require('../util/privileges/can_consultar_EstadoCuenta');
const can_ModificarDeuda = require('../util/privileges/admin/otros/can_modificar_Deuda');

module.exports = router;