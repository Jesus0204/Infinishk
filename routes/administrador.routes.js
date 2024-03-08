const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const adminController = require('../controllers/administrador.controller');


router.get('/S1', adminController.get_S1);
router.get('/S2', adminController.get_S2);
router.get('/S2_1', adminController.get_S2_1);
router.get('/S2_2', adminController.get_S2_2);
router.get('/S3', adminController.get_S3);
router.get('/S3_1', adminController.get_S3_1);
router.get('/S3_2', adminController.get_S3_2);
router.get('/S4', adminController.get_S4);
router.get('/S5', adminController.get_S5);
router.get('/S6', adminController.get_S6);
router.get('/S7', adminController.get_S7);
router.get('/S8', adminController.get_S8);
router.get('/S9', adminController.get_S9);

// Con esta linea se permite que se exporte en el principal
module.exports = router;