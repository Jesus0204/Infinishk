const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const pagosController = require('../controllers/pagos.controller');

router.get('/',pagosController.get_pago)
router.get('/registroTransferencia', pagosController.get_registro_transferencias);
router.post('/registroTransferencia', pagosController.post_subir_archivo);

module.exports = router;