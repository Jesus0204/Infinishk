const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const diplomadoController = require('../controllers/diplomado.controller');

router.get('/',diplomadoController.get_diplomado);

router.get('/registrar_diplomado',diplomadoController.get_registrar_diplomado);

router.post('/registrar_diplomado',diplomadoController.post_registrar_diplomado);

router.get('/editar_diplomado',diplomadoController.get_modificar_diplomado);

router.get('/check_diplomado', diplomadoController.get_check_diplomado);

router.get('/autocomplete', diplomadoController.get_autocomplete);

router.post('/editar_diplomado',diplomadoController.post_fetch_diplomado);

router.post('/resultado_diplomado',diplomadoController.post_modificar_diplomado);


module.exports = router;