const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const adminController = require('../controllers/administrador.controller');


router.get('/S1', adminController.S1);
router.get('/S2', adminController.S2);
router.get('/S3', adminController.S3);
router.get('/S4', adminController.S4);
router.get('/S5', adminController.S5);
router.get('/S6', adminController.S6);
router.get('/S7', adminController.S7);
router.get('/S8', adminController.S8);
router.get('/S9', adminController.S9);

// Con esta linea se permite que se exporte en el principal
module.exports = router;