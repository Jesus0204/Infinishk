const Diplomado = require('../models/diplomado.model');

exports.get_diplomado = (request, response, next) => {
    response.render('diplomado/diplomado');
};

exports.get_modificar_diplomado = (request, response, next) => {
    response.render('diplomado/editar_diplomado', {
        editar: false,
        fetch: true,
        error: null,
    });
};

exports.get_registrar_diplomado = (request, response, next) => {
    response.render('diplomado/registrar_diplomado', {
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.get_autocomplete = (request, response, next) => {
    const consulta = request.query.q;
    Diplomado.buscar(consulta)
        .then(([diplomados]) => {
            response.json(diplomados);
        })
        .catch((error) => {
            console.log(error);
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
                    editar: true,
                    fetch: false,
                    diplomado: diplomados[0],
                    csrfToken: request.csrfToken(),
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                });
            } else {
                response.render('diplomado/editar_diplomado', {
                    editar: false,
                    fetch: true,
                    error: 'Ese diplomado no existe, por favor ingresa uno valido',
                    csrfToken: request.csrfToken(),
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                });
            }
        })
        .catch((error) => {
            console.log(error)
        });
};


exports.post_modificar_diplomado = (request, response, next) => {
    const id = request.body.IDDiplomado;
    const precio = request.body.precioDiplomado;
    const duracion = request.body.Duracion;
    const nombre = request.body.nombreDiplomado;
    console.log(id);
    console.log(precio);
    console.log(duracion);
    console.log(nombre);
    Diplomado.update(id, duracion, precio, nombre)
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
            });
        })
        .catch((error) => {
            console.log(error)
        });
}

exports.post_registrar_diplomado = (request, response, next) => {
    const precio = request.body.precioDiplomado;
    const duracion = request.body.Duracion;
    const nombre = request.body.nombreDiplomado;
    console.log(precio);
    console.log(duracion);
    console.log(nombre);
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
            });
        })
        .catch((error) => {
            console.log(error)
        });
}