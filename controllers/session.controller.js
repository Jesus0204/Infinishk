const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        username: request.session.username || '',
        registrar: false,
        error: error,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.post_login = (request, response, next) => {
    Usuario.fetchOne(request.body.IDUsuario)
        .then(([users, fieldData]) => {
            if (users.length == 1) {
                // users[0] contiene el objeto de la respuesta de la consulta
                const user = users[0];
                // Ya que verificamos que el usuario existe en la base de datos
                bcrypt.compare(request.body.password, user.Contraseña)
                    .then(doMatch => {
                        // Si la promesa es verdadero, entonces inicias sesion en la pagina
                        if (doMatch) {
                            // Si el usuario aun esta activo en el sistema
                            if (users[0].usuarioActivo == 1) {
                                Usuario.getPermisos(user.IDUsuario)
                                    .then(([permisos, fieldData]) => {
                                        Usuario.getRol(user.IDUsuario)
                                            .then(([rol, fieldData]) => {
                                                request.session.isLoggedIn = true;
                                                request.session.permisos = permisos;
                                                request.session.rol = rol[0].IDRol;
                                                request.session.username = user.IDUsuario;
                                                return request.session.save(err => {
                                                    response.redirect('/pagos');
                                                })
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            })
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    });
                            } else {
                                request.session.error = 'El usuario insertado ya no está activo en el sistema. Por favor busca ayuda si requieres iniciar sesión.';
                                response.redirect('/auth/login')
                            }
                            // Por si los passwords no hacen match
                        } else {
                            request.session.error = 'El usuario y/o contraseña son incorrectos.';
                            return response.redirect('/auth/login');
                        }
                        // Por si hay un error en la libreria o algo
                    }).catch(err => {
                        response.redirect('/auth/login');
                    });

                // Por si el usuario no existe en la base de datos
            } else {
                request.session.error = 'El usuario y/o contraseña con incorrectos.';
                response.redirect('/auth/login');
            }
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        })

};

exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/auth/login'); //Este código se ejecuta cuando la sesión se elimina.
    });
};

exports.get_signup = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        username: request.session.username || '',
        registrar: true,
        error: error,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.post_signup = (request, response, next) => {
    const new_user = new Usuario(request.body.IDUsuario, request.body.password);
    new_user.save()
        .then(([rows, fieldData]) => {
            response.redirect('/auth/login');
        })
        .catch((error) => {
            request.session.error = 'Nombre de usuario invalido.';
            console.log(error)
            response.redirect('/auth/signup');
        })
}