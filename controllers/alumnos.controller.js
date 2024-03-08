exports.get_A1 = (request, response, next) => {
    response.render('inicioalumno');
};
exports.get_A2 = (request, response, next) => {
    response.render('horario');
};
exports.get_A3 = (request, response, next) => {
    response.render('realizar_pago');
};
exports.get_A4 = (request, response, next) => {
    response.render('estado_de_cuenta');
};
exports.get_test = (request, response, next) => {
    response.render('test');
};