const PlanPago = require('../models/planpago.model');

exports.get_configuracion = (request,response,next) => {
    response.render('configuracion/configuracion');
};

exports.get_administrar_planpago = (request, response, next) => {
    console.log(request.session.rol);
    PlanPago.fetchAll()
        .then(([planpagos]) => {
           response.render('configuracion/administrar_planpago',{
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
           });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_modificar_planpago = (request, response, next) => {
    console.log(request.session.rol);
    PlanPago.fetchAll()
        .then(([planpagos]) => {
           response.render('configuracion/modificar_planpago',{
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
           });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_modificar_planpago = (request, response, next) => {
    const nombre = request.body.nombrePlan;
    const activo = request.body.planPagoActivo;
    const IDPlanPago = request.body.IDPlanPago;
    console.log(nombre);
    console.log(activo);
    console.log(IDPlanPago);
    PlanPago.update(nombre, activo, IDPlanPago)
        .then(([planespago, fieldData]) => {
            // Aquí puedes enviar una respuesta JSON indicando éxito
            response.json({ success: true });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ success: false, error: 'Error al modificar el plan de pago' });
        });
}

exports.get_registrar_planpago = (request, response, next) => {
    console.log(request.session.rol);
    PlanPago.fetchAll()
        .then(([planpagos]) => {
           response.render('configuracion/registrar_planpago',{
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
           });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_planpago = (request, response, next) => {
    const nombre = request.body.nombrePlan;
    const numero = request.body.numeroPagos;
    const activo = request.body.planPagoActivo;
    const IDPlanPago = request.body.IDPlanPago;
    console.log(nombre);
    console.log(numero);
    console.log(activo);
    console.log(IDPlanPago);

    PlanPago.save()
        .then(([planespago, fieldData]) => {
            // Aquí puedes enviar una respuesta JSON indicando éxito
            response.json({ success: true });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({ success: false, error: 'Error al modificar el plan de pago' });
        });
}