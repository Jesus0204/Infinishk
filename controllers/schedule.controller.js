const Deuda = require('../models/deuda.model');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.set_recargos = (request, response, next) => {
    let fecha_actual = moment().tz('America/Mexico_City').format();

    Deuda.fetchDeudasPeriodo(fecha_actual)
    .then(async( [deudasNoPagadas, fieldData]) => {

        for (let deuda of deudasNoPagadas){
            // De las deudas que no están pagadas y no tengan recargos se guarda el monto a Pagar
            let montoPagar = deuda.montoAPagar;

            // Calculas los recargos del 5%
            let montoRecargo = montoPagar + (montoPagar * 0.05);

            await Deuda.setRecargosDeuda(deuda.IDDeuda, montoRecargo);
        }
        console.log('La base ha sido actualizada con los recargos :)');
    })
    .catch((error) => {
        console.log(error);
    })
};