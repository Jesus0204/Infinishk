const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const PlanPago = require('../models/planpago.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const Periodo = require('../models/periodo.model');
const PrecioCredito = require('../models/precio_credito.model');
const Materia = require('../models/materia.model');
const Fichas = require('../models/fichas_pago.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const EstudianteDiplomado = require('../models/estudiante_Diplomado.model');
const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagaDiplomado = require('../models/pagadiplomado.model');
const PagoExtra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const { getAllUsers, getAllCourses, getAllPeriods, getUserGroups,destroyGroup } = require('../util/adminApiClient');
const { request, response } = require('express');

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
                // Conviertes la fecha si existe
                for (let count = 0; count < deuda.length; count++) {
                    deuda[count].fechaLimitePago = moment(new Date(deuda[count].fechaLimitePago)).format('LL');
                }
                deudas.push(deuda);
            }

            const [alumnos_actuales, fieldData_2] = await Deuda.fetchAlumnos_DeudaActual();
            const [atrasados, fieldData_3] = await Deuda.fetchAlumnos_Atrasados(now);
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
    const { IDGrupo, matricula } = request.body;

    try {
        const resultfetchCreditoActivo = await PrecioCredito.fetchCreditoActivo();
        const resultfetchIDPorGrupo = await Materia.fetchIDPorGrupo(IDGrupo);
        const resultfetchBeca = await Alumno.fetchBeca(matricula);
        const resultfetchCredito = await Alumno.fetchCreditoColegiatura(matricula);
        const resultfetchIDExterno = await Grupo.fetchIDExterno(IDGrupo, matricula);
        const resultfetchInicio = await Periodo.fetchInicio();
        const resultfetchFin = await Periodo.fetchFin();
        
        const creditoactual = resultfetchCreditoActivo[0][0].precioPesos;
        const IDMateria = resultfetchIDPorGrupo[0][0].IDMateria;
        const Beca = resultfetchBeca[0][0].beca;
        const Credito = resultfetchCredito[0][0].creditoColegiatura;
        const IDExterno = resultfetchIDExterno[0][0].IDGrupoExterno;
        const fechaInicio = moment(resultfetchInicio[0][0].fechaInicio).format('YYYY-MM-DD');
        const fechaFin = moment(resultfetchFin[0][0].fechaFin).format('YYYY-MM-DD');

        // Obtener número de fichas sin pagar
        const numeroFichasSinPagar = await Fichas.calcularNumeroDeudas(matricula, fechaInicio, fechaFin);

        // Si hay fichas sin pagar, realiza la baja y elimina el grupo
        if (numeroFichasSinPagar > 0) {
            await Fichas.delete_grupo_update_fichas(matricula, IDGrupo, creditoactual, IDMateria, Beca, Credito);
            await destroyGroup(matricula, IDExterno);
        } else {
            response.status(200).json({ success: true, message: 'No hay fichas sin pagar, grupo no eliminado' });
            return;
        }
        
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};


exports.post_dar_baja_grupo60 = async (request, response, next) => {
    const { IDGrupo, matricula } = request.body;

    try {
        const resultfetchCreditoActivo = await PrecioCredito.fetchCreditoActivo();
        const resultfetchIDPorGrupo = await Materia.fetchIDPorGrupo(IDGrupo);
        const resultfetchBeca = await Alumno.fetchBeca(matricula);
        const resultfetchCredito = await Alumno.fetchCreditoColegiatura(matricula);
        const resultfetchIDExterno = await Grupo.fetchIDExterno(IDGrupo, matricula);
        const resultfetchInicio = await Periodo.fetchInicio();
        const resultfetchFin = await Periodo.fetchFin();
        
        const creditoactual = resultfetchCreditoActivo[0][0].precioPesos;
        const IDMateria = resultfetchIDPorGrupo[0][0].IDMateria;
        const Beca = resultfetchBeca[0][0].beca;
        const Credito = resultfetchCredito[0][0].creditoColegiatura;
        const IDExterno = resultfetchIDExterno[0][0].IDGrupoExterno;
        const fechaInicio = moment(resultfetchInicio[0][0].fechaInicio).format('YYYY-MM-DD');
        const fechaFin = moment(resultfetchFin[0][0].fechaFin).format('YYYY-MM-DD');
        
        // Obtener número de fichas sin pagar
        const numeroFichasSinPagar = await Fichas.calcularNumeroDeudas(matricula, fechaInicio, fechaFin);

        // Si hay fichas sin pagar, realiza la baja y elimina el grupo
        if (numeroFichasSinPagar > 0) {
            await Fichas.delete_grupo_update_fichas60(matricula, IDGrupo, creditoactual, IDMateria, Beca, Credito);
            await destroyGroup(matricula, IDExterno);
        } else {
            response.status(200).json({ success: true, message: 'No hay fichas sin pagar, grupo no eliminado' });
            return;
        }
        
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
}

exports.post_dar_baja_grupo100 = async (request, response, next) => {
    const { IDGrupo, matricula } = request.body;

    try {
        const resultfetchCreditoActivo = await PrecioCredito.fetchCreditoActivo();
        const resultfetchIDPorGrupo = await Materia.fetchIDPorGrupo(IDGrupo);
        const resultfetchBeca = await Alumno.fetchBeca(matricula);
        const resultfetchCredito = await Alumno.fetchCreditoColegiatura(matricula);
        const resultfetchIDExterno = await Grupo.fetchIDExterno(IDGrupo, matricula);
        const resultfetchInicio = await Periodo.fetchInicio();
        const resultfetchFin = await Periodo.fetchFin();
        
        const creditoactual = resultfetchCreditoActivo[0][0].precioPesos;
        const IDMateria = resultfetchIDPorGrupo[0][0].IDMateria;
        const Beca = resultfetchBeca[0][0].beca;
        const Credito = resultfetchCredito[0][0].creditoColegiatura;
        const IDExterno = resultfetchIDExterno[0][0].IDGrupoExterno;
        const fechaInicio = moment(resultfetchInicio[0][0].fechaInicio).format('YYYY-MM-DD');
        const fechaFin = moment(resultfetchFin[0][0].fechaFin).format('YYYY-MM-DD');
        
        // Obtener número de fichas sin pagar
        const numeroFichasSinPagar = await Fichas.calcularNumeroDeudas(matricula, fechaInicio, fechaFin);

        // Si hay fichas sin pagar, realiza la baja y elimina el grupo
        if (numeroFichasSinPagar > 0) {
            await Fichas.delete_grupo_update_fichas100(matricula, IDGrupo, creditoactual, IDMateria, Beca, Credito);
            await destroyGroup(matricula, IDExterno);
        } else {
            response.status(200).json({ success: true, message: 'No hay fichas sin pagar, grupo no eliminado' });
            return;
        }
        
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
}


exports.post_datos_modify = async (request, response, next) => {
    const { ref, beca, alumno, csrf } = request.body;

    const resultfetchBecaoriginal = await Alumno.fetchBeca(alumno);

    const resultfetchReforiginal = await Alumno.fetchRef(alumno);

    let ref_original = resultfetchReforiginal[0][0].referenciaBancaria
    
    let beca_uso;
    
    let beca_new = beca;
    
    if (beca == "") {
        beca_new = '0';
    }
    
    if(ref == ""){
        ref = ref_original;
    }
    
    let data;
    if (alumno.startsWith("1")) {
        try {
            let beca_original = resultfetchBecaoriginal[0][0].beca;
            if (beca_new == 0){
                beca_uso = 1
            }
            else {
                beca_uso = (1 - (beca_new / 100)) 
            }
            if (beca_uso != beca_original){
                const resultfetchCreditoActivo = await PrecioCredito.fetchCreditoActivo();
                const resultfetchCredito = await Alumno.fetchCreditoColegiatura(alumno);
                const credito = resultfetchCredito[0][0].creditoColegiatura;
                const creditoactual = resultfetchCreditoActivo[0][0].precioPesos;
                await Fichas.update_fichas_beca(alumno,beca_uso,credito,creditoactual);
            } 
            data = await EstudianteProfesional.update(alumno, ref, beca_new); 

            response.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                success: false,
                message: 'Error actualizando los datos'
            });
        }
    } else if (alumno.startsWith("8")) {
        try {
            data = await EstudianteDiplomado.update(alumno, ref);

            response.status(200).json({
                success: true,
                data: data
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                success: false,
                message: 'Error actualizando los datos'
            });
        }
    } else {
        // Manejar otros casos según sea necesario
        response.status(500).json({ success: false, message: 'Matrícula no válida' });
        return;
    }
};

// Eliminar Pago
// Pagos Extra
exports.post_eliminar_pago_extra = async (request, response, next) => {
    const id = request.body.IDLiquida;

    try {
        await Liquida.updateDeleted(id);

        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error borrando pago de solicitud extra' });
    }
}

// Colegiatura
exports.post_eliminar_pago_col = async (request, response, next) => {
    const id = request.body.IDPago;
    const usuario = request.session.username;

    try {
        await Pago.delete_col(id, usuario);

        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error borrando pago de colegiatura' });
    }
}

// Diplomado
exports.post_eliminar_pago_dip = async (request, response, next) => {
    const id = request.body.IDPagaDiplomado;
    
    try {
        await PagaDiplomado.delete(id);

        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error borrando pago de diplomado' });
    }
}

exports.get_fetch_datos = async (request, response, next) => {
    try {
        let matches = request.params.matricula.match(/\d+$/);
        const matricula = matches[0];
        const periodo = await Periodo.fetchActivo();
        const now = moment().tz('America/Mexico_City').startOf('day').subtract(1, 'days').format();
        const fechaInicio = await Periodo.fetchInicio();

        // Extrae la fecha de `fechaInicio` asegurándote de que accedes correctamente al valor
        const fecha = fechaInicio[0][0].fechaInicio; // Ajusta esto según la estructura correcta

        // Calcula la fecha límite (dos semanas después de la fecha de inicio)
        const fechaLimite = moment(fecha).add(2, 'weeks');

        // Obtén la fecha actual
        const fechaActual = moment();

        // Compara la fecha actual con la fecha límite
        const mostrarEliminar = fechaActual.isSameOrBefore(fechaLimite);

        let alumnoConsulta;

        const [pagos] = await Pago.fetchOne(matricula);
        const [cargosExtra] = await PagoExtra.fetchSinPagar(matricula);
        const [pagosExtra] = await PagoExtra.fetchPagados(matricula);
        const [deuda] = await Deuda.fetchDeudaConsultarAlumno(matricula);
        const [pagosDiplomado] = await PagaDiplomado.fetchPagosDiplomado(matricula);
        const [estadoCuenta] = await Deuda.fetchEstadoDeCuenta(matricula);
        const creditoAlumno = await Alumno.fetchCreditoINT(matricula);

        // Conviertes la fecha si existe
        for (let count = 0; count < deuda.length; count++) {
            deuda[count].fechaLimitePago = moment(new Date(deuda[count].fechaLimitePago)).format('LL');
        }

        // Conviertes la fecha si existe
        for (let count = 0; count < pagos.length; count++) {
            pagos[count].fechaPago = moment(new Date(pagos[count].fechaPago)).format('LL');
        }

        // Conviertes la fecha si existe
        for (let count = 0; count < pagosDiplomado.length; count++) {
            pagosDiplomado[count].fechaPago = moment(new Date(pagosDiplomado[count].fechaPago)).format('LL');
        }

        // Conviertes la fecha si existe
        for (let count = 0; count < pagosExtra.length; count++) {
            pagosExtra[count].fechaPago = moment(new Date(pagosExtra[count].fechaPago)).format('LL');
        }

        let confirmacion;
        let alumnoDiplomadoActualConsulta = "";

        let creditoColegiatura = 0;
        if (matricula.startsWith('1')) {
            if (deuda.length != 0) {
                const IDColegiatura = deuda[0].IDColegiatura;
    
                const [creditoIDColegiatura, fieldData] = await Colegiatura.fetchCreditoColegiatura(IDColegiatura);
    
                creditoColegiatura = creditoIDColegiatura[0].creditoColegiatura;
            }
            alumnoConsulta = await EstudianteProfesional.fetchDatos(matricula);
            const conf = await EstudianteProfesional.fetchHorarioConfirmado(matricula, periodo[0][0].IDPeriodo);
            if (conf[0].length > 0) {
                confirmacion = conf[0][0].horarioConfirmado;
            }
            else {
                confirmacion = 0;
            }
        } else {
            alumnoConsulta = await EstudianteDiplomado.fetchDatos(matricula);
            alumnoConsulta[0][0].fechaInscripcion = moment(new Date(alumnoConsulta[0][0].fechaInscripcion)).format('LL');

            let fechaActual = moment().tz('America/Mexico_City').format('YYYY-MM-DD');
            alumnoDiplomadoActualConsulta = await EstudianteDiplomado.fetchDiplomadoCursando(matricula, fechaActual);
            confirmacion = 0;
        }
        if (confirmacion === 0) {
            response.render('alumnos/consultar_alumno', {
                error: true,
                periodo: periodo[0][0],
                precioTotal: 0,
                confirmacion: confirmacion,
                alumnoConsulta: alumnoConsulta[0],
                creditoAlumno: creditoAlumno[0][0].credito,
                creditoColegiatura: creditoColegiatura,
                alumnoDiplomadoActual: alumnoDiplomadoActualConsulta,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                estadoCuenta: estadoCuenta,
                pagos: pagos,
                deuda: deuda,
                fechaActual: now,
                pagosExtra: cargosExtra,
                pagadosExtra: pagosExtra,
                matricula: matricula,
                pagosDiplomado: pagosDiplomado,
                mostrarEliminar: mostrarEliminar,
                csrfToken: request.csrfToken()
            });
        }
        else if (confirmacion === 1) {
            const schedule = await Grupo.fetchSchedule(matricula, periodo[0][0].IDPeriodo);
            const precio = await Grupo.fetchPrecioTotal(matricula, periodo[0][0].IDPeriodo);
            const creditoAlumno = await Alumno.fetchCreditoINT(matricula);
            const precioTotal = (precio[0][0].Preciototal);
            const periodoExistente = 1;
            response.render('alumnos/consultar_alumno', {
                error: false,
                periodo: periodo[0][0],
                periodoExistente: periodoExistente,
                schedule: schedule,
                precioTotal: precioTotal,
                confirmacion: confirmacion,
                alumnoConsulta: alumnoConsulta[0],
                creditoAlumno: creditoAlumno[0][0].credito,
                creditoColegiatura: creditoColegiatura,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                estadoCuenta: estadoCuenta,
                pagos: pagos,
                deuda: deuda,
                fechaActual: now,
                pagosExtra: cargosExtra,
                pagadosExtra: pagosExtra,
                matricula: matricula,
                mostrarEliminar: mostrarEliminar,
                csrfToken: request.csrfToken()
            });
        }
    } catch (error) {
        console.log(error);
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
    }
};

exports.post_fetch_datos = async (request, response, next) => {
    try {
        let matches = request.body.buscar.match(/\d+$/);
        const matricula = matches[0];

        response.redirect(`/alumnos/datos_alumno/${matricula}`);
    } catch (error) {
        console.log(error);
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
    }
};

// Modificar Fichas
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
        datos_alumno: false,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_fichas_modify = async (request, response, next) => {
    const { deudaNum, descuentoNum, fechaFormat, notaNum, id } = request.body;
    const modificador = request.session.username;
    
    try {
        const data = await Fichas.update(deudaNum, descuentoNum, fechaFormat, notaNum, modificador, id);
        response.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};

exports.post_actualizar_horarios = async (request, response, next) => {
    const { matricula } = request.body; // Obtenemos la matrícula desde el input

    try {
        // Obtener datos base
        const [periodo, fieldData] = await Periodo.fetchActivo();
        const periodoActivo = periodo[0].IDPeriodo;

        const precioCredito = await PrecioCredito.fetchIDActual();
        const precioActual = precioCredito[0][0].IDPrecioCredito;

        const resultfetchCreditoActivo = await PrecioCredito.fetchCreditoActivo();
        const creditoactual = resultfetchCreditoActivo[0][0].precioPesos;

        const resultfetchBeca = await Alumno.fetchBeca(matricula);
        const Beca = resultfetchBeca[0][0].beca;

        const resultfetchCredito = await Alumno.fetchCreditoColegiatura(matricula);
        const Credito = resultfetchCredito[0][0].creditoColegiatura;

        const resultfetchInicio = await Periodo.fetchInicio();
        const resultfetchFin = await Periodo.fetchFin();

        const fechaInicio = moment(resultfetchInicio[0][0].fechaInicio).format('YYYY-MM-DD');
        const fechaFin = moment(resultfetchFin[0][0].fechaFin).format('YYYY-MM-DD');

        const numeroFichasSinPagar = await Fichas.calcularNumeroDeudas(matricula, fechaInicio, fechaFin);

        // Validar deudas
        if (numeroFichasSinPagar > 0) {
            const schedule = await getUserGroups(periodoActivo, Number(matricula));

            if (schedule.data.length === 0) {
                return response.status(404).json({
                    message: `El alumno con matrícula ${matricula} no tiene un horario asignado.`
                });
            }

            // Procesar horarios
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

                const startDateFormat = moment(new Date(start_date)).format('YYYY-MM-DD');
                const endDateFormat = moment(new Date(end_date)).format('YYYY-MM-DD');

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

                    const fechaInicio = moment.tz(start_hour, 'America/Mexico_City').format('HH:mm');
                    const fechaTermino = moment.tz(end_hour, 'America/Mexico_City').format('HH:mm');

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
                };
            });

            let gruposNuevosGuardados = false; // Variable de control

            for (let curso of cursos) {
                // Verificamos si el grupo ya está registrado
                const grupoExistente = await Grupo.fetchGrupo(matricula, curso.idMateria, curso.idGrupo);

                if (!grupoExistente || grupoExistente.length === 0) {
                    // Si el grupo no existe, lo guardamos
                    const grupoHorarioValidado = curso.horarios.map(item => item === '' ? null : item);
                    const claseFormato = grupoHorarioValidado
                        .map((item, index) =>
                            `${item.diaSemana} ${item.fechaInicio} - ${item.fechaTermino}${index < grupoHorarioValidado.length - 1 ? ', ' : ''}`
                        )
                        .join('');

                    await Grupo.saveGrupo(
                        matricula,
                        curso.idMateria,
                        precioActual,
                        curso.nombreProfesorCompleto,
                        curso.nombreSalon,
                        claseFormato,
                        curso.startDateFormat,
                        curso.endDateFormat,
                        curso.idGrupo,
                        periodoActivo,
                        1
                    );

                    await Fichas.actualizarMaterias(matricula, curso.idMateria, creditoactual,Beca, Credito);
                    gruposNuevosGuardados = true;
                } else if (grupoExistente[0].Activo === 1) {
                    continue;
                } else if (grupoExistente[0].Activo === 0) {
                    await Fichas.actualizarMaterias(matricula, curso.idMateria, creditoactual, Beca, Credito);
                    gruposNuevosGuardados = true;
                }
            }

            if (!gruposNuevosGuardados) {
                return response.status(200).json({
                    success: false,
                    message: `No se encontraron grupos nuevos para el alumno con matrícula ${matricula}.`
                });
            }

            return response.status(200).json({
                success: true,
                message: `El horario del alumno con matrícula ${matricula} ha sido aceptado y los grupos nuevos han sido registrados.`
            });
        } else {
            return response.status(400).json({
                success: false,
                message: `El alumno con matrícula ${matricula} tiene deudas pendientes.`
            });
        }
    } catch (error) {
        console.error('Error al procesar el horario del alumno:', error);
        return response.status(500).json({
            success: false,
            message: 'Ocurrió un error al procesar el horario del alumno.'
        });
    }
};
