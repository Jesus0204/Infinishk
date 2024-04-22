const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const Alumno = require('../models/alumno.model');
const Periodo = require('../models/periodo.model');
const EstudianteProfesional = require('../models/estudianteprofesional.model');



exports.get_estado_cuenta = async (request, response, next) => {
    try {
        const estudianteProfesional = await EstudianteProfesional.fetchOne(request.session.username); 
        console.log('hola', estudianteProfesional)
        const matricula = request.session.username;

        response.render('estadocuenta/estado_cuenta', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            csrfToken: request.csrfToken(),
            estudianteProfesional: estudianteProfesional[0][0]
        });
    } catch (error) {
        response.status(500).send("Error en la obtención del estado de cuenta: " + error);
    }
}

