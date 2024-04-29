const express = require('express');
// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const pagosController = require('../controllers/pagos.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_AdministrarSolicitud = require('../util/privileges/can_administrar_Solicitud');
const can_RegistrarSolicitud = require('../util/privileges/can_registrar_Solicitud');
const can_ConsultarEstadoCuenta = require('../util/privileges/can_consultar_EstadoCuenta');
const can_RegistrarPagoManual = require('../util/privileges/admin/registros/can_registrar_PagoManual');
const can_RegistrarPagoTransferencia = require('../util/privileges/admin/registros/can_registrar_ArchivoTransferencia');
const can_ReportesIngresos = require('../util/privileges/admin/consultas/can_ReporteIngresos');
const can_ReportesMetodoPago = require('../util/privileges/admin/consultas/can_ReporteMetodoPago');
const can_RegistrarPagoExtra = require('../util/privileges/admin/registros/can_registrar_PagoExtra');
const can_AdministrarPagoExtra = require('../util/privileges/admin/otros/can_administrar_PagoExtra');

// Pagos Extra
router.get('/registrar_pago_extra', isAuth, can_RegistrarPagoExtra, pagosController.get_registrar_pago_extra);
router.post('/registrar_pago_extra', isAuth, can_RegistrarPagoExtra, pagosController.post_registrar_pago_extra);
router.get('/pagos_extra', isAuth, can_AdministrarPagoExtra, pagosController.get_pago_extra);
router.post('/pagos_extra/modify', isAuth, can_AdministrarPagoExtra, pagosController.post_pago_extra_modify);
router.post('/pagos_extra/modify_status', can_AdministrarPagoExtra, isAuth, pagosController.post_modify_status);
router.post('/pagos_extra/delete', isAuth, can_AdministrarPagoExtra, pagosController.post_pago_extra_delete);

// Solicitudes
router.get('/solicitudes', isAuth, can_AdministrarSolicitud, pagosController.get_solicitudes);
router.post('/solicitudes/modify', isAuth, can_AdministrarSolicitud, pagosController.post_solicitudes_modify);
router.post('/solicitudes/delete', isAuth, can_AdministrarSolicitud, pagosController.post_solicitudes_delete);
router.get('/fetch_alumno/autocomplete/:valor_busqueda', isAuth, pagosController.get_autocomplete);
router.get('/fetch_alumno/autocomplete/', isAuth, pagosController.get_autocomplete);
router.get('/registrar_solicitud', isAuth, can_RegistrarSolicitud, pagosController.get_registrar_solicitud);
router.post('/fetch_registrar_solicitud', isAuth, can_RegistrarSolicitud, pagosController.post_fetch_registrar_solicitud);
router.post('/registrar_solicitud', isAuth, can_RegistrarSolicitud, pagosController.post_registrar_solicitud);

// Pago Manual
router.get('/registrar_pago_manual', isAuth, can_RegistrarPagoManual, pagosController.get_registrar_pago_manual);
router.get('/fetch_alumno/autocomplete/:valor_busqueda', isAuth, pagosController.get_autocomplete);
router.get('/fetch_alumno/autocomplete/', isAuth, pagosController.get_autocomplete);
router.post('/fetch_registrar_pago_manual', isAuth, can_RegistrarPagoManual, pagosController.post_fetch_registrar_pago_manual);
router.post('/registrar_pago_manual/pago_extra', isAuth, can_RegistrarPagoManual, pagosController.post_registrar_pago_manual_pago_extra);
router.post('/registrar_pago_manual/diplomado', isAuth, can_RegistrarPagoManual, pagosController.post_registrar_pago_manual_diplomado);
router.post('/registrar_pago_manual/colegiatura', isAuth, can_RegistrarPagoManual, pagosController.post_registrar_pago_manual_colegiatura);
router.get('/', isAuth, pagosController.get_pago);

// Reportes
router.get('/reporte_ingresos', isAuth, can_ReportesIngresos, pagosController.get_ingresos);
router.post('/reporte_ingresos', isAuth, can_ReportesIngresos, pagosController.post_ingresos);
router.get('/reporte_metodo_pago', isAuth, can_ReportesMetodoPago, pagosController.get_metodo_pago);
router.post('/reporte_metodo_pago', isAuth, can_ReportesMetodoPago, pagosController.post_metodo_pago);


// Archivo Transferencia
router.get('/registroTransferencia', isAuth, can_RegistrarPagoTransferencia, pagosController.get_registro_transferencias);
router.post('/registroTransferencia', isAuth, can_RegistrarPagoTransferencia, pagosController.post_subir_archivo);
router.post('/resultadoTransferencia', isAuth, can_RegistrarPagoTransferencia, pagosController.post_registrar_transferencia);

module.exports = router;