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
        const resultfetchCreditoActivo = await PrecioCredito.fetchCreditoActivo(); // Espera a que la promesa se resuelva
        const resultfetchIDPorGrupo = await Materia.fetchIDPorGrupo(IDGrupo);
        const resultfetchBeca = await Alumno.fetchBeca(matricula);
        const resultfetchCredito = await Alumno.fetchCreditoINT(matricula);
        const resultfetchIDExterno = await Grupo.fetchIDExterno(IDGrupo,matricula);
        const creditoactual = resultfetchCreditoActivo[0][0].precioPesos; // Acceder al valor numérico
        const IDMateria = resultfetchIDPorGrupo[0][0].IDMateria;
        const Beca = resultfetchBeca[0][0].beca;
        const Credito = resultfetchCredito[0][0].credito;
        const IDExterno = resultfetchIDExterno[0][0].IDGrupoExterno
        
        await Fichas.delete_grupo_update_fichas(matricula, IDGrupo, creditoactual, IDMateria, Beca, Credito);

        await destroyGroup(matricula, IDExterno);
        
        response.status(200).json({ success: true });
    } catch (error) {
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }

    // response.redirect('/alumnos/datos_alumno');
}


exports.post_datos_modify = async (request, response, next) => {
    const { ref, beca, alumno, csrf } = request.body;

    const resultfetchBecaoriginal = await Alumno.fetchBeca(alumno);

    const resultfetchReforiginal = await Alumno.fetchRef(alumno);

    let beca_original = resultfetchBecaoriginal[0][0].beca;

    let ref_original = resultfetchReforiginal[0][0].referenciaBancaria

    let beca_uso;

    let beca_new = beca;

    if (beca == "") {
        beca_new = '0';
    }

    if(ref == ""){
        ref = ref_original;
    }

    try {
        let data;
        if (alumno.startsWith("1")) {
            if(beca_new == 0){
                beca_uso = 1
            }
            else{
                beca_uso = (1 - (beca_new / 100)) 
            }
            if (beca_uso != beca_original){
            const resultfetchCredito = await Alumno.fetchCreditoINT(alumno);
            const credito = resultfetchCredito[0][0].credito;
            await Fichas.update_fichas_beca(alumno,beca_uso,credito);
            } 
            data = await EstudianteProfesional.update(alumno, ref, beca_new); 
        } else if (alumno.startsWith("8")) {
            data = await EstudianteDiplomado.update(alumno, ref);
        } else {
            // Manejar otros casos según sea necesario
            response.status(500).json({ success: false, message: 'Matrícula no válida' });
            return;
        }
        response.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};

exports.post_fetch_datos = async (request, response, next) => {
    let matches = request.body.buscar.match(/(\d+)/);
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

    try {
        let alumnoConsulta;

        const [pagos] = await Pago.fetchOne(matricula);
        const [cargosExtra] = await PagoExtra.fetchSinPagar(matricula);
        const [pagosExtra] = await PagoExtra.fetchPagados(matricula);
        const [deuda] = await Deuda.fetchDeudaConsultarAlumno(matricula);
        const [pagosDiplomado] = await PagaDiplomado.fetchPagosDiplomado(matricula);
        const [estadoCuenta] = await Deuda.fetchEstadoDeCuenta(matricula);

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
        if (matricula.startsWith('1')) {
            alumnoConsulta = await EstudianteProfesional.fetchDatos(matricula);
            const conf = await EstudianteProfesional.fetchHorarioConfirmado(matricula)
            confirmacion = conf[0][0].horarioConfirmado;
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
                confirmacion: confirmacion,
                alumnoConsulta: alumnoConsulta[0],
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
            const schedule = await Grupo.fetchSchedule(matricula)
            const precio = await Grupo.fetchPrecioTotal(matricula)
            const credito = await Alumno.fetchCredito(matricula)
            const cred = (credito[0][0].Credito) ?? 0;
            const precioTotal = (precio[0][0].Preciototal - cred)
            const periodoExistente = 1;
            response.render('alumnos/consultar_alumno', {
                error: false,
                periodo: periodo[0][0],
                periodoExistente: periodoExistente,
                schedule: schedule,
                precioTotal: precioTotal,
                confirmacion: confirmacion,
                alumnoConsulta: alumnoConsulta[0],
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
    const { descuentoNum, fechaFormat, notaNum, id } = request.body;
    const modificador = request.session.username;

    if (descuentoNum == null) {
        descuentoNum = 0;
    }

    try {
        const data = await Fichas.update(descuentoNum, fechaFormat, notaNum, modificador, id);
        response.status(200).json({ success: true, data: data });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: 'Error actualizando la ficha' });
    }
};