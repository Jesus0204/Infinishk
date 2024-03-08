exports.get_inicio = (request, response, next) => {
    response.render('inicio');
};
exports.get_horario = (request, response, next) => {
    response.render('horario');
};
exports.get_A3 = (request, response, next) => {
    response.render('A3');
};
exports.get_estado_de_cuenta = (request, response, next) => {
    response.render('estado_de_cuenta');
};
exports.get_test = (request, response, next) => {
    response.render('test');
};