const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoExtra = require('../models/pago_extra.model');
const Alumno = require('../models/alumno.model');
const Periodo = require('../models/periodo.model');
const EstudianteProfesional = require('../models/estudianteprofesional.model');



exports.get_estado_cuenta = async (request, response, next) => {
    try {
        const estudianteProfesional = await EstudianteProfesional.fetchOne(request.session.username); 
        const matricula = request.session.username;
        const [estadoCuenta] = await Deuda.fetchEstadoDeCuenta(matricula);
        const [pagos] = await Pago.fetchOne(matricula);
        const [cargosExtra] = await PagoExtra.fetchSinPagar(matricula);
        const [pagosExtra] = await PagoExtra.fetchPagados(matricula);


        response.render('estadocuenta/estado_cuenta', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            csrfToken: request.csrfToken(),
            estudianteProfesional: estudianteProfesional[0][0],
            estadoCuenta: estadoCuenta,
            pagos: pagos,
            pagosExtra: cargosExtra,
            pagadosExtra: pagosExtra
        });
    } catch (error) {
        response.status(500).send("Error en la obtención del estado de cuenta: " + error);
    }
}

