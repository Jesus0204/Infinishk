const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Pago_Extra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');
const Periodo = require('../models/periodo.model');
const Colegiatura = require('../models/colegiatura.model');

const csvParser = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
});

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_pago = (request,response,next) => {
    response.render('pago/pago', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.get_registrar_pago_extra = (request, response, next) => {
    response.render('pago/registrar_pago_extra', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_registrar_pago_extra = (request, response, next) => {
    const pago_extra = new Pago_Extra(request.body.motivo, request.body.monto);

    pago_extra.save()
        .then(([rows, fieldData]) => {
            Pago_Extra.fetchAll()
                .then(([pagosExtra, fieldData]) => {
                    // Conviertes las fechas a tu zona horaria con moment
                    for (let count = 0; count < pagosExtra.length; count++) {
                        pagosExtra[count].createdAt = moment(new Date(pagosExtra[count].createdAt)).tz('America/Mexico_City').format('LL');
                    };

                    Pago_Extra.fetchNoAsignados()
                        .then(([pagosExtraNoAsignados, fieldData]) => {
                             // Conviertes las fechas a tu zona horaria con moment
                             for (let count = 0; count < pagosExtraNoAsignados.length; count++) {
                                 pagosExtraNoAsignados[count].createdAt = moment(new Date(pagosExtraNoAsignados[count].createdAt)).tz('America/Mexico_City').format('LL');
                             };

                            response.render('pago/pagos_extra', {
                                pagosNoAsignados: pagosExtraNoAsignados,
                                pagos: pagosExtra,
                                registrar: true,
                                username: request.session.username || '',
                                permisos: request.session.permisos || [],
                                rol: request.session.rol || "",
                                csrfToken: request.csrfToken()
                            })
                        })
                        .catch((error) => {
                            response.status(500).render('500', {
                                username: request.session.username || '',
                                permisos: request.session.permisos || [],
                                rol: request.session.rol || "",
                            });
                            console.log(error)
                        })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error)
                })
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error);
        });
};

exports.get_pago_extra = (request, response, next) => {
    Pago_Extra.fetchAll()
        .then(([pagosExtra, fieldData]) => {
            // Conviertes las fechas a tu zona horaria con moment
            for (let count = 0; count < pagosExtra.length; count++) {
                pagosExtra[count].createdAt = moment(new Date(pagosExtra[count].createdAt)).tz('America/Mexico_City').format('LL');
            };

            Pago_Extra.fetchNoAsignados()
                .then(([pagosExtraNoAsignados, fieldData]) => {
                        // Conviertes las fechas a tu zona horaria con moment
                        for (let count = 0; count < pagosExtraNoAsignados.length; count++) {
                            pagosExtraNoAsignados[count].createdAt = moment(new Date(pagosExtraNoAsignados[count].createdAt)).tz('America/Mexico_City').format('LL');
                        };
                        
                    response.render('pago/pagos_extra', {
                        pagosNoAsignados: pagosExtraNoAsignados,
                        pagos: pagosExtra,
                        registrar: false,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error)
                })
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        })
};

exports.post_pago_extra_modify = (request, response, next) => {
    Pago_Extra.update(request.body.id, request.body.motivo, request.body.monto)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/pagos_extra');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        })
};

exports.post_modify_status = (request, response, next) => {
    Pago_Extra.update_estatus(request.body.id, request.body.estatus)
        .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.post_pago_extra_delete = (request, response, next) => {
    Pago_Extra.delete(request.body.id)
        .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.get_solicitudes = (request, response, next) => {
    Liquida.fetchNoPagados()
        .then(([rows, fieldData]) => {
            Pago_Extra.fetchActivos()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/solicitudes', {
                        solicitudes: rows,
                        pagos: pagos_extra,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error)
                });
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        });
};

exports.get_registrar_solicitud = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: true, 
        consultar_alumno: false,
        modificar_fichas: false,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_solicitudes_modify = (request, response, next) => {
    Liquida.update(request.body.id, request.body.pago)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/solicitudes');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        })
};

exports.post_solicitudes_delete = (request, response, next) => {
    Liquida.delete(request.body.id)
        .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error);
        })
};

exports.post_fetch_registrar_solicitud = (request, response, next) => {
    // Del input del usuario sacas solo la matricula con el regular expression
    let matches = request.body.buscar.match(/(\d+)/);
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Pago_Extra.fetchActivos()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/registrar_solicitud', {
                        alumno: alumno,
                        pagos_extra: pagos_extra, 
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error);
                });
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error)
        });
};

