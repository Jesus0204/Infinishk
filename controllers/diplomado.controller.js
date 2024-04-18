const Diplomado = require('../models/diplomado.model');

exports.get_diplomado = (request, response, next) => {
    response.render('diplomado/diplomado', {
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.get_opcion_diplomado = (request, response, next) => {
    response.render('diplomado/editar_diplomado', {
        editar: false,
        fetch: true,
        error: null,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.get_modificar_diplomado = (request, response, next) => {
    response.render('diplomado/editar_diplomado', {
        editar: false,
        fetch: true,
        error: null,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.get_registrar_diplomado = (request, response, next) => {
    response.render('diplomado/registrar_diplomado', {
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};


exports.get_autocomplete = (request, response, next) => {
    const consulta = request.query.q;

    // Realiza las tres búsquedas simultáneamente
    Promise.all([
        Diplomado.buscar(consulta), // Búsqueda de diplomados activos
        Diplomado.buscar_noactivo(consulta), // Búsqueda de diplomados no activos
        Diplomado.buscar_en_curso(consulta) // Búsqueda de diplomados en curso
    ]).then(results => {
        // Combina los resultados de las tres búsquedas
        const combinedResults = [...results[0][0], ...results[1][0], ...results[2][0]];

        // Filtra resultados duplicados solo si aparecen en dos o más consultas
        const uniqueDiplomados = [];
        const diplomadosMostrados = new Set();

        combinedResults.forEach(diplomado => {
            if (!diplomadosMostrados.has(diplomado.id)) {
                uniqueDiplomados.push(diplomado);
                diplomadosMostrados.add(diplomado.id);
            }
        });

        // Filtra resultados que contengan la parte específica de texto en el nombre
        const filteredDiplomados = uniqueDiplomados.filter(diplomado =>
            diplomado.nombre.toLowerCase().includes(consulta.toLowerCase())
        );

        // Convierte el array filtrado a un conjunto para eliminar duplicados
        const uniqueFilteredDiplomados = new Set(filteredDiplomados);

        // Convierte el conjunto a un array antes de enviar la respuesta JSON
        const uniqueFilteredDiplomadosArray = [...uniqueFilteredDiplomados];
        response.json(uniqueFilteredDiplomadosArray);
    }).catch((error) => {
        console.log(error);
    });
};







exports.get_check_diplomado = (request, response, next) => {
    const nombre = request.query.nombre;
    Diplomado.fetchOne(nombre)
        .then(([diplomados]) => {
            if (diplomados.length > 0) {
                response.json({ exists: true });
            } else {
                response.json({ exists: false });
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_fetch_diplomado = (request, response, next) => {
    const nombre = request.body.nombre;
    Diplomado.fetchOne(nombre)
        .then(([diplomados, fieldData]) => {
            if (diplomados.length > 0) {
                response.render('diplomado/editar_diplomado', {
                    editar: true,
                    fetch: false,
                    diplomado: diplomados[0],
                    csrfToken: request.csrfToken(),
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                });
            } else {
                response.render('diplomado/editar_diplomado', {
                    editar: false,
                    fetch: true,
                    error: 'Ese diplomado no existe, por favor ingresa uno valido',
                    csrfToken: request.csrfToken(),
                    permisos: request.session.permisos || [],
                    rol: request.session.rol || "",
                });
            }
        })
        .catch((error) => {
            console.log(error)
        });
};

exports.get_consultar_diplomado = (request, response, next) => {
    Diplomado.fetchAllActives()
        .then(([diplomadosActivos, fieldData]) => {
            Diplomado.fetchAllNoActives()
                .then(([diplomadosNoActivos, fieldData]) => {
                    Diplomado.fetchAllInProgress()
                    .then(([diplomadosProgreso, fieldData]) =>{
                        response.render('diplomado/consultar_diplomado', {
                            diplomadosProgreso: diplomadosProgreso,
                            diplomadosActivos: diplomadosActivos,
                            diplomadosNoActivos: diplomadosNoActivos,
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken(),
                        });
                    })
                    .catch((error) => {
                        console.log(error)
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error)
        });
};

exports.post_modificar_diplomado = (request, response, next) => {
    const id = request.body.IDDiplomado;
    const precio = request.body.precioDiplomado;
    const duracion = request.body.Duracion;
    const nombre = request.body.nombreDiplomado;
    const status = request.body.statusDiplomado === 'on' ? '1' : '0';
    Diplomado.update(id, duracion, precio, nombre, status)
        .then(() => {
            return Diplomado.fetchOne(nombre)
        })
        .then(([diplomados, fieldData]) => {
            response.render('diplomado/resultado_diplomado', {
                modificar: true,
                registrar: false,
                diplomado: diplomados[0],
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        })
        .catch((error) => {
            console.log(error)
        });
}

exports.post_registrar_diplomado = (request, response, next) => {
    const precio = request.body.precioDiplomado;
    const duracion = request.body.Duracion;
    const nombre = request.body.nombreDiplomado;
    console.log(precio);
    console.log(duracion);
    console.log(nombre);
    Diplomado.save(duracion, precio, nombre)
        .then(() => {
            return Diplomado.fetchOne(nombre)
        })
        .then(([diplomados, fieldData]) => {
            response.render('diplomado/resultado_diplomado', {
                modificar: false,
                registrar: true,
                diplomado: diplomados[0],
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        })
        .catch((error) => {
            console.log(error)
        });
}