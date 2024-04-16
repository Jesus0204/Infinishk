const PlanPago = require('../models/planpago.model');
const Usuario = require('../models/usuario.model')

exports.get_configuracion = (request, response, next) => {
    response.render('configuracion/configuracion');
};

exports.get_administrar_planpago = (request, response, next) => {
    PlanPago.fetchAll()
        .then(([planpagos]) => {
            response.render('configuracion/administrar_planpago', {
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_consultar_usuario = (request, response, next) => {
    Usuario.fetchActivos()
        .then(([usuariosActivos, fieldData]) => {
            Usuario.fetchNoActivos()
                .then(([usuariosNoActivos, fieldData]) => {
                    response.render('configuracion/consultar_usuario', {
                        usuariosNoActivos: usuariosNoActivos,
                        usuariosActivos: usuariosActivos,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error)
        });
}


exports.get_search_activo = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
    Usuario.buscar(consulta) // Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_search_noactivo = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
    Usuario.buscarNoActivos(consulta)// Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_modificar_usuario = (request, response, next) => {
    const id = request.body.IDUsuario;
    const status = request.body.statusUsuario === 'on' ? '1' : '0';

    Usuario.update(id, status)
        .then(() => {
            // Redirigir al usuario de vuelta a la misma página
            response.redirect('/configuracion/consultar_usuario');
        })
        .catch((error) => {
            console.log('Hubo error');
            console.log(error);
            // Manejar el error de alguna forma
            response.redirect('/configuracion/consultar_usuario');
        });
}