exports.post_registrar_solicitud = (request, response, next) => {
    const solicitud_pago = new Liquida(request.body.matricula, request.body.pago);

    solicitud_pago.save()
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/solicitudes');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error);
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

exports.get_pago_alumno = (request, response, next) => {

    // Del input del usuario sacas solo la matricula con el regular expression
    let username = request.session.username;
    Alumno.fetchOne(username)
        .then(([alumno, fieldData]) => {
             Liquida.fetch_Pendientes(username)
                .then(async ([solicitud_otro_pago, fieldData]) => {
                    const [periodoActivo, fieldData_2] = await Periodo.fetchActivo();
                    // Si es estudiante de colegiatura sacas la siguiente información
                    if (username[0] == '1') {
                        const [infoColegiatura, fieldData] = await Colegiatura.fetchColegiaturaActiva(username);
                        let info_Deuda = '';

                        // Si existe sacas la información de la deuda
                        if (infoColegiatura.length != 0) {
                            const [infoDeuda, fieldData_3] = await Deuda.fetchNoPagadas(infoColegiatura[0].IDColegiatura);

                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoDeuda.length; count++) {
                                infoDeuda[count].fechaLimitePago = moment(new Date(infoDeuda[count].fechaLimitePago)).tz('America/Mexico_City').format('LL');
                            }
                            info_Deuda = infoDeuda;
                        };
                        const [totalDeuda, fieldData_4] = await Deuda.fetchDeuda(username);

                        response.render('pago/realizar_pago', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            solicitudes: solicitud_otro_pago,
                            colegiatura: infoColegiatura,
                            deuda: info_Deuda,
                            totales: totalDeuda,
                            pago_col: true,
                            diplomado: '',
                            pagoDiplomado: '',
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken()
                        })
                        // Si no, es alumno de diplomado
                    } else if (username[0] == '8') {
                        // Sacas información del diplomado que estan cursando
                        const [infoDiplomado, fieldData] = await Cursa.fetchDiplomadosCursando(username);
                        let infoPagosDiplomado = '';
                        if (infoDiplomado.length != 0) {
                            // Sacas información de algún pago si es que existe
                            const [infoPagosDipl, fieldData_2] = await Cursa.fetchPagosHechos(username, infoDiplomado[0].IDDiplomado);
                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoPagosDipl.length; count++) {
                                infoPagosDipl[count].fechaPago = moment(new Date(infoPagosDipl[count].fechaPago)).tz('America/Mexico_City').format('LL');
                            }
                            infoPagosDiplomado = infoPagosDipl;
                        }
                        response.render('pago/realizar_pago', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            solicitudes: solicitud_otro_pago,
                            colegiatura: '',
                            deuda: '', 
                            totales: '',
                            pago_col: false,
                            diplomado: infoDiplomado,
                            pagoDiplomado: infoPagosDiplomado,
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken()
                        })
                    };
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                    });
                    console.log(error)
                });
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error);
        });
};

// Importar el archivo con las funciones de cifrado
const cipher = require('../util/cipher');
const axios = require('axios');

exports.post_mandar_pago = (request, response, next) => {
    let monto = Number(request.body.monto);
    monto = monto.toFixed(2);
    let matricula = request.body.matricula;

    // Usar el paquete para facilidad y poner true para que este indentado
    var XMLWriter = require('xml-writer');
    xml = new XMLWriter(true);
    // Empiezas el documento y el objeto padre
    xml.startDocument();
    xml.startElement('P');
        xml.startElement('business');
            xml.startElement('id_company');
                xml.text('SNBX');
            xml.endElement('id_company');
            xml.startElement('id_branch');
                xml.text('01SNBXBRNCH');
            xml.endElement('id_branch');
            xml.startElement('user');
                xml.text('SNBXUSR0123');
            xml.endElement('user');
            xml.startElement('pwd');
                xml.text('SECRETO');
            xml.endElement('pwd');
        xml.endElement('business');
        xml.startElement('nb_fpago');
            xml.text('COD');
        xml.endElement('nb_fpago');
        xml.startElement('url');
            xml.startElement('reference');
                xml.text(matricula + '_1');
            xml.endElement('reference');
            xml.startElement('amount');
                xml.text(monto);
            xml.endElement('amount');
            xml.startElement('moneda');
                xml.text('MXN');
            xml.endElement('moneda');
            xml.startElement('canal');
                xml.text('W');
            xml.endElement('canal');
            xml.startElement('omitir_notif_default');
                xml.text('1');
            xml.endElement('omitir_notif_default');
            xml.startElement('version');
                xml.text('IntegraWPP');
            xml.endElement('version');
        xml.endElement('url');
    xml.endElement('P');
    xml.endDocument();

    // Pones todo el xml en un string
    let originalString = xml.toString();

    console.log(originalString);
    let key = '5DCC67393750523CD165F17E1EFADD21';

    // Lo cifras con las funciones del github de documentación
    let cipherText = cipher.cifrarAES(originalString, key);

    // Creas otro xml para hacer el post con el texto cifrado
    let originalString_post = "xml=<pgs><data0>SNDBX123</data0><data>" + cipherText + "</data></pgs>";
    let data_xml = encodeURIComponent(originalString_post);

    // Haces el post del xml generado
    axios.post('https://sandboxpo.mit.com.mx/gen', data_xml, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    }).then(function (xml_response) {
        // Esperas la respuesta cifrada
        let responseText = xml_response.data;
        let decipherText = cipher.decifrarAES(responseText, key);

        return response.status(200).json({
            success: true,
            respuestaXML: decipherText
        });
    }).catch((error) => {
        console.log(error);
    })
};

