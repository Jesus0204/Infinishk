const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const pagosController = require('../controllers/pagos.controller');

router.get('/registrar_pago_extra', pagosController.get__registrar_pago_extra);
router.post('/registrar_pago_extra', pagosController.post_registrar_pago_extra);
router.get('/pagos_extra', pagosController.get_pago_extra);
router.post('/pagos_extra/modify', pagosController.post_pago_extra_modify);
router.get('/registroTransferencia', pagosController.get_registro_transferencias);
router.post('/registroTransferencia', pagosController.post_subir_archivo);

router.get('/', pagosController.get_pago)

module.exports = router;