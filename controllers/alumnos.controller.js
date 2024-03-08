exports.get_inicio = (request, response, next) => {
    response.render('inicio');
};
exports.get_horario = (request, response, next) => {
    response.render('horario');
};
exports.get_realizar_pago = (request, response, next) => {
    response.render('realizar_pago');
};
exports.get_estado_de_cuenta = (request, response, next) => {
    response.render('estado_de_cuenta');
};
exports.get_test = (request, response, next) => {
    response.render('test');
};