const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const horarioController = require('../controllers/horario.controller');

const isAuth = require('../util/is-Auth');
const can_ConsultarPropuestaHorario = require('../util/privileges/alumno/can_consultar_propuestaHorario');

module.exports = router;