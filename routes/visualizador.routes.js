const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const visualizadorController = require('../controllers/visualizador.controller');


router.get('/ruta', visualizadorController.get_ruta);
router.get('/V1', visualizadorController.get_V1);
router.get('/V2', visualizadorController.get_V2);
router.get('/V3', visualizadorController.get_V3);

// Con esta linea se permite que se exporte en el principal
module.exports = router;