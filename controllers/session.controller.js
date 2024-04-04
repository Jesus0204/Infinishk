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

};