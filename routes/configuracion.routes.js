const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const configuracionController = require('../controllers/configuracion.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_ActualizarBase = require('../util/privileges/admin/otros/can_actualizar_Base');
const can_ConsultarCostoCredito = require('../util/privileges/can_consultar_precioCredito');
const can_ConsultarPlanPago = require('../util/privileges/can_consultar_planPago');
const can_RegistrarCostoCredito = require('../util/privileges/admin/registros/can_registrar_PrecioCredito');
const can_RegistrarPlanPago = require('../util/privileges/admin/registros/can_registrar_PlanPago');
const can_ModificarPlanPago = require('../util/privileges/admin/otros/can_modificar_PlanPago');
const can_RegistrarRol = require('../util/privileges/admin/registros/can_registrar_Rol');
const can_ConsultarUsuario = require('../util/privileges/admin/consultas/can_consultar_Usuario');
const can_RegistrarUsuario = require('../util/privileges/admin/registros/can_registrar_usuario');

router.get('/administrar_planpago',configuracionController.get_administrar_planpago);
router.get('/precio_credito', isAuth, can_ConsultarCostoCredito, configuracionController.get_precio_credito);
router.post('/precio_credito', isAuth, can_ConsultarCostoCredito, configuracionController.post_precio_credito);
router.get('/registrar_precio_credito', isAuth, can_RegistrarCostoCredito, configuracionController.get_registrar_precio_credito);
router.post('/registrar_precio_credito', isAuth, can_RegistrarCostoCredito, configuracionController.post_registrar_precio_credito);

router.get('/consultar_usuario',isAuth,can_ConsultarUsuario,configuracionController.get_consultar_usuario);
router.get('/search_activos', isAuth, can_ConsultarUsuario, configuracionController.get_search_activo);
router.get('/search_no_activos', isAuth, can_ConsultarUsuario, configuracionController.get_search_noactivo);
router.post('/modificar_usuario',isAuth,can_ConsultarUsuario,configuracionController.post_modificar_usuario);


router.get('/actualizarBase',isAuth,can_ActualizarBase,configuracionController.get_actualizar_base);
router.get('/actualizarAlumnos',isAuth,can_ActualizarBase,configuracionController.get_alumnos);
router.get('/actualizarMaterias',isAuth,can_ActualizarBase,configuracionController.get_materias);

router.get('/', isAuth, can_ActualizarBase, configuracionController.get_configuracion);

module.exports = router;