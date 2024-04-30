const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const PlanPago = require('../models/planpago.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const Periodo = require('../models/periodo.model');
const PrecioCredito = require('../models/precio_credito.model');
const Materia = require('../models/materia.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const { getAllUsers, getAllCourses, getAllPeriods, getUserGroups } = require('../util/adminApiClient');
const { request } = require('express');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_propuesta_horario = async (request, response, next) => {

    try {
        const conf = await Alumno.fetchHorarioConfirmado(request.session.username)
        const planes = await PlanPago.fetchAllActivePlans()
        const confirmacion = conf[0][0].horarioConfirmado
        const planesPago = planes[0]
        var periodoExistente = 1;

        if (confirmacion === 0) {
            const matricula = request.session.username;
            const periodo = await Periodo.fetchActivo();
            if (periodo[0].length === 0) {
                periodoExistente = 0;
                response.render('alumnos/consultarHorario', {
                    periodoExistente: periodoExistente,
                    username: request.session.username || '',
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                    csrfToken: request.csrfToken()
                })
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

                        const startDateFormat = moment(startDate).format('LL');
                        const endDateFormat = moment(endDate).format('LL');

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

                            const fechaInicio = moment(startDate).format('LT');
                            const fechaTermino = moment(endDate).format('LT');
                            console.log(fechaInicio);

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

                    let precioTotal = cursos.reduce((total, curso) => total + curso.precioMateria, 0);

                    const credito = await Alumno.fetchCredito(matricula);
                    const valorCredito = credito[0][0]['CAST(credito AS CHAR(20))'];

                    const beca = await EstudianteProfesional.fetchBeca(matricula);
                    const porcenBeca = beca[0][0].porcBeca / 100;

                    precioTotal = precioTotal - (precioTotal * porcenBeca) - valorCredito

                    response.render('alumnos/consultarHorario', {
                        periodoExistente: periodoExistente,
                        schedule: cursos,
                        confirmacion: confirmacion,
                        planesPago: planesPago,
                        precioTotal: precioTotal,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                }
                catch (error) {
                    console.error('Error realizando operaciones:', error);
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        error_alumno: false
                    });
                }
            }
        }

        else if (confirmacion === 1) {
            const schedule = await Grupo.fetchSchedule(request.session.username)
            const precio = await Grupo.fetchPrecioTotal(request.session.username)
            let precioTotal = precio[0][0].Preciototal

            const credito = await Alumno.fetchCredito(request.session.username);
            const valorCredito = credito[0][0]['CAST(credito AS CHAR(20))'];

            const beca = await EstudianteProfesional.fetchBeca(request.session.username);
            const porcenBeca = beca[0][0].porcBeca / 100;

            precioTotal = precioTotal - (precioTotal * porcenBeca) - valorCredito;

            for (let count = 0; count < schedule[0].length; count++) {
                schedule[0][count].fechaInicio = moment(new Date(schedule[0][count].fechaInicio)).format('LL');
                schedule[0][count].fechaTermino = moment(new Date(schedule[0][count].fechaTermino)).format('LL');
            }

            const periodoExistente = 1;
            response.render('alumnos/consultarHorario', {
                periodoExistente: periodoExistente,
                schedule: schedule,
                precioTotal: precioTotal,
                confirmacion: confirmacion,
                planesPago: planesPago,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            })
        }
    }
    catch (error) {
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
        console.log(error);
    }

};

exports.post_confirmar_horario = async (request, response, next) => {

    const precioCredito = await PrecioCredito.fetchIDActual();
    const precioActual = precioCredito[0][0].IDPrecioCredito;

    const idMateria = Array.isArray(request.body['idMateria[]']) ? request.body['idMateria[]'] : [];
    const nombreProfesorCompleto = Array.isArray(request.body['nombreProfesorCompleto[]']) ? request.body['nombreProfesorCompleto[]'] : [];
    const salon = Array.isArray(request.body['salon[]']) ? request.body['salon[]'] : [];
    const fechaInicio = Array.isArray(request.body['fechaInicio[]']) ? request.body['fechaInicio[]'] : [];
    const fechaFin = Array.isArray(request.body['fechaFin[]']) ? request.body['fechaFin[]'] : [];
    const grupoHorario = Array.isArray(request.body['grupoHorario[]']) ? request.body['grupoHorario[]'] : [];
    const grupoHorarioValidado = grupoHorario.map(item => item === '' ? null : item);

    try {
        // Iterar sobre los cursos confirmados
        for (let i = 0; i < idMateria.length; i++) {
            const materia = idMateria[i];
            const profesor = nombreProfesorCompleto[i];
            const salonCurso = salon[i];
            let horarioCurso = grupoHorarioValidado[i];
            const fechaInicioCurso = fechaInicio[i];
            const fechaFinCurso = fechaFin[i];
            const IDMateria = idMateria[i];
        
            // Si horarioCurso es undefined, establecerlo en una cadena vacía
            horarioCurso = horarioCurso === undefined ? '' : horarioCurso;
        
            // Guardar el grupo en la base de datos
            await Grupo.saveGrupo(
                request.session.username,
                IDMateria,
                precioActual,
                profesor,
                salonCurso,
                horarioCurso,
                fechaInicioCurso,
                fechaFinCurso
            );
        }

        // Acciones adicionales después de manejar cada grupo
        await Colegiatura.createColegiaturasFichas(request.body.IDPlanPago, request.session.username, precioActual);
        await Alumno.updateHorarioAccepted(request.session.username);

        response.redirect('/horario/consultaHorario');
    }
    catch (error) {
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: true
        });
        console.log(error);
    }
}