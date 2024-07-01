const Deuda = require('../models/deuda.model');
const Periodo = require('../models/periodo.model');
const PrecioCredito = require('../models/precio_credito.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const Grupo = require('../models/grupo.model');
const Colegiatura = require('../models/colegiatura.model');
const PlanPago = require('../models/planpago.model');

const {
    getUserGroups
} = require('../util/adminApiClient');

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
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
        console.log(error);
    })
};

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.enviarCorreoRecordatorio = async(request, response, next) => {
    // Sacas la fecha actual con moment
    let fecha_actual = moment().startOf('day').format();
    
    Deuda.fetchDeudasRecordatorio(fecha_actual)
    .then(async ([deudasRecordatorio, fieldData]) => {
        for (count = 0; count < deudasRecordatorio.length; count++){
            // Le quitas 5 días a la fecha para enviar el correo
            let fecha_correo = moment(deudasRecordatorio[count].fechaLimitePago).subtract(5, 'days').format();

            // Si la nueva fecha es igual a la fecha actual se tiene que enviar el correo
            if (fecha_correo == fecha_actual) {

                // Creas el mensaje para enviar el correo
                const msg = {
                    to: deudasRecordatorio[count].correoElectronico,
                    from: {
                        name: 'VIA PAGO',
                        email: 'recordatorios@pagos.ivd.edu.mx',
                    },
                    subject: '¡Recuerda Pagar tu Colegiatura!',
                    html: `<p>¡Hola!</p>
                    <p>
                        ¡Recuerda que ya avecina el pago de tu Colegiatura! 
                        Debes realizar tu pago antes del ${moment(deudasRecordatorio[count].fechaLimitePago).format('DD [de] MMMM')}
                        para no generar recargos en tu estado de cuenta. 
                    </p>
                    <p>
                        Para pagar o consultar tu estado de cuenta, puedes entrar a < a href = "https://pagos.ivd.edu.mx/auth/login" > ViaPago < /a>
                    </p>
                    <p>
                        ¡Gracias y bonito día!
                    </p>`
                };
            
                try {
                    await sgMail.send(msg);
                    console.log('Correo electrónico enviado correctamente');
                } catch (error) {
                    console.error('Error al enviar el correo electrónico:', error.toString());
                }
            }
        }
    })
    .catch((error) => {
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
        console.log(error);
    });


};

exports.enviarCorreoAtrasado = (request, response, next) => {
    // Sacas la fecha actual con moment
    let fecha_actual = moment().startOf('day').format();

    Deuda.fetchDeudasCorreoAtrasado(fecha_actual)
    .then(async([deudasNoPagadas, fieldData]) => {
        for (count = 0; count < deudasNoPagadas.length; count++) {
            // Le sumas días a la fecha para enviar el correo
            let fecha_correo = moment(deudasNoPagadas[count].fechaLimitePago).add(1, 'days').format();

            // Si la fecha (un dia despues) se envia el correo notificando de los recargos y del atraso
             if (fecha_correo == fecha_actual) {
                // Creas el mensaje para enviar el correo
                const msg = {
                    to: deudasNoPagadas[count].correoElectronico,
                    from: {
                        name: 'VIA PAGO',
                        email: 'recordatorios@pagos.ivd.edu.mx',
                    },
                    subject: '¡El pago de tu Colegiatura ha vencido!',
                    html: `<p>¡Hola!</p>
                    <p>
                        Ayer fue la fecha límite del pago de tu colegiatura. ¡Liquidala lo antes posible!
                        Recuerda que por cada mes retrasado se genera el 5% de recargos sobre ese mes. 
                    </p>
                    <p>
                        Para pagar o consultar tu estado de cuenta, 
                        puedes entrar a < a href = "https://pagos.ivd.edu.mx/auth/login" > ViaPago < /a>
                    </p>
                    <p>
                        ¡Gracias y bonito día!
                    </p>`
                };

                try {
                    await sgMail.send(msg);
                    console.log('Correo electrónico enviado correctamente');
                } catch (error) {
                    console.error('Error al enviar el correo electrónico:', error.toString());
                }
             }
        }
    })
    .catch((error) => {
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
        console.log(error);
    })
};

