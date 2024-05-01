const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const jwt = require('jsonwebtoken');

const config = require('../config');

// Usar la clave secreta en tu código
const secretKey = config.jwtSecret;


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
                error_alumno: false
            });
            console.log(error)
        })

};

exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/auth/login'); //Este código se ejecuta cuando la sesión se elimina.
    });
};

exports.get_set_password = (request,response,next) =>{
    const token = request.query.token;
    const matricula = request.query.matricula; // Obtiene la matrícula de la URL
    response.render('set_password', { 
        token,
        matricula,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    }); // Renderiza la página para establecer la contraseña con la matrícula
}

exports.post_set_password = async (request, response, next) => {
    const token = request.body.token;
    const newPassword = request.body.newPassword;

    // Verificar el token JWT
    jwt.verify(token, config.jwtSecret, async (err, decoded) => {
        if (err) {
            console.error('Error al verificar el token JWT:', err);
            response.redirect('/auth/login'); // Redirigir a la página de inicio de sesión en caso de error
        } else {
            // Token válido, proceder con la actualización de la contraseña
            try {
                const matricula = decoded.matricula; // Obtener la matrícula del token decodificado
                const new_user = new Usuario(matricula, newPassword);
                await new_user.updateContra();
                response.redirect('/auth/login'); // Redirigir al inicio de sesión después de actualizar la contraseña
            } catch (error) {
                console.error('Error al actualizar la contraseña:', error);
                response.redirect('/auth/login'); // Redirigir a la página de configuración de contraseña en caso de error
            }
        }
    });
}

exports.get_reset_password = (request,response,next) => {
    response.render('reset_password', { 
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
}

exports.post_reset_password = async (request, response, next) => {
    const matricula = request.body.username;
    const correoElectronico = await Usuario.fetchCorreo(matricula);
    const correo = correoElectronico[0][0].correoElectronico;

    if (correoElectronico && correoElectronico[0] && correoElectronico[0][0] && typeof correoElectronico[0][0].correoElectronico !== 'undefined') {
        const user = request.body.username;

        // Generar token JWT con la matrícula del usuario
        const token = jwt.sign({ matricula: user }, secretKey, { expiresIn: '1h' });
        
        // Enlace con el token incluido
        const setPasswordLink = `https://ivd-pagos-infinishk-f243bfbb50c7.herokuapp.com/auth/set_password?token=${token}`;

        const msg = {
            to: correo,
            from: {
                name: 'VIA PAGO',
                email: '27miguelb11@gmail.com',
            },
            subject: 'Reestablecer contraseña de VIA Pago',
            html: `<p>Hola!</p><p>Por favor usa este link para restablecer tu contraseña. Toma en cuenta que la liga solo tiene validez de una hora: <a href="${setPasswordLink}">Reestablecer Contraseña</a></p>`
        };

        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado correctamente');
            response.redirect('/auth/login');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
            response.redirect('/auth/login');
        }
    } else {
        response.redirect('/auth/login');
    }
}
