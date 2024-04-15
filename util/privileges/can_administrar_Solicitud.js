module.exports = (request, response, next) => {
    let can_AdministrarSolicitud = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Administrar Solicitud de Pago') {
            can_AdministrarSolicitud = true;
        }
    }
    if (can_AdministrarSolicitud) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}