const Deuda = require('../models/deuda.model');
const Alumno = require('../models/alumno.model');
const Fichas = require('../models/fichas_pago.model');
const Grupo = require('../models/grupo.model');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_alumnos_atrasados = (request, response, next) => {
    const now = moment().tz('America/Mexico_City').startOf('day').format('YYYY-MM-DD');
    // Primero sacas las matriculas de alumnos que estan atrasados
    Deuda.fetchNoPagados(now)
        .then(async ([alumnos_atrasados, fieldData]) => {
            let deudas = [];
            // Para cada alumno atrasado sacas todos los datos
            for (let alumno of alumnos_atrasados) {
                const [deuda, fieldData] = await Deuda.fetchDeudaDatos(alumno.matricula);
                deudas.push(deuda);
            }

            const [alumnos_actuales, fieldData_2] = await Deuda.fetchAlumnos_DeudaActual();
            const [atrasados, fieldData_3] = await Deuda.fetchAlumnos_Atrasados(now);

            console.log(alumnos_actuales)
            // Pasas a plantilla deudas de alumnos que tienen pago atrasado
            response.render('alumnos/alumnos_atrasados', {
                pagos_atrasados: deudas, 
                actuales: alumnos_actuales, 
                atrasados: atrasados,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                error_alumno: false
            });
        });
};

exports.post_fetch_fichas = (request, response, next) => {
    let matches = request.body.buscar.match(/(\d+)/);
    const now = moment().tz('America/Mexico_City').startOf('day').subtract(1, 'days').format();
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Fichas.fetch(matches[0])
                .then(([fichas, fieldData]) => {
                    response.render('alumnos/modificar_fichas', {
                        alumno: alumno,
                        fichas: fichas, 
                        fechaActual: now,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
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
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                error_alumno: false
            });
            console.log(error)
        });
};

exports.get_fichas = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: false, 
        fichas_pago: true,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_fichas_modify = async (request, response, next) => { 
    const { descuentoNum, fechaFormat, notaNum, id } = request.body;
    const modificador = request.session.username;

    try {
        const data = await Fichas.update(descuentoNum, fechaFormat, notaNum, modificador, id);
        response.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};