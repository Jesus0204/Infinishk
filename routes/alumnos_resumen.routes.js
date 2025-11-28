const express = require('express');

const router = express.Router();

const alumnosResumenController = require('../controllers/alumnosResumen.controller');

const isAuth = require('../util/is-Auth');
const canConsultarAlumno = require('../util/privileges/can_consultar_alumno');

router.get('/', isAuth, canConsultarAlumno, alumnosResumenController.get_alumnos_resumen);

module.exports = router;