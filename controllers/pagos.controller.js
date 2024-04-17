const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const pagoDiplomado = require('../models/pagadiplomado.model');
const Pago_Extra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');

const csvParser = require('csv-parser');
const fs = require('fs');

exports.get_pago = (request, response, next) => {
    response.render('pago/pago', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.get_registrar_pago_manual = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: true,
        solicitud_pago: false,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.get_autocomplete = (request, response, next) => {

    if (request.params && request.params.valor_busqueda) {
        let matricula = ' ';
        let nombre = ' ';
        // Con la regular expression sacas toda la matricula
        let matches_matricula = request.params.valor_busqueda.match(/(\d+)/);
        // Y con esta sacas el texto para manejar todo tipo de busqueda
        let matches_nombre = request.params.valor_busqueda.replace(/[0-9]/g, '');

        if (matches_matricula && matches_nombre != '') {
            matricula = matches_matricula[0];
            nombre = matches_nombre.trim();

            Alumno.fetch_both(matricula, nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        } else if (matches_matricula) {
            matricula = matches_matricula[0];

            Alumno.fetch(matricula)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos,
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        } else if (matches_nombre != '') {
            nombre = matches_nombre;

            Alumno.fetch(nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    }
};

exports.post_fetch_registrar_pago_manual = (request, response, next) => {
    // Del input del usuario sacas solo la matricula con el regular expression
    let matches = request.body.buscar.match(/(\d+)/);
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Pago_Extra.fetchAll()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/pago_manual_registro', {
                        alumno: alumno,
                        pagos_extra: pagos_extra,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_pago_manual_pago_extra = (request, response, next) => {
    // Declaracion de variables a usar del body
    const matricula = request.body.matricula;
    const fecha = request.body.fecha.split("/").reverse().join("-");
    const nota = request.body.nota;
    const metodo = request.body.metodo;
    const pago = request.body.pago;

    Liquida.fetchID_Pendientes(matricula)
        .then(async ([pendientes, fieldData]) => {
            // Si no hay una solicitud de pago se guarda dicho pago
            if (pendientes.length == 0) {
                Liquida.save_pago_manual(matricula, pago, fecha, metodo, nota)
                    .then(([rows, fieldData]) => {
                        response.redirect('/pagos/registrar_pago_manual')
                    })
                    .catch((error) => {
                        console.log(error);
                    })
            } else {
                let update = false;
                // Si ese alumno tiene una solicitud, entonces se itera sobre las solicitudes
                for (let idpago_extra of pendientes) {
                    // Se asegura que no se haya guardado el pago una vez
                    if (update == false) {
                        // Si el ID del pago extra es igual se  actualiza y se declara update para que no se guarde el pago dos veces
                        if (idpago_extra.IDPagosExtras == pago) {
                            // Agarro el IDLiquida para que solo se guarde una vez en SQL
                            const liquida = idpago_extra.IDLiquida;
                            update = true;
                            Liquida.update_pago_manual(matricula, pago, fecha, metodo, nota, liquida)
                                .then(([rows, fieldData]) => {
                                    response.redirect('/pagos/registrar_pago_manual');
                                })
                                .catch((error) => {
                                    console.log(error);
                                })
                        }
                    }
                }
                // Si ninguna solicitud es igual solo se guarda el pago con un nuevo registro
                if (update == false) {
                    Liquida.save_pago_manual(matricula, pago, fecha, metodo, nota)
                        .then(([rows, fieldData]) => {
                            response.redirect('/pagos/registrar_pago_manual');
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
};