const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const PlanPago = require('../models/planpago.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const Periodo = require('../models/periodo.model');
const PrecioCredito = require('../models/precio_credito.model');
const Materia = require('../models/materia.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const { getAllUsers, getAllCourses, getAllPeriods, getUserGroups, destroyGroup } = require('../util/adminApiClient');
const { request } = require('express');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_propuesta_horario = async (request, response, next) => {
    try {
        const periodo = await Periodo.fetchActivo();
        const IDPeriodoActivo = periodo[0][0].IDPeriodo;
        const conf = await EstudianteProfesional.fetchHorarioConfirmado(request.session.username, IDPeriodoActivo);
        const planes = await PlanPago.fetchAllActivePlans();
        const confirmacion = conf[0][0].horarioConfirmado;
        const planesPago = planes[0];
        var periodoExistente = 1;

        if (confirmacion === 0) {
            const matricula = request.session.username;
            const periodo = await Periodo.fetchActivo();
            if (periodo[0].length === 0) {
                periodoExistente = 0;
                response.render('alumnos/consultarHorario', {
                    periodoExistente: periodoExistente,
                    periodo: periodo[0][0],
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

                        const idGrupo = schedules[0]?.group_id || '';

                        const horarios = schedules.map(schedule => {
                            const {
                                weekday = '',
                                start_hour = '',
                                end_hour = '',
                            } = schedule;

                            // Crear objetos Date a partir de las horas de inicio y final
                            // Convierte las horas usando moment-timezone
                            const startDate = moment.tz(start_hour, 'America/Mexico_City');
                            const endDate = moment.tz(end_hour, 'America/Mexico_City');

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

                    let precioTotal = cursos.reduce((total, curso) => total + curso.precioMateria, 0);

                    const credito = await Alumno.fetchCredito(matricula);
                    const valorCredito = credito[0][0]['CAST(credito AS CHAR(20))'];

                    const beca = await EstudianteProfesional.fetchBeca(matricula);
                    const porcenBeca = beca[0][0].porcBeca;

                    response.render('alumnos/consultarHorario', {
                        periodoExistente: periodoExistente,
                        schedule: cursos,
                        periodo: periodo[0][0],
                        confirmacion: confirmacion,
                        planesPago: planesPago,
                        porcBeca: porcenBeca,
                        credito: Number(valorCredito),
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
                        error_alumno: true
                    });
                }
            }
        }

        else if (confirmacion === 1) {
            const schedule = await Grupo.fetchSchedule(request.session.username, periodo[0][0].IDPeriodo)
            const precio = await Grupo.fetchPrecioTotal(request.session.username, periodo[0][0].IDPeriodo)
            let precioTotal = precio[0][0].Preciototal;

            const [colegiaturaActual, fieldData] = await Colegiatura.fetchColegiaturaActiva(request.session.username);

            const credito = colegiaturaActual[0].creditoColegiatura

            const beca = await EstudianteProfesional.fetchBeca(request.session.username);
            const porcenBeca = beca[0][0].porcBeca;

            for (let count = 0; count < schedule[0].length; count++) {
                schedule[0][count].fechaInicio = moment(new Date(schedule[0][count].fechaInicio)).format('LL');
                schedule[0][count].fechaTermino = moment(new Date(schedule[0][count].fechaTermino)).format('LL');
            }

            const periodoExistente = 1;
            response.render('alumnos/consultarHorario', {
                periodoExistente: periodoExistente,
                schedule: schedule,
                precioTotal: precioTotal,
                periodo: periodo[0][0],
                confirmacion: confirmacion,
                planesPago: planesPago,
                porcBeca: porcenBeca,
                credito: Number(credito),
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
            error_alumno: true
        });
        console.log(error);
    }

};

const ensureArray = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (value === undefined || value === null) {
        return [];
    }
    return [value];
};

exports.post_confirmar_horario = async (request, response, next) => {
    const [periodo, fieldData] = await Periodo.fetchActivo();
    const periodoActivo = periodo[0].IDPeriodo;
    const precioCredito = await PrecioCredito.fetchIDActual();
    const precioActual = precioCredito[0][0].IDPrecioCredito;
    const matricula = request.session.username

    const idMateria = ensureArray(request.body['idMateria[]']);
    const nombreProfesorCompleto = ensureArray(request.body['nombreProfesorCompleto[]']);
    const salon = ensureArray(request.body['salon[]']);
    const fechaInicio = ensureArray(request.body['fechaInicio[]']);
    const fechaFin = ensureArray(request.body['fechaFin[]']);
    const idGrupo = ensureArray(request.body['idGrupo[]']);
    const grupoHorario = ensureArray(request.body['grupoHorario[]']);
    const grupoHorarioValidado = grupoHorario.map(item => JSON.parse(item));


    const idGrupoEliminado = ensureArray(request.body['idGrupoEliminado[]']);
    const nombreProfesorCompletoEliminado = ensureArray(request.body['nombreProfesorCompletoEliminado[]']);
    const salonEliminado = ensureArray(request.body['salonEliminado[]']);
    const grupoHorarioEliminado = ensureArray(request.body['grupoHorarioEliminado[]']);
    const grupoHorarioValidadoEliminado = grupoHorarioEliminado.map(item => JSON.parse(item));
    const fechaInicioEliminado = ensureArray(request.body['fechaInicioEliminado[]']);
    const fechaFinEliminado = ensureArray(request.body['fechaFinEliminado[]']);
    const idMateriaEliminado = ensureArray(request.body['idMateriaEliminado[]']);

    try {
        // Iterar sobre los cursos confirmados
        for (let i = 0; i < idMateria.length; i++) {

            const profesor = nombreProfesorCompleto[i];
            const salonCurso = salon[i];
            let horarioCurso = grupoHorarioValidado[i];
            const fechaInicioCurso = moment(fechaInicio[i], 'LL').format('YYYY-MM-DD');
            const fechaFinCurso = moment(fechaFin[i], 'LL').format('YYYY-MM-DD');
            const IDMateria = idMateria[i];
            const IDGrupo = idGrupo[i];

            let horarioBaseDatos = '';
            for (let count = 0; count < horarioCurso.length; count++) {
                if ((count + 1) === horarioCurso.length) {
                    horarioBaseDatos += horarioCurso[count].diaSemana + ' ' + horarioCurso[count].fechaInicio + ' - ' + horarioCurso[count].fechaTermino;
                } else {
                    horarioBaseDatos += horarioCurso[count].diaSemana + ' ' + horarioCurso[count].fechaInicio + ' - ' + horarioCurso[count].fechaTermino + ', ';
                }
            }

            const existeCurso = await Grupo.checkGrupoExistente(matricula, IDGrupo, periodoActivo);
                
            if (existeCurso) {
                if(existeCurso.Activo === 1){
                    continue; // Saltar este curso
                }
                    await Grupo.activateGrupo(alumnosNoConfirmados[count].Matricula,curso.idGrupo, periodoActivo);
                    continue; // Saltar este curso
            }

            // Guardar el grupo en la base de datos
            await Grupo.saveGrupo(
                request.session.username,
                IDMateria,
                precioActual,
                profesor,
                salonCurso,
                horarioBaseDatos,
                fechaInicioCurso,
                fechaFinCurso,
                IDGrupo,
                periodoActivo,
                1
            );
        }

        for (let i = 0; i < idGrupoEliminado.length; i++) {
            const IDGrupoEliminado = idGrupoEliminado[i];
            const profesor = nombreProfesorCompletoEliminado[i];
            const salonCurso = salonEliminado[i];
            let horarioCurso = grupoHorarioValidadoEliminado[i];
            const fechaInicioCurso = moment(fechaInicioEliminado[i], 'LL').format('YYYY-MM-DD');
            const fechaFinCurso = moment(fechaFinEliminado[i], 'LL').format('YYYY-MM-DD');
            const IDMateria = idMateriaEliminado[i];

            let horarioBaseDatos = '';
            for (let count = 0; count < horarioCurso.length; count++) {
                if ((count + 1) === horarioCurso.length) {
                    horarioBaseDatos += horarioCurso[count].diaSemana + ' ' + horarioCurso[count].fechaInicio + ' - ' + horarioCurso[count].fechaTermino;
                } else {
                    horarioBaseDatos += horarioCurso[count].diaSemana + ' ' + horarioCurso[count].fechaInicio + ' - ' + horarioCurso[count].fechaTermino + ', ';
                }
            }

            await Grupo.saveGrupo(
                request.session.username,
                IDMateria,
                precioActual,
                profesor,
                salonCurso,
                horarioBaseDatos,
                fechaInicioCurso,
                fechaFinCurso,
                IDGrupoEliminado,
                periodoActivo,
                0
            );
            await destroyGroup(request.session.username, IDGrupoEliminado)
        }

        // Acciones adicionales después de manejar cada grupo
        await Colegiatura.createColegiaturasFichas(request.body.IDPlanPago, request.session.username, precioActual);
        await EstudianteProfesional.updateHorarioAccepted(request.session.username, periodoActivo);

        response.redirect('/horario/consultaHorario');
    } catch (error) {
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: true
        });
        console.log(error);
    }
};
