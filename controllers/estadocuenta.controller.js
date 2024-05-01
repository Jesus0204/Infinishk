const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoExtra = require('../models/pago_extra.model');
const Alumno = require('../models/alumno.model');
const Periodo = require('../models/periodo.model');
const EstudianteProfesional = require('../models/estudianteprofesional.model');
const PagaDiplomado = require('../models/pagadiplomado.model');



exports.get_estado_cuenta = async (request, response, next) => {
    try {

        
        const matricula = request.session.username;
        const [pagos] = await Pago.fetchOne(matricula);
        const [cargosExtra] = await PagoExtra.fetchSinPagar(matricula);
        const [pagosExtra] = await PagoExtra.fetchPagados(matricula);

        if(matricula[0] == '1') {
        
            // Consultas para estudiante
            
            const estudianteProfesional = await EstudianteProfesional.fetchOne(request.session.username); 
            const [deuda] = await Deuda.fetchDeuda(matricula);
            const [estadoCuenta] = await Deuda.fetchEstadoDeCuenta(matricula);

            response.render('estadocuenta/estado_cuenta', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                csrfToken: request.csrfToken(),
                estudianteProfesional: estudianteProfesional[0][0],
                estadoCuenta: estadoCuenta,
                pagos: pagos,
                deuda: deuda,
                pagosExtra: cargosExtra,
                pagadosExtra: pagosExtra,
                matricula: matricula,
                rol: request.session.rol || "",
                
            });
        } else if (matricula[0] == '8') {

        //Consultas para diplomado

        const pagosDiplomado = await PagaDiplomado.fetchPagosDiplomado(matricula);

        response.render('estadocuenta/estado_cuenta', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            csrfToken: request.csrfToken(),
            pagos: pagos,
            pagosExtra: cargosExtra,
            pagadosExtra: pagosExtra,
            matricula: matricula,
            rol: request.session.rol || "",
            pagosDiplomado: pagosDiplomado[0],
            
        });

        }

        
    } catch (error) {
        response.status(500).send("Error en la obtención del estado de cuenta: " + error);
    }
}

