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

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.enviarCorreoRecordatorio = async(request, response, next) => {
    // Sacas la fecha actual con moment
    let fecha_actual = moment().tz('America/Mexico_City').startOf('day').format();
    
    Deuda.fetchDeudasRecordatorio(fecha_actual)
    .then(async ([deudasRecordatorio, fieldData]) => {
        for (count = 0; count < deudasRecordatorio.length; count++){
            // Le quitas 5 días a la fecha para enviar el correo
            let fecha_correo = moment(deudasRecordatorio[count].fechaLimitePago).subtract(5, 'days').format();

            // Si la nueva fecha es igual a la fecha actual se tiene que enviar el correo
            if (fecha_correo == fecha_actual) {

                // Creas el mensaje para enviar el correo
                const msg = {
                    to: 'jaczmx@gmail.com',
                    from: {
                        name: 'VIA PAGO',
                        email: '27miguelb11@gmail.com',
                    },
                    subject: '¡Recuerda Pagar tu Colegiatura!',
                    html: `<p>Hola!</p>
                    <p>
                        ¡Recuerda que ya avecina el pago de tu Colegiatura! 
                        Debes realizar tu pago antes del ${moment(deudasRecordatorio[count].fechaLimitePago).format('DD [de] MMMM')}
                        para no generar recargos en tu estado de cuenta. 
                    </p>
                    <p>
                        Para pagar o consultar tu estado de cuenta, puedes entrar a <a href = "https://ivd-pagos-infinishk-f243bfbb50c7.herokuapp.com/auth/login" > ViaPago </a>
                    </p>
                    <p>
                        ¡Gracias y bonito día!
                    </p>`
                };
            
                try {
                    // await sgMail.send(msg);
                    // console.log('Correo electrónico enviado correctamente');
                } catch (error) {
                    console.error('Error al enviar el correo electrónico:', error.toString());
                }
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });


};