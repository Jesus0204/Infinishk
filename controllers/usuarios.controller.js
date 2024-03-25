exports.get_usuarios = (request, response, next) => {
    response.render('usuarios/usuarios');
};

const Deuda = require('../models/Deuda.model');

exports.get_alumnos_atrasados = (request, response, next) => {

    Deuda.fetchNoPagados()
    .then(([alumnos_atrasados, fieldData]) => {
        response.render('usuarios/alumnos_atrasados', {alumnos: alumnos_atrasados});
    })
    .catch((error) => {
        console.log(error);
    });

};