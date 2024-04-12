const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const alumnosController = require('../controllers/alumnos.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_AlumnosAtrasados = require('../util/privileges/admin/consultas/can_Alumnos_atrasados');
const can_ConsultarAlumno = require('../util/privileges/can_consultar_alumno');
const can_ConsultarHorarioAlumno = require('../util/privileges/can_consultar_HorarioAlumno');
const can_ModificarDeuda = require('../util/privileges/admin/otros/can_modificar_Deuda');

router.get('/alumnos_atrasados', isAuth, can_AlumnosAtrasados, alumnosController.get_alumnos_atrasados);

module.exports = router;
