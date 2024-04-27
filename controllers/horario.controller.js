const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const PlanPago = require('../models/planpago.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const { request } = require('express');

exports.get_propuesta_horario = async (request, response, next) => {
    const schedule = await Grupo.fetchSchedule(request.session.username)
    const precio = await Grupo.fetchPrecioTotal(request.session.username)
    const conf = await Alumno.fetchHorarioConfirmado(request.session.username)
    const planes = await PlanPago.fetchAllActivePlans()
    const precioTotal = precio[0][0].Preciototal
    const confirmacion = conf[0][0].horarioConfirmado
    const planesPago = planes[0]
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
};

exports.post_confirmar_horario = async (request, response, next) =>{
    Alumno.updateHorarioAccepted(request.session.username)
    Colegiatura.createColegiaturasFichas(request.body.IDPlanPago, request.session.username)
    Usuario.fetchCorreo(request.session.username)
    .then(() => {
        response.redirect('alumnos/consultarHorario');
    })
    .catch((error) => {
        console.log(error)
    })
};