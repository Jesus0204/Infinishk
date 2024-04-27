const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const PlanPago = require('../models/planpago.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const Periodo = require('../models/periodo.model');
const { getAllUsers, getAllCourses,getAllPeriods,getUserGroups } = require('../util/adminApiClient');
const { request } = require('express');

exports.get_propuesta_horario = async (request, response, next) => {
    const conf = await Alumno.fetchHorarioConfirmado(request.session.username)
    const planes = await PlanPago.fetchAllActivePlans()
    const confirmacion = conf[0][0].horarioConfirmado
    const planesPago = planes[0]

    if (confirmacion === 0){
        const matricula = request.session.username;
        const periodo = Periodo.fetchActivo();
        const periodoActivo = periodo[0][0].IDPeriodo;
        console.log(periodoActivo);
    }

    if (confirmacion === 1) {
        const schedule = await Grupo.fetchSchedule(request.session.username)
        const precio = await Grupo.fetchPrecioTotal(request.session.username)
        const precioTotal = precio[0][0].Preciototal
        response.render('alumnos/consultarHorario', {
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
};

exports.post_confirmar_horario = async (request, response, next) => {
    await Alumno.updateHorarioAccepted(request.session.username)
    await Colegiatura.createColegiaturasFichas(request.body.IDPlanPago, request.session.username)
    await Usuario.fetchCorreo(request.session.username)
    response.redirect('/horario/consultaHorario');
}