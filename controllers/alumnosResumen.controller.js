const Alumno = require('../models/alumno.model');
const Deuda = require('../models/deuda.model');

const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_alumnos_resumen = async (request, response, next) => {
    const page = parseInt(request.query.page, 10) || 1;
    const pageSize = 250;

    const now = moment().tz('America/Mexico_City').startOf('day').format('YYYY-MM-DD');

    const [alumnosResumen] = await Alumno.fetchResumenAlumnos();
    const [alumnosAtrasados] = await Deuda.fetchNoPagados(now);

    for (const alumno of alumnosResumen) {
        alumno.alCorriente = true;
        alumno.pagosFormula = Number(alumno.pagosFormula || 0);
    }

    for (const alumno of alumnosAtrasados){
        const alumnoEncontrado = alumnosResumen.find(a => a.Matricula === alumno.matricula);
        if (alumnoEncontrado) {
            alumnoEncontrado.alCorriente = false;
        }
    }

    const totalAlumnos = alumnosResumen.length;
    const totalPages = Math.max(1, Math.ceil(totalAlumnos / pageSize));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const alumnosPaginados = alumnosResumen.slice(startIndex, endIndex);

    response.render('alumnos/alumnos_resumen', {
        alumnos: alumnosPaginados,
        csrfToken: request.csrfToken(),
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || '',
        page: currentPage,
        totalPages,
        startIndex,
        pageSize,
        totalAlumnos,
    });
};