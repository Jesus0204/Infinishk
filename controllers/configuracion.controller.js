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
            response.render('configuracion/resultado_plan', {
                modificar: true,
                registrar: false,
                PlanPago: planespago[0],
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        })
        .catch((error) => {
            console.log(error)
        });
}

exports.get_resultado_plan = (request,response,next) => {
    response.render('configuracion/resultado_plan');
};