const Diplomado = require('../models/diplomado.model');

exports.get_diplomado = (request,response,next) => {
    response.render('diplomado');
};

exports.get_modificar_diplomado = (request,response,next) => {
    response.render('editar_diplomado',{
        editar:false,
        fetch: true,
    });
};

exports.post_fetch_diplomado = (request,response,next) => {
    Diplomado.fetchOne(request.params.nombre)
    .then(([diplomados,fieldData]) => {
        response.render('editar_diplomado',{
            editar: true,
            fetch: false,
            diplomado: diplomados[0],
        });
    })
    .catch((error) => {
        console.log(error)
    });
};

exports.post_modificar_diplomado = (request,response,next) => {
    Diplomado.update(request.body.id,request.body,request.body.duracion,request.body.nombre)
    .then(([rows,fieldData]) => {
        response.redirect('/resultado_diplomado');
    })
    .catch((error) => {console.log(error)});
}