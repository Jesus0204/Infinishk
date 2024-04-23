module.exports = (request, response, next) => {
    let can_exportar_Datos = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Exportar Datos a Excel') {
            can_exportar_Datos = true;
        }
    }
    if (can_exportar_Datos) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}