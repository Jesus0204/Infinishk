const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const alumnosController = require('../controllers/alumnos.controller');


router.get('/inicioalumno', alumnosController.get_inicioalumno);//AGREGAR A LA RUTA '/' de alumno '/alumno'
router.get('/horario', alumnosController.get_horario);
router.get('/realizar_pago', alumnosController.get_realizar_pago);
router.get('/estado_de_cuenta', alumnosController.get_estado_de_cuenta);
router.get('/V1', alumnosController.get_V1);
router.get('/test', alumnosController.get_test);

// Con esta linea se permite que se exporte en el principal
module.exports = router;