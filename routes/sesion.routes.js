const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const sesionController = require('../controllers/sesion.controller');

router.get('/', sesionController.get_sesion);

// Con esta linea se permite que se exporte en el principal
module.exports = router;