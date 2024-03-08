const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const adminController = require('../controllers/administrador.controller');


router.get('/ruta', adminController.get_ruta);

// Con esta linea se permite que se exporte en el principal
module.exports = router;