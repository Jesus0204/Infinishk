const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        username: request.session.username || '',
        error: error,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
    });
};