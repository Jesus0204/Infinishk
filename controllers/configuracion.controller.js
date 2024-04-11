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
    response.render('configuracion/consultar_usuario', {
        fetch: true,
        modificar: false,
        resultado: false,
        error: null,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    })
}

exports.get_autocomplete_usuario = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
    Usuario.buscar(consulta) // Búsqueda de usuarios
    .then(results => {
        const usuarios = results[0].map(usuario => usuario.IDUsuario); // Obtener solo los IDs de usuario
        console.log('Usuarios encontrados:', usuarios); // Verifica los usuarios encontrados
        response.json(usuarios);
    }).catch((error) => {
        console.log(error);
        response.status(500).json({ error: 'Error al obtener sugerencias de usuario' });
    });
};



exports.get_check_usuario = (request, response, next) => {
    const id = request.query.id;
    Usuario.fetchOne(id)
        .then(([usuarios]) => {
            if (usuarios.length > 0) {
                response.json({ exists: true });
            } else {
                response.json({ exists: false });
            }
        })
        .catch((error) => {
            console.log(error);
        });
};


exports.post_buscar_usuario = (request, response, next) => {
    const username = request.body.username;
    Usuario.fetchOne(username)
        .then(([usuarios, fieldData]) => {
            if (usuarios.length > 0) {
                response.render('configuracion/consultar_usuario', {
                    fetch: false,
                    modificar: true,
                    resultado: false,
                    error: null,
                    usuario: usuarios[0],
                    csrfToken: request.csrfToken(),
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                });
            } else {
                response.render('configuracion/consultar_usuario', {
                    fetch: true,
                    modificar: true,
                    resultado: false,
                    error: 'Ese usuario no existe, por favor ingresa uno valido',
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

exports.post_modificar_usuario = (request, response, next) => {
    console.log('Llegue aqui')
    const id = request.body.IDUsuario;
    const status = request.body.statusUsuario === 'on' ? '1' : '0';
    console.log('El Id')
    console.log(id);
    console.log('El Status')
    console.log(status);
    Usuario.update(id,status)
        .then(() => {
            return Usuario.fetchOne(id)
        })
        .then(([usuarios, fieldData]) => {
            response.render('configuracion/consultar_usuario', {
                fetch: false,
                modificar: false,
                resultado: true,
                usuario: usuarios[0],
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        })
        .catch((error) => {
            console.log('Hubo erro')
            console.log(error)
        });
}


