const { request, response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        IDUsuario: request.session.username || '',
        error: error,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
    });
};

exports.post_login = (request, response, next) => {
    Usuario.fetchOne(request.body.IDUsuario)
        .then(([users, fieldData]) => {
            if (users.length == 1) {
                // users[0] contiene el objeto de la respuesta de la consulta
                const user = users[0];
                // Ya que verificamos que el usuario existe en la base de datos
                bcrypt.compare(request.body.password, user.password)
                    .then(doMatch => {
                        // Si la promesa es verdadero, entonces inicias sesion en la pagina
                        if (doMatch) {
                            Usuario.getPermisos(user.username)
                                .then(([permisos, fieldData]) => {
                                    request.session.isLoggedIn = true;
                                    request.session.permisos = permisos;
                                    console.log(request.session.permisos);
                                    request.session.username = user.username;
                                    return request.session.save(err => {
                                        response.redirect('/');
                                    })
                                })
                                .catch((error) => {
                                    console.log(error)
                                });
                            // Por si los passwords no hacen match
                        } else {
                            request.session.error = 'El usuario y/o contraseña con incorrectos.';
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
            console.log(error)
        })
    
};