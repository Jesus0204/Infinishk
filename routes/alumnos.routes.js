const express = require('express');

// Ahora en vez de usar app, se usa el router de express
const router = express.Router();

const alumnosController = require('../controllers/alumnos.controller');

// Incluyes el archivo para verificar si esta autenticado y los permisos
const isAuth = require('../util/is-Auth');
const can_AlumnosAtrasados = require('../util/privileges/admin/consultas/can_Alumnos_atrasados');
const can_ConsultarAlumno = require('../util/privileges/can_consultar_alumno');
const can_ModificarDeuda = require('../util/privileges/admin/otros/can_modificar_Deuda');

// Alumnos atrasados
router.get('/alumnos_atrasados', isAuth, can_AlumnosAtrasados, alumnosController.get_alumnos_atrasados);

//Consultar Alumno
router.get('/fetch_datos', isAuth, can_ConsultarAlumno, alumnosController.get_datos);
router.post('/datos_alumno', isAuth, can_ConsultarAlumno, alumnosController.post_fetch_datos);
router.post('/datos_alumno/modify', isAuth, can_ConsultarAlumno, alumnosController.post_datos_modify);
router.post('/datos_alumno/dar_baja_grupo', isAuth, can_ConsultarAlumno, alumnosController.post_dar_baja_grupo);
router.post('/datos_alumno/dar_baja_grupo60', isAuth, can_ConsultarAlumno, alumnosController.post_dar_baja_grupo60);
router.post('/datos_alumno/dar_baja_grupo100', isAuth, can_ConsultarAlumno, alumnosController.post_dar_baja_grupo100);
router.post('/datos_alumno/actualizarHorarios', isAuth, can_ConsultarAlumno, alumnosController.post_actualizar_horarios);

// Modificar Fichas
router.get('/fetch_fichas', isAuth, can_ModificarDeuda, alumnosController.get_fichas);
router.post('/fichas', isAuth, can_ModificarDeuda, alumnosController.post_fetch_fichas);
router.post('/fichas/modify', isAuth, can_ModificarDeuda, alumnosController.post_fichas_modify);

// Eliminar Pagos
router.post('/datos_alumno/eliminar_pago_extra', isAuth, alumnosController.post_eliminar_pago_extra);
router.post('/datos_alumno/eliminar_pago_col', isAuth, alumnosController.post_eliminar_pago_col);
/*router.post('/datos_alumno/eliminar_pago_dip', isAuth, alumnosController.post_eliminar_pago_dip);*/

module.exports = router;