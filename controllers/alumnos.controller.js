const Alumno = require('../models/alumno.model');
const Deuda = require('../models/deuda.model');

exports.get_modificar_fichas = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: false, 
        modificar_fichas: true,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};