const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const alumnosController = require('../controllers/alumnos.controller');

router.get('/A1', alumnosController.get_A1);
router.get('/A2', alumnosController.get_A2);
router.get('/A3', alumnosController.get_A3);
router.get('/A4', alumnosController.get_A4);
router.get('/test', alumnosController.get_test);

// Con esta linea se permite que se exporte en el principal
module.exports = router;