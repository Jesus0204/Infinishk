const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const configuracionHorario = require('../controllers/horario.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');

const can_consultar_Horarioalumno = require('../util/privileges/can_consultar_Horarioalumno');

router.get('/consultahorario',isAuth,can_consultar_Horarioalumno,configuracionHorario.get_propuesta_horario);
router.post('/confirmar_horario',isAuth,can_consultar_Horarioalumno,configuracionHorario.post_confirmar_horario);

module.exports = router;