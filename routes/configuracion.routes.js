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
const can_registrar_PlanPago = require('../util/privileges/admin/registros/can_registrar_PlanPago');
const can_exportar_Datos = require('../util/privileges/admin/otros/can_exportar_Datos');

router.get('/administrar_planpago',isAuth,can_ConsultarPlanPago,configuracionController.get_administrar_planpago);
router.get('/precio_credito', isAuth, can_ConsultarCostoCredito, configuracionController.get_precio_credito);
router.post('/precio_credito', isAuth, can_ConsultarCostoCredito, configuracionController.post_precio_credito);
router.get('/registrar_precio_credito', isAuth, can_RegistrarCostoCredito, configuracionController.get_registrar_precio_credito);
router.post('/registrar_precio_credito', isAuth, can_RegistrarCostoCredito, configuracionController.post_registrar_precio_credito);

// Consultar Usuario
router.get('/consultar_usuario',isAuth,can_ConsultarUsuario,configuracionController.get_consultar_usuario);
router.get('/search_activos', isAuth, can_ConsultarUsuario, configuracionController.get_search_activo);
router.get('/search_no_activos', isAuth, can_ConsultarUsuario, configuracionController.get_search_noactivo);

// Registrar Usuario de ambas formas (nuevo y con base de datos)
router.get('/registrar_usuario', isAuth, can_RegistrarUsuario, configuracionController.get_registrar_usuario);
router.post('/registrar_usuario', isAuth, can_RegistrarUsuario, configuracionController.post_registrar_usuario);
router.get('/obtener_usuario',isAuth, can_RegistrarUsuario, configuracionController.get_obtener_usuario);
router.post('/obtener_usuario', isAuth, can_RegistrarUsuario, configuracionController.post_obtener_usuario);
router.post('/getAdmins', isAuth, can_RegistrarUsuario, configuracionController.post_getAdmins);
router.post('/activar_usuario',isAuth, can_RegistrarUsuario, configuracionController.post_activar_usuario);
router.post('/modificar_usuario',isAuth,can_ConsultarUsuario,configuracionController.post_modificar_usuario);

router.post('/modificar_planpago',isAuth,can_ModificarPlanPago,configuracionController.post_modificar_planpago);
router.post('/registrar_planpago',isAuth,can_ModificarPlanPago,configuracionController.post_registrar_planpago);
router.get('/registrar_planpago',isAuth,can_registrar_PlanPago,configuracionController.get_registrar_planpago);

router.get('/check_planpago/:num', configuracionController.get_check_plan);

router.get('/exportarDatos',isAuth,can_exportar_Datos,configuracionController.get_exportar_datos);
router.post('/exportarDatos',isAuth,can_exportar_Datos,configuracionController.post_exportar_datos);

router.get('/actualizarBase',isAuth,can_ActualizarBase,configuracionController.get_actualizar_base);

router.get('/actualizarAlumnos',isAuth,can_ActualizarBase,configuracionController.get_alumnos);
router.post('/actualizarAlumnos',isAuth,can_ActualizarBase,configuracionController.post_alumnos);

router.get('/actualizarMaterias',isAuth,can_ActualizarBase,configuracionController.get_materias);

router.get('/actualizarPeriodos',isAuth,can_ActualizarBase,configuracionController.get_periodos);


router.get('/aceptar_horarios_resagados', isAuth, can_ActualizarBase, configuracionController.aceptar_horario_resagados);

router.get('/visualizarPeriodos', isAuth, can_ActualizarBase, configuracionController.fetchPeriodos);

router.get('/visualizarPlanes', isAuth, can_ActualizarBase, configuracionController.fetchPlanes);

router.post('/visualizarMaterias', isAuth, can_ActualizarBase, configuracionController.fetchMaterias);

router.get('/reiniciarDatos', isAuth, can_ActualizarBase, configuracionController.reiniciarDatos);

module.exports = router;
