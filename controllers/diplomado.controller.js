const Diplomado = require('../models/diplomado.model');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_diplomado = (request, response, next) => {
    response.render('diplomado/diplomado', {
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        username: request.session.username || ''
    });
};

exports.get_registrar_diplomado = (request, response, next) => {
    response.render('diplomado/registrar_diplomado', {
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        username: request.session.username || ''
    });
};

exports.get_check_diplomado = (request, response, next) => {
    const nombre = request.query.nombre;
    Diplomado.fetchOne(nombre)
        .then(([diplomados]) => {
            if (diplomados.length > 0) {
                response.json({ exists: true });
            } else {
                response.json({ exists: false });
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_fetch_diplomado = (request, response, next) => {
    const nombre = request.body.nombre;
    Diplomado.fetchOne(nombre)
        .then(([diplomados, fieldData]) => {
            if (diplomados.length > 0) {
                response.render('diplomado/editar_diplomado', {
                    diplomado: diplomados[0],
                    csrfToken: request.csrfToken(),
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                    username: request.session.username || '',
                });
            }
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

exports.get_consultar_diplomado = (request, response, next) => {
    Diplomado.fetchAllActives()
        .then(([diplomadosActivos, fieldData]) => {
            // Formatear las fechas
            diplomadosActivos = diplomadosActivos.map(diplomado => {
                diplomado.fechaInicio = moment(diplomado.fechaInicio).format('LL');
                diplomado.fechaFin = moment(diplomado.fechaFin).format('LL');
                return diplomado;
            });

            Diplomado.fetchAllNoActives()
                .then(([diplomadosNoActivos, fieldData]) => {
                    // Formatear las fechas
                    diplomadosNoActivos = diplomadosNoActivos.map(diplomado => {
                        diplomado.fechaInicio = moment(diplomado.fechaInicio).format('LL');
                        diplomado.fechaFin = moment(diplomado.fechaFin).format('LL');
                        return diplomado;
                    });

                    response.render('diplomado/consultar_diplomado', {
                        diplomadosActivos: diplomadosActivos,
                        diplomadosNoActivos: diplomadosNoActivos,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        username: request.session.username || '',
                        csrfToken: request.csrfToken(),
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


exports.post_modificar_diplomado = (request, response, next) => {
    const id = request.body.IDDiplomado;
    const precio = request.body.precioDiplomado;
    const nombre = request.body.nombreDiplomado;
    const fechas = request.body.fecha.split("-");

    const fechaInicio_temp = fechas[0];
    const fechaFin_temp = fechas[1];
    const fechaInicio_utc = fechaInicio_temp.replace(/\s/g, '');
    const fechaFin_utc = fechaFin_temp.replace(/\s/g, '');

    const fechaInicio = moment(fechaInicio_utc, 'DD MM YYYY').add(6, 'hours').format('YYYY-MM-DD');
    const fechaFin = moment(fechaFin_utc, 'DD MM YYYY').add(23, 'hours').add(59, 'minutes').add(59, 'seconds').format('YYYY-MM-DD');

    Diplomado.update(id, fechaInicio,fechaFin, precio, nombre)
        .then(() => {
            return Diplomado.fetchOne(nombre)
        })
        .then(([diplomados, fieldData]) => {
            response.render('diplomado/resultado_diplomado', {
                modificar: true,
                registrar: false,
                diplomado: diplomados[0],
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                username: request.session.username || '',
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
}

exports.post_registrar_diplomado = (request, response, next) => {
    const precio = request.body.precioDiplomado;
    const nombre = request.body.nombreDiplomado;
    const fechas = request.body.fecha.split("-");

    const fechaInicio_temp = fechas[0];
    const fechaFin_temp = fechas[1];
    const fechaInicio_utc = fechaInicio_temp.replace(/\s/g, '');
    const fechaFin_utc = fechaFin_temp.replace(/\s/g, '');

    const fechaInicio = moment(fechaInicio_utc, 'DD MM YYYY').add(6, 'hours').format('YYYY-MM-DD');
    const fechaFin = moment(fechaFin_utc, 'DD MM YYYY').add(23, 'hours').add(59, 'minutes').add(59, 'seconds').format('YYYY-MM-DD');
    
    Diplomado.save(fechaInicio,fechaFin, precio, nombre)
        .then(() => {
            return Diplomado.fetchOne(nombre)
        })
        .then(([diplomados, fieldData]) => {
            response.render('diplomado/resultado_diplomado', {
                modificar: false,
                registrar: true,
                diplomado: diplomados[0],
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                username: request.session.username || '',
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
}

exports.post_detalles_diplomado = (request, response, next) => {
    const id = request.body.id;
    Diplomado.fetchDatos(id)
        .then(([diplomadoInfo, fieldData]) => {
            // Guardar las fechas originales para las comparaciones
            let fechaInicioOriginal = diplomadoInfo[0].fechaInicio;

            // Formatear las fechas para mostrarlas
            diplomadoInfo = diplomadoInfo.map(diplomado => {
                diplomado.fechaInicioFormateada = moment(diplomado.fechaInicio).format('LL');
                diplomado.fechaFinFormateada = moment(diplomado.fechaFin).format('LL');
                return diplomado;
            });

            Diplomado.fetchAlumnos(id)
                .then(([alumnosDiplomado, fieldData]) => {
                    response.render('diplomado/detalles_diplomado', {
                        diplomado: diplomadoInfo,
                        alumnosDiplomado: alumnosDiplomado,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        username: request.session.username || '',
                        csrfToken: request.csrfToken(),
                        fechaInicioOriginal: fechaInicioOriginal,
                    });
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
            console.log(error);
        });
};
