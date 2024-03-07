const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const alumnosController = require('../controllers/alumnos.controller');

router.get('/A3', alumnosController.get_A3);

// Con esta linea se permite que se exporte en el principal
module.exports = router;