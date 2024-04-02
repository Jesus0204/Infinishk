const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const pagosController = require('../controllers/pagos.controller');

router.get('/', pagosController.get_pago)
router.get('/registrar_solicitud/autocomplete/:valor_busqueda', pagosController.get_autocomplete);
router.get('/registrar_solicitud/autocomplete/', pagosController.get_autocomplete);
router.get('/registrar_solicitud', pagosController.get_registrar_solicitud);
router.post('/fetch_registrar_solicitud', pagosController.post_fetch_registrar_solicitud);
router.post('/registrar_solicitud', pagosController.post_registrar_solicitud);
router.get('/registroTransferencia', pagosController.get_registro_transferencias);
router.post('/registroTransferencia', pagosController.post_subir_archivo);

module.exports = router;