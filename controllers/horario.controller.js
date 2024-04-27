const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');
const Periodo = require('../models/periodo.model');

exports.get_propuesta_horario = async (request, response, next) => {
    const schedule = await Grupo.fetchSchedule(request.session.username)
    const precioTotal = await Grupo.fetchPrecioTotal(request.session.username)
    const confirmacion = await Alumno.fetchHorarioConfirmado(request.session.username)
    console.log(schedule)
    response.render('alumnos/consultarHorario', {
        schedule: schedule,
        precioTotal: precioTotal,
        confirmacion: confirmacion,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken(),
    })
};