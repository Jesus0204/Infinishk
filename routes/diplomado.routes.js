const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const diplomadoController = require('../controllers/diplomado.controller');

// router.get('/diplomado',diplomadoController.get_diplomado);

router.get('/editar_diplomado',diplomadoController.get_modificar_diplomado);

router.post('/editar_diplomado/:nombre',diplomadoController.post_fetch_diplomado);

router.post('/editar_diplomado',diplomadoController.post_modificar_diplomado);