exports.post_recibir_pago = (request,response,next) => {
    const strResponse = decodeURIComponent("OeJy0IiOYyuFLHRvSCAnFS%2FgG%2BJpP5GAyHkNFajKAE1mw6X%2BxfHlqfodeqgFvWZThVb8X5NsKohI0eYXEZMlX4tWsGBetblm%2F6whaGn1jByMle%2FQTjENL7cUJOOwvOYxv7obfi6XO713A%2BUOhO7qjLfeK6qaaB4h%2FJJXUfA8WE6RsFXOthuMdKsgc%2FYsKXtfpyOR1TmaE4JFLxOdch3%2Fkpdy8DDtBPVYHWkI0KO9CSjUezZPQM6DRQ%2BX5ZBeuI%2F7F1hL6m8r2ba3w%2BItBkZZs6PNUacD6gn0rX0rguyrqSNTQex96DfYRwRg774zZfDDX%2Fa02IX9NMO3Epaz8B%2FEFqCkma%2BQXPK4SHySQ5YWT7GUVxxvbLYEs85TQZeOBq1Fgku6%2FCJ9NSDjjY4ItxQoAQJyKPWRRZDaTVTKc%2FvUkX8QCSfDg5MkSBkO%2FRTjhgQHy62BqS26qcD%2FQyYBFMxSq%2FwCwyAJiCcsiCj%2FkEoh1JVc%2FG0b9Z9fAVGGQn4QA0jFQViekHB3V5r9vfkPADcz1yccPJdpI4UUboH2ynfyNv9%2FG9Dig9mg73hduG0FZld9zUR0xwNRSCzwOBG2BDF9RCm0jPNIwKLNaE4NfYKb8Z3MyLEPTI6QVNRfEgsQ5FlYAkyx1VNfEFk0F7TrIDk%2BGSA37rtIak1Xpq4G2%2B7gq5cycjdwiMYu4nXOBXHXXgapi152wpEF39J8jC7vnuBDBdvnu0VrFtcoozw%2BOuLrHVK%2Bg2N5pYzTZ77R8aOqbTI41qt2iJ6bxdHbOArUD4GmRTInQ9QR71fxHBtDpaUQ2kjEpVm7Y9wEjbK7RUiipkUDCOclueve2MeuB%2FdCuIcLUjQNIFW7aXSPRddX1TugHux8FYG6kQmP7F0M86IarDyWbxNll15F5OxwQPwztBzgb4tCYjThw8K8fMo74pqcFLcoAqhh4%2FTqXA8Tr0aJczEQ8P2jvbS296%2FVFERB0zXyHsCfn9aUUzpqQ6f2vpw8DKpfyJ%2Fsxn48GyRMDf9mp5za%2Far99pUwBowPGxVqHB3ssY0fDViICDP5l%2FBm02r0h2XVk7BJ6Zp1DMGhhqpsYRBfZHZjsErzZjy%2F1qmzbihsJxsE7jOApGPA5IZwKcQ6OcmAtubfNqd706Y%2BzL9vp1Pz")
    let key = '5DCC67393750523CD165F17E1EFADD21';
    const responseText = cipher.decifrarAES(strResponse, key);

    console.log(responseText);

    return response.status(200).json({ responseText });
}