async function sendEmail(message){

    // Crear el texto del correo para los horarios no acetados
    let mensaje = `<p>¡Hola!</p>
                   <p>
                       Este es un correo automatizado para avisar que los horarios de los alumnos:
                       <br>
                       <br>
                       `;

    let mensaje_final = mensaje + message;

    // Crear el mensaje para enviar el correo
    const msg = {
        to: 'samirbaidonpardo@hotmail.com',
        from: {
            name: 'VIA PAGO',
            email: 'soporte@pagos.ivd.edu.mx ',
        },
        subject: `Horario de alumnos no se pudo confirmar automáticamente`,
        html: mensaje_final
    };

    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error.toString());
    }
}

exports.aceptar_horario_resagados = async (request, response, next) => {
    const [periodo, fieldData] = await Periodo.fetchActivo();
    const periodoActivo = periodo[0].IDPeriodo;
    const precioCredito = await PrecioCredito.fetchIDActual();
    const precioActual = precioCredito[0][0].IDPrecioCredito;
    const [plan6Pagos, fieldData_3] = await PlanPago.fetchOne(6);
    const plan6PagosID = plan6Pagos[0].IDPlanPago;

    const [alumnosNoConfirmados, fieldData_2] = await EstudianteProfesional.fetchAlumnosNoConfirmados();

    let alumnos_horario_vacio = [];
    let alumnos_fallo = [];

    for (let count = 0; count < alumnosNoConfirmados.length; count++){
        try {
            const schedule = await getUserGroups(periodoActivo, Number(alumnosNoConfirmados[count].Matricula));

            if (schedule.data.length == 0) {
                alumnos_horario_vacio.push(alumnosNoConfirmados[count].Nombre, alumnosNoConfirmados[count].Apellidos, alumnosNoConfirmados[count].Matricula);
            } else {
                const cursos = schedule.data.map(schedule => {
                    const {
                        room = '',
                        name: nameSalon = '',
                        schedules = [],
                        course = {},
                        professor = {},
                        school_cycle = {}
                    } = schedule;

                    const {
                        id = periodoActivo,
                        name = '',
                        credits = ''
                    } = course;

                    const {
                        name: nombreProfesor = '',
                        first_surname = '',
                        second_surname = ''
                    } = professor;

                    const {
                        start_date = '',
                        end_date = '',
                    } = school_cycle;

                    const startDate = new Date(start_date);
                    const endDate = new Date(end_date);

                    console.log('DIA INICIO')
                    console.log(startDate)

                    console.log('DIA FIN')
                    console.log(endDate)

                    const startDateFormat = moment(startDate).format('LL');
                    const endDateFormat = moment(endDate).format('LL');

                    console.log('DIA INICIO FORMATO')
                    console.log(startDateFormat)

                    console.log('DIA FIN FORMATO')
                    console.log(endDateFormat)


                    const nombreSalon = `${room} ${nameSalon}`;
                    const nombreProfesorCompleto = `${nombreProfesor} ${first_surname} ${second_surname}`;

                    const semestre = course.plans_courses?.[0]?.semester || "Desconocido";

                    const precioMateria = credits * precioActual;

                    const idGrupo = schedules[0]?.group_id || '';

                    const horarios = schedules.map(schedule => {
                        const {
                            weekday = '',
                            start_hour = '',
                            end_hour = '',
                        } = schedule;

                        // Crear objetos Date a partir de las horas de inicio y final
                        const startDate = new Date(start_hour);
                        const endDate = new Date(end_hour);

                        const fechaInicio = moment(startDate).format('HH:mm');
                        const fechaTermino = moment(endDate).format('HH:mm');

                        return {
                            diaSemana: weekday,
                            fechaInicio,
                            fechaTermino
                        };
                    });

                    return {
                        idMateria: id,
                        nombreMat: name,
                        creditos: credits,
                        nombreProfesorCompleto,
                        nombreSalon,
                        semestre,
                        precioMateria,
                        horarios,
                        startDateFormat,
                        endDateFormat,
                        idGrupo
                    }
                });
                
                for (let curso of cursos) {
                    // Agarrar el horario y formatearlo para la base
                    const grupoHorarioValidado = curso.horarios.map(item => item === '' ? null : item);
                    let claseFormato = '';
                    for (let countClase = 0; countClase < grupoHorarioValidado.length; countClase++) {
                        if ((countClase + 1) == grupoHorarioValidado.length) {
                            claseFormato += grupoHorarioValidado[countClase].diaSemana + ' ' + grupoHorarioValidado[countClase].fechaInicio + ' - ' + grupoHorarioValidado[countClase].fechaTermino;
                        } else {
                            claseFormato += grupoHorarioValidado[countClase].diaSemana + ' ' + grupoHorarioValidado[countClase].fechaInicio + ' - ' + grupoHorarioValidado[countClase].fechaTermino + ', ';
                        }
                    }
                    // Guardar el grupo en la base de datos
                    await Grupo.saveGrupo(
                        alumnosNoConfirmados[count].Matricula,
                        curso.idMateria,
                        precioActual,
                        curso.nombreProfesorCompleto,
                        curso.nombreSalon,
                        claseFormato,
                        curso.startDateFormat,
                        curso.endDateFormat,
                        curso.idGrupo
                    );
                }
    
                // Acciones adicionales después de manejar cada grupo
                await Colegiatura.createColegiaturasFichas(plan6PagosID, alumnosNoConfirmados[count].Matricula, precioActual);
                await EstudianteProfesional.updateHorarioAccepted(alumnosNoConfirmados[count].Matricula);
            }

        } catch(error) {
            console.log(error);
            alumnos_fallo.push(alumnosNoConfirmados[count].Nombre, alumnosNoConfirmados[count].Apellidos, alumnosNoConfirmados[count].Matricula);
        }
    }

    let mensaje_vacio = "";
    // Llenar el correo con todos los nombres
    for (let alumno_data = 0; alumno_data < alumnos_horario_vacio.length; alumno_data = alumno_data + 3) {
        mensaje_vacio += `<strong>Nombre: ${alumnos_horario_vacio[alumno_data]} ${alumnos_horario_vacio[alumno_data + 1]}</strong>
                        <br>
                        <strong>Matricula: ${alumnos_horario_vacio[alumno_data + 2]}</strong>
                        <br>
                        <br>
                        `;
    }

    mensaje_vacio += `no pudo ser confirmado. 
                       Este error fue ocasionado porque en el portal administrativo el alumno no tiene un horario asignado ni materias que registrar.
                   </p>
                   <p>
                       Sentimos los inconvenientes que esto puede ocasionar. 
                   <p>
                       ¡Gracias!
                   </p>`;
    
    if (alumnos_horario_vacio.length != 0) {
        sendEmail(mensaje_vacio);
    }

    let mensaje_fallo = "";
    // Llenar el correo con todos los nombres
    for (let alumno_data = 0; alumno_data < alumnos_fallo.length; alumno_data = alumno_data + 3) {
        mensaje_fallo += `<strong>Nombre: ${alumnos_fallo[alumno_data]} ${alumnos_fallo[alumno_data + 1]}</strong>
                        <br>
                        <strong>Matricula: ${alumnos_fallo[alumno_data + 2]}</strong>
                        <br>
                        <br>
                        `;
    }
    mensaje_fallo += `no pudo ser confirmado. 
                        Este error puede suceder por tres razones: 
                        <br>
                        <ol>
                            <li> Hubo un error en la conexión con el portal administrativo </li>
                            <li> Faltan materias de registrar en Via Pago (Por favor entra a Sincronizar base de datos). </li>
                            <li> El alumno no esta registrado en el sistema administrativo. </li>
                        </ol>
                    </p>
                    <p>
                        Sentimos los inconvenientes que esto puede ocasionar. 
                    <p>
                        ¡Gracias!
                    </p>`;

    if (alumnos_fallo.length != 0) {
        sendEmail(mensaje_fallo);
    }
}