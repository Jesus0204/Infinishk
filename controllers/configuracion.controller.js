const PlanPago = require('../models/planpago.model');
const PrecioCredito = require('../models/precio_credito.model');

exports.get_configuracion = (request,response,next) => {
    response.render('configuracion/configuracion');
};

exports.get_administrar_planpago = (request, response, next) => {
    PlanPago.fetchAll()
        .then(([planpagos]) => {
           response.render('configuracion/administrar_planpago',{
                planpago: planpagos,
           });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get__registrar_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then(([precio_actual]) => {
            response.render('configuracion/registrar_precio_credito', 
            {precio_actual});
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_precio_credito = (request, response, next) => {
    const nuevo_precio = new PrecioCredito(request.body.monto);

    nuevo_precio.save()
        .then(([rows, fieldData]) => {
            response.redirect('/configuracion/precio_credito');
        })
        .catch((error) => {
            console.log(error);
        });
};