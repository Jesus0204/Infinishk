const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.get_usuarios);

router.get('/alumnos_atrasados', usuariosController.get_alumnos_atrasados);

// Con esta linea se permite que se exporte en el principal
module.exports = router;