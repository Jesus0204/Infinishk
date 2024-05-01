const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const PlanPago = require('../models/planpago.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const Periodo = require('../models/periodo.model');
const PrecioCredito = require('../models/precio_credito.model');
const Materia = require('../models/materia.model');
const Fichas = require('../models/fichas_pago.model');
const EstudianteProfesional = require('../models/estudianteprofesional.model');
const EstudianteDiplomado = require('../models/estudiantediplomado.model')
const { getAllUsers, getAllCourses, getAllPeriods, getUserGroups } = require('../util/adminApiClient');
const { request, response } = require('express');

// Consultar Alumno
exports.get_datos = async (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: false, 
        fichas_pago: false,
        datos_alumno: true,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_dar_baja_grupo = async (request, response, next) => {
    const { IDGrupo, matricula} = request.body;
    console.log(IDGrupo)
    console.log(matricula)
    
    try {
        const resultfetchCreditoActivo = await PrecioCredito.fetchCreditoActivo(); // Espera a que la promesa se resuelva
        const resultfetchIDPorGrupo = await Materia.fetchIDPorGrupo(IDGrupo);
        const resultfetchBeca = await Alumno.fetchBeca(matricula);
        const creditoactual = resultfetchCreditoActivo[0][0].precioPesos; // Acceder al valor numérico
        const IDMateria = resultfetchIDPorGrupo[0][0].IDMateria;
        const Beca = resultfetchBeca[0][0].beca
        await Fichas.delete_grupo_update_fichas(matricula, IDGrupo, creditoactual, IDMateria, Beca);
        console.log('exito :)')

        // Función Modificar fichas de pago
        // Función Eliminar Grupo
        response.status(200).json({success: true});
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }

    // response.redirect('/alumnos/datos_alumno');
}

exports.post_datos_modify_prof = async (request, response, next) => { 
    const { ref, beca, alumno } = request.body;

    try {
        const data = await EstudianteProfesional.update(alumno, ref, beca);
        response.status(200).json({ success: true, data: data });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};

exports.post_datos_modify_dip = async (request, response, next) => { 
    const { ref, alumno } = request.body;

    try {
        const data = await EstudianteDiplomado.update(alumno, ref);
        response.status(200).json({ success: true, data: data });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};

exports.post_fetch_datos = async (request, response, next) => {
    let matches = request.body.buscar.match(/(\d+)/);
    const matricula = matches[0];
    try {
        let alumnoConsulta;

        if(matricula.startsWith('100')) {
            alumnoConsulta = await EstudianteProfesional.fetchDatos(matricula);
        } else {
            alumnoConsulta = await EstudianteDiplomado.fetchDatos(matricula);
        }
        const conf = await Alumno.fetchHorarioConfirmado(matricula)
        const planes = await PlanPago.fetchAllActivePlans()
        const confirmacion = conf[0][0].horarioConfirmado
        const planesPago = planes[0]
        if (confirmacion === 0) {
            const periodo = await Periodo.fetchActivo();
            if(periodo[0].length === 0){
                response.render('alumnos/consultar_alumno', {
                    alumnoConsulta: alumnoConsulta[0],
                    username: request.session.username || '',
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                    csrfToken: request.csrfToken()
                });
            } else {
                const periodoActivo = periodo[0][0].IDPeriodo;
                const precioCredito = await PrecioCredito.fetchPrecioActual();
                const precioActual = precioCredito[0][0].precioPesos;
                try {
                    const schedule = await getUserGroups(periodoActivo, matricula);
        
                    if (!schedule || !schedule.data) {
                        throw new Error('No existen user groups para ese usuario');
                    }
        
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
        
                        const startDateFormat = `${startDate.getFullYear()}-${startDate.getMonth() + 1 < 10 ? '0' : ''}${startDate.getMonth() + 1}-${startDate.getDate() < 10 ? '0' : ''}${startDate.getDate()}`;
                        const endDateFormat = `${endDate.getFullYear()}-${endDate.getMonth() + 1 < 10 ? '0' : ''}${endDate.getMonth() + 1}-${endDate.getDate() < 10 ? '0' : ''}${endDate.getDate()}`;
        
                        const nombreSalon = `${room} ${nameSalon}`;
                        const nombreProfesorCompleto = `${nombreProfesor} ${first_surname} ${second_surname}`;
        
                        const semestre = course.plans_courses?.[0]?.semester || "Desconocido";
        
                        const precioMateria = credits * precioActual;
        
                        const horarios = schedules.map(schedule => {
                            const {
                                weekday = '',
                                start_hour = '',
                                end_hour = '',
                            } = schedule;
        
                            // Crear objetos Date a partir de las horas de inicio y final
                            const startDate = new Date(start_hour);
                            const endDate = new Date(end_hour);
        
                            const fechaInicio = `${startDate.getHours()}:${startDate.getMinutes() < 10 ? '0' : ''}${startDate.getMinutes()}`;
                            const fechaTermino = `${endDate.getHours()}:${endDate.getMinutes() < 10 ? '0' : ''}${endDate.getMinutes()}`;
        
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
                        }
                    });
        
                    const precioTotal = cursos.reduce((total, curso) => total + curso.precioMateria, 0);
        
                    response.render('alumnos/consultar_alumno', {
                        schedule: cursos,
                        confirmacion: confirmacion,
                        planesPago: planesPago,
                        precioTotal: precioTotal,
                        alumnoConsulta: alumnoConsulta[0],
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    });
                    
                }
                catch (error) {
                    console.error('Error realizando operaciones:', error);
                }
            }
        }
        else if (confirmacion === 1) {
            const schedule = await Grupo.fetchSchedule(matricula)
            const precio = await Grupo.fetchPrecioTotal(matricula)
            const descuento = await Alumno.fetchCredito(matricula)
            const desc = descuento[0][0].Credito
            const precioTotal = (precio[0][0].Preciototal - desc)
            const periodoExistente = 1;
            response.render('alumnos/consultar_alumno', {
                periodoExistente: periodoExistente,
                schedule: schedule,
                precioTotal: precioTotal,
                confirmacion: confirmacion,
                planesPago: planesPago,
                alumnoConsulta: alumnoConsulta[0],
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            });
        }
    } catch(error) {
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
        });
    }
};

// Modificar Fichas
exports.post_fetch_fichas = (request, response, next) => {
    let matches = request.body.buscar.match(/(\d+)/);
    const matricula = matches[0];
    Alumno.fetchOne(matricula)
        .then(([alumno, fieldData]) => {
            Fichas.fetch(matricula)
                .then(([fichas, fieldData]) => {
                    response.render('alumnos/modificar_fichas', {
                        alumno: alumno,
                        fichas: fichas, 
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
                    });
                    console.log(error);
                });
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        });
};

exports.get_fichas = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: false, 
        fichas_pago: true,
        datos_alumno: false,
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
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};