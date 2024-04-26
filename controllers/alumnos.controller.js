const Grupo = require('../models/grupo.model');
const Alumno = require('../models/alumno.model');

exports.post_propuesta_horario = (request, response, next) => {
    const schedule = Grupo.fetchSchedule(request.session.username)
    console.log(schedule)
        .then(([schedule, fieldData]) => {
            Grupo.fetchPrecioTotal(request.session.username)
                .then((precioTotal) => {
                    Alumno.fetchHorarioConfirmado(request.session.username)
                    .then((confirmacion) => {  
                        response.render('alumnos/consultarHorario', {
                            schedule: schedule,
                            precioTotal: precioTotal,
                            confirmacion: confirmacion,
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
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