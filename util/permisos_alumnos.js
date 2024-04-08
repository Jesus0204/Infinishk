module.exports = (request, response, next) => {
    let can_propuesta_horario = false;
    for (let permiso of request.session.permisos) {
        if (permiso.funcion == 'Consultar Propuesta de Horario') {
            can_propuesta_horario = true;
        }
    }
    if (can_propuesta_horario) {
        next();

    } else {
        return response.redirect('/auth/logout');
    }
}