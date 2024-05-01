const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const sessionController = require('../controllers/session.controller');

router.get('/login', sessionController.get_login);
router.post('/login', sessionController.post_login);
router.get('/logout', sessionController.get_logout);
router.get('/set_password',sessionController.get_set_password);
router.post('/set_password',sessionController.post_set_password);
router.get('/reset_password',sessionController.get_reset_password);
router.post('/reset_password',sessionController.post_reset_password);

module.exports = router;