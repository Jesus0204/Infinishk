const Diplomado = require('../models/diplomado.model');

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
            });
            console.log(error)
        });
};

exports.get_consultar_diplomado = (request, response, next) => {
    Diplomado.fetchAllActives()
        .then(([diplomadosActivos, fieldData]) => {
            Diplomado.fetchAllNoActives()
                .then(([diplomadosNoActivos, fieldData]) => {
                    Diplomado.fetchAllInProgress()
                    .then(([diplomadosProgreso, fieldData]) =>{
                        response.render('diplomado/consultar_diplomado', {
                            diplomadosProgreso: diplomadosProgreso,
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
                        });
                        console.log(error)
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

exports.post_modificar_diplomado = (request, response, next) => {
    const id = request.body.IDDiplomado;
    const precio = request.body.precioDiplomado;
    const duracion = request.body.Duracion;
    const nombre = request.body.nombreDiplomado;
    const status = request.body.statusDiplomado === 'on' ? '1' : '0';
    Diplomado.update(id, duracion, precio, nombre, status)
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
            });
            console.log(error)
        });
}

exports.post_registrar_diplomado = (request, response, next) => {
    const precio = request.body.precioDiplomado;
    const duracion = request.body.Duracion;
    const nombre = request.body.nombreDiplomado;
    Diplomado.save(duracion, precio, nombre)
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
            });
            console.log(error)
        });
}