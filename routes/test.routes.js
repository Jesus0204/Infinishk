const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const testController = require('../controllers/test.controller');

router.get('/', testController.get_index);

// Con esta linea se permite que se exporte en el principal
module.exports = router;