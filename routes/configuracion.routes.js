const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const configuracionController = require('../controllers/configuracion.controller');

router.get('/',configuracionController.get_configuracion);

router.get('/administrar_planpago',configuracionController.get_administrar_planpago);
router.get('/registrar_precio_credito', configuracionController.get__registrar_precio_credito);
router.post('/registrar_precio_credito', configuracionController.post_registrar_precio_credito);

module.exports = router;