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

exports.get_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then((precio_actual) => {
            PrecioCredito.fetchAnios()
                .then(([anios, fieldData]) => {
                    response.render('configuracion/precio_credito', {
                        precio_actual: precio_actual[0],
                        anios: anios,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                })
            })
            .catch((error) => {
                console.log(error);
            });
    })
    .catch((error) => {
        console.log(error)
    });
};

exports.post_precio_credito = (request, response, next) => {
    const anioSelect = request.body.anio;
    PrecioCredito.fetchPrecioAnio(anioSelect)
    .then(([precio_anio, fieldData]) => {
        response.status(200).json({
            success: true,
            precio_anio: precio_anio
        });
    })
    .catch((error) => {
        console.log(error);
        response.status(500).json({success: false, error: 'Error cargando precioCredito'});
    });
};

exports.get_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then((precio_actual) => {
            response.render('configuracion/registrar_precio_credito', {
                precio_actual: precio_actual[0], 
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()});
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.update(request.body.monto)
        .then(([precio_credito, fieldData]) => {
            response.redirect('/configuracion/precio_credito');
        })
        .catch((error) => {
            console.log(error);
        });
};