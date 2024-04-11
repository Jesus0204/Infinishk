const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const diplomadoController = require('../controllers/diplomado.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_ConsultarDiplomado = require('../util/privileges/can_consultar_diplomado');
const can_RegistrarDiplomado = require('../util/privileges/admin/registros/can_registrar_Diplomado');
const can_ModificarDiplomado = require('../util/privileges/admin/otros/can_modificar_Diplomado');

router.get('/registrar_diplomado',can_RegistrarDiplomado,diplomadoController.get_registrar_diplomado);
router.post('/registrar_diplomado',can_RegistrarDiplomado,diplomadoController.post_registrar_diplomado);
router.get('/editar_diplomado',diplomadoController.get_modificar_diplomado);
router.get('/check_diplomado', diplomadoController.get_check_diplomado);
router.get('/autocomplete', diplomadoController.get_autocomplete);
router.post('/editar_diplomado',diplomadoController.post_fetch_diplomado);
router.post('/resultado_diplomado',diplomadoController.post_modificar_diplomado);
router.get('/', diplomadoController.get_diplomado);

module.exports = router;