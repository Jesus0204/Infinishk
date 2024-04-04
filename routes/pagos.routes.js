const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const pagosController = require('../controllers/pagos.controller');

router.get('/solicitudes', pagosController.get_solicitudes);
router.post('/solicitudes/modify', pagosController.post_solicitudes_modify);
router.post('/solicitudes/delete', pagosController.post_solicitudes_delete);

router.get('/registroTransferencia', pagosController.get_registro_transferencias);
router.post('/registroTransferencia', pagosController.post_subir_archivo);
router.get('/', pagosController.get_pago);

module.exports = router;