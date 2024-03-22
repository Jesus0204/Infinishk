const Diplomado = require('../models/diplomado.model');

exports.get_diplomado = (request,response,next) => {
    response.render('diplomado/diplomado');
};

exports.get_modificar_diplomado = (request,response,next) => {
    response.render('diplomado/editar_diplomado',{
        editar:false,
        fetch: true,
        error: null,
    });
};

exports.get_autocomplete = (request, response, next) => {
    const consulta = request.query.q;
    Diplomado.buscar(consulta)
        .then(([diplomados]) => {
            response.json(diplomados);
        })
        .catch((error) => {
            console.log(error);
        });
};


exports.post_fetch_diplomado = (request,response,next) => {
    const nombre = request.body.nombre;
    Diplomado.fetchOne(nombre)
    .then(([diplomados,fieldData]) => {
        if (diplomados.length > 0) {
            response.render('diplomado/editar_diplomado',{
                editar: true,
                fetch: false,
                diplomado: diplomados[0],
            });
        } else {
            response.render('diplomado/editar_diplomado',{
                editar: false,
                fetch: true,
                error: 'Ese diplomado no existe, por favor ingresa uno valido',
            });
        }
    })
    .catch((error) => {
        console.log(error)
    });
};


exports.post_modificar_diplomado = (request,response,next) => {
    const id = request.body.IDDiplomado;
    const precio = request.body.precioDiplomado;
    const duracion = request.body.Duracion;
    const nombre = request.body.nombreDiplomado;
    console.log(id);
    console.log(precio);
    console.log(duracion);
    console.log(nombre);
    Diplomado.update(id,duracion,precio,nombre)
    .then(() => {
        return Diplomado.fetchOne(nombre)
    })
    .then(([diplomados,fieldData]) => {
        response.render('diplomado/resultado_diplomado',{
            diplomado:diplomados[0],
        });
    })
    .catch((error) => {
        console.log(error)});
}