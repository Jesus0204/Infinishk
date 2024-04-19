const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const Alumno = require('../models/alumno.model');
const Periodo = require('../models/periodo.model');


exports.get_estado_cuenta = (request,response,next) => {
    response.render('estadocuenta/estado_cuenta', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
}