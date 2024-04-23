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

exports.get_pago = (request, response, next) => {
    response.render('pago/pago', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
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

exports.post_fetch_registrar_pago_manual = (request, response, next) => {
    // Del input del usuario sacas solo la matricula con el regular expression
    let matches = request.body.buscar.match(/(\d+)/);
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Pago_Extra.fetchActivos()
                .then(async ([pagos_extra, fieldData]) => {
                    const [solicitudes_pendientes, fieldData_2] = await Liquida.fetch_Pendientes(matches[0]);
                    const [periodoActivo, fieldData_3] = await Periodo.fetchActivo();
                    // Si es estudiante de colegiatura sacas la siguiente información
                    if (matches[0][0] == '1') {
                        const [infoColegiatura, fieldData] = await Colegiatura.fetchColegiaturaActiva(matches[0]);
                        let info_Deuda = '';

                        // Si existe sacas la información de la deuda
                        if (infoColegiatura.length != 0) {
                            const [infoDeuda, fieldData_2] = await Deuda.fetchNoPagadas(infoColegiatura[0].IDColegiatura);

                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoDeuda.length; count++) {
                                infoDeuda[count].fechaLimitePago = moment(new Date(infoDeuda[count].fechaLimitePago)).tz('America/Mexico_City').format('LL');
                            }
                            info_Deuda = infoDeuda;
                        };

                        response.render('pago/pago_manual_registro', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            pagos_extra: pagos_extra,
                            colegiatura: infoColegiatura,
                            deuda: info_Deuda,
                            pago_col: true,
                            diplomado: '',
                            pagoDiplomado: '',
                            solicitudes: solicitudes_pendientes,
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken()
                        })
                        // Si no, es alumno de diplomado
                    } else if (matches[0][0] == '8') {
                        // Sacas información del diplomado que estan cursando
                        const [infoDiplomado, fieldData] = await Cursa.fetchDiplomadosCursando(matches[0]);
                        let infoPagosDiplomado = '';
                        if (infoDiplomado.length != 0) {
                            // Sacas información de algún pago si es que existe
                            const [infoPagosDipl, fieldData_2] = await Cursa.fetchPagosHechos(matches[0], infoDiplomado[0].IDDiplomado);
                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoPagosDipl.length; count++) {
                                infoPagosDipl[count].fechaPago = moment(new Date(infoPagosDipl[count].fechaPago)).tz('America/Mexico_City').format('LL');
                            }
                            infoPagosDiplomado = infoPagosDipl;
                        }
                        response.render('pago/pago_manual_registro', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            pagos_extra: pagos_extra,
                            colegiatura: '',
                            deuda: '',
                            pago_col: false,
                            diplomado: infoDiplomado,
                            pagoDiplomado: infoPagosDiplomado,
                            solicitudes: solicitudes_pendientes,
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

exports.post_registrar_pago_manual_pago_extra = (request, response, next) => {
    // Declaracion de variables a usar del body
    const matricula = request.body.matricula;
    const fecha_body = request.body.fecha.split("/").reverse().join("-");
    const fecha = fecha_body + ' 08:00:00';
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
                        response.status(500).render('500', {
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                        });
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
                                    response.status(500).render('500', {
                                        username: request.session.username || '',
                                        permisos: request.session.permisos || [],
                                        rol: request.session.rol || "",
                                    });
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
                            response.status(500).render('500', {
                                username: request.session.username || '',
                                permisos: request.session.permisos || [],
                                rol: request.session.rol || "",
                            });
                            console.log(error);
                        })
                }
            }
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

exports.post_registrar_pago_manual_diplomado = (request, response, next) => {
    // Declaracion de variables a usar del body
    const matricula = request.body.matricula;
    const monto = request.body.monto;
    const motivo = request.body.motivo;
    let fecha_body = request.body.fecha.split("/").reverse().join("-");
    const fecha = fecha_body + ' 08:00:00';
    const nota = request.body.nota;
    const metodo = request.body.metodo;
    const IDDiplomado = request.body.IDDiplomado;

    PagoDiplomado.save_pago_manual(matricula, IDDiplomado, fecha, monto, motivo, nota, metodo)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/registrar_pago_manual');
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

exports.post_registrar_pago_manual_colegiatura = (request, response, next) => {
    // Declaracion de variables a usar del body
    const monto = request.body.monto;
    const motivo = request.body.motivo;
    let fecha_body = request.body.fecha.split("/").reverse().join("-");
    const fecha = fecha_body + ' 08:00:00';
    const nota = request.body.nota;
    const metodo = request.body.metodo;
    const matricula = request.body.matricula;

    Deuda.fetchNoPagadas(request.body.IDColegiatura)
        .then(async ([deudas_noPagadas, fieldData]) => {
            // Guardas el pago completo del alumno
            await Pago.save_pago_manual(deudas_noPagadas[0].IDDeuda, motivo, monto, nota, metodo, fecha)

            // El monto inicial a usar es lo que el usuario decidió
            let monto_a_usar = request.body.monto;
            for (let deuda of deudas_noPagadas) {
                if (monto_a_usar <= 0) {
                    break;
                } else if ((deuda.montoAPagar - deuda.montoPagado) < monto_a_usar) {
                    // Como el monto a usar el mayor que la deuda, subes lo que deben a esa deuda
                    await Deuda.update_Deuda((deuda.montoAPagar - deuda.montoPagado), deuda.IDDeuda);
                    await Colegiatura.update_Colegiatura((deuda.montoAPagar - deuda.montoPagado), request.body.IDColegiatura);
                } else if ((deuda.montoAPagar - deuda.montoPagado) >= monto_a_usar) {
                    // Como el monto a usar es menor, se usa monto a usar (lo que resto)
                    await Deuda.update_Deuda(monto_a_usar, deuda.IDDeuda);
                    await Colegiatura.update_Colegiatura(monto_a_usar, request.body.IDColegiatura);
                }

                // Le restas al monto_a_usar lo que acabas de pagar para que la deuda se vaya restando
                monto_a_usar = monto_a_usar - deuda.montoAPagar;
            }

            // Si el monto a usar es positivo despues de recorrer las deudas, agregar ese monto a credito
            if (monto_a_usar > 0) {
                await Alumno.update_credito(matricula, monto_a_usar);
            }
            response.redirect('/pagos/registrar_pago_manual');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error);
        })
};

exports.get_registro_transferencias = (request, response, next) => {
    response.render('pago/registro_transferencia', {
        subir: true,
        revisar: false,
        resultado: false,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.post_subir_archivo = (request, response, next) => {
    const filas = [];
    fs.createReadStream(request.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            const {
                Fecha,
                Hora,
                Importe,
                Concepto
            } = data;
            const Referencia = Concepto.substring(0, 7);
            const Matricula = Concepto.substring(0, 6);
            const inicioRef = Concepto.substring(0, 1);
            const dia = Fecha.substring(1, 3);
            const mes = Fecha.substring(3, 5);
            const anio = Fecha.substring(5, 9);
            fechaFormato = anio + '-' + mes + '-' + dia + ' ' + Hora;
            filas.push({
                fechaFormato,
                Hora,
                Importe,
                Referencia,
                Matricula,
                inicioRef
            });
        })
        .on('end', async () => {
            const resultados = [];
            for (const fila of filas) {
                let nombre = ''
                let apellidos = ''
                let deudaEstudiante = 0;
                let tipoPago = '';

                if (fila.inicioRef === '1' || fila.inicioRef === "8") {
                    const nombreCompleto = await Alumno.fetchNombre(fila.Matricula);
                    nombre = String(nombreCompleto[0][0].Nombre);
                    apellidos = String(nombreCompleto[0][0].Apellidos);
                } else {
                    nombre = ''
                    apellidos = ''
                }

                if (fila.inicioRef == '1') {

                    let montoAPagar = 0;
                    const deuda = await Deuda.fetchDeuda(fila.Matricula);
                    const deudaPagada = await Deuda.fetchDeudaPagada(fila.Matricula);
                    const idLiquida = await Liquida.fetchIDPagado(fila.Matricula, fila.fechaFormato);
                    const pagoCompleto = await Pago.fetch_fecha_pago(fila.fechaFormato);

                    if (deuda && deuda[0] && deuda[0][0] && typeof deuda[0][0].montoAPagar !== 'undefined') {
                        montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));
                    } else {
                        montoAPagar = Number(deudaPagada[0][0].montoAPagar.toFixed(2));
                    }


                    if (pagoCompleto && pagoCompleto[0] && pagoCompleto[0][0] && typeof pagoCompleto[0][0].fechaPago !== 'undefined') {
                        const fechaParseada = new Date(pagoCompleto[0][0].fechaPago)

                        const fechaFormateada = `${fechaParseada.getFullYear()}-${(fechaParseada.getMonth() + 1).toString().padStart(2, '0')}-${fechaParseada.getDate().toString().padStart(2, '0')} ${fechaParseada.getHours()}:${fechaParseada.getMinutes().toString().padStart(2, '0')}`;

                        const montoRedondeado = Math.round(pagoCompleto[0][0].montoPagado * 100) / 100;
                        const importeRedondeado = Math.round(fila.Importe * 100) / 100;

                        if (montoRedondeado === importeRedondeado && fechaFormateada === fila.fechaFormato) {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = 0;
                        }
                    }

                    if (idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined') {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    }


                    if (fila.Importe == montoAPagar) {
                        if (tipoPago === 'Pago Completo') {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = 0;
                        } else {
                            tipoPago = 'Pago de Colegiatura';
                            deudaEstudiante = montoAPagar;
                        }
                    } else {
                        if (tipoPago === 'Pago Completo') {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = 0;
                        } else {
                            tipoPago = 'Pago a Registrar'; // Si el importe no coincide con el monto a pagar
                            deudaEstudiante = montoAPagar;
                        }
                    }
                } else if (fila.inicioRef == '8') {
                    const idLiquidaPagada = await Liquida.fetchIDPagado(fila.Matricula, fila.fechaFormato);

                    const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fila.fechaFormato);


                    if (pagoDiplomadoCompleto && pagoDiplomadoCompleto[0] && pagoDiplomadoCompleto[0][0] && typeof pagoDiplomadoCompleto[0][0].fechaPago !== 'undefined') {
                        const fechaParseada = new Date(pagoDiplomadoCompleto[0][0].fechaPago)

                        const anio = fechaParseada.getFullYear();
                        const mes = (fechaParseada.getMonth() + 1).toString().padStart(2, '0');
                        const dia = fechaParseada.getDate().toString().padStart(2, '0');
                        let horas = fechaParseada.getHours();
                        const minutos = fechaParseada.getMinutes().toString().padStart(2, '0');

                        // Formatear las horas en el formato deseado
                        if (horas < 10) {
                            horas = `0${horas}`;
                        }

                        const fechaFormateada = `${anio}-${mes}-${dia} ${horas}:${minutos}`;


                        const montoRedondeado = Math.round(pagoDiplomadoCompleto[0][0].montoPagado * 100) / 100;
                        const importeRedondeado = Math.round(fila.Importe * 100) / 100;

                        if (montoRedondeado === importeRedondeado && fechaFormateada === fila.fechaFormato) {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = 0;
                        }
                    }

                    if (idLiquidaPagada[0] && idLiquidaPagada[0][0] && typeof idLiquidaPagada[0][0].IDLiquida !== 'undefined') {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    } else {

                        if (tipoPago === 'Pago Completo') {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = 'N/A';
                        } else {
                            tipoPago = 'Pago de Diplomado'; // Si el importe no coincide con el monto a pagar
                        }
                    }



                } else if (fila.inicioRef = 'A') {
                    tipoPago = 'Pago a Ignorar';
                }
                resultados.push({
                    ...fila,
                    tipoPago,
                    deudaEstudiante,
                    nombre,
                    apellidos
                });
            }
            response.render('pago/registro_transferencia', {
                subir: false,
                revisar: true,
                datos: resultados,
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        });
};


exports.post_registrar_transferencia = async (request, response, next) => {
    let success = true;
    const pagosRegistrar = [];
    const nombre = request.body.nombre;
    const matricula = request.body.matricula;
    const referencia = request.body.referencia;
    const importe = request.body.importe;
    const deuda = request.body.deuda;
    const tipoPago = request.body.tipoPago;
    const fecha = request.body.fecha;
    const nota = request.body.nota;
    if (tipoPago === 'Pago de Colegiatura') {
        let diferencia = 0;
        let montoAPagar = 0;

        const deuda = await Deuda.fetchDeuda(matricula);
        const idDeuda = await Deuda.fetchIDDeuda(matricula);

        if (deuda[0] && deuda[0][0] && typeof deuda[0][0].montoAPagar !== 'undefined') {
            montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));
        }
        
        else{
            success = false;
            response.json({ success: success });
            return;
        }
        
        const colegiatura = await Deuda.fetchColegiatura(idDeuda[0][0].IDDeuda);
        const idColegiatura = colegiatura[0][0].IDColegiatura;

        if (importe > montoAPagar) {
            diferencia = importe - montoAPagar;
        }

        let importe_trans = importe - diferencia;
        await Pago.save_transferencia(idDeuda[0][0].IDDeuda, importe, nota, fecha);
        await Colegiatura.update_transferencia(importe, idColegiatura)
        await Deuda.update_transferencia(importe_trans, idDeuda[0][0].IDDeuda)
        const deudaNext = await Deuda.fetchIDDeuda(matricula)

        if (diferencia > 0) {

            if (deudaNext[0] && deudaNext[0][0] && typeof deudaNext[0][0].IDDeuda !== 'undefined') {
                await Deuda.update_transferencia(diferencia, deudaNext[0][0].IDDeuda);
            }

            else {
                await Alumno.update_credito(matricula, diferencia);
            }

        }
    }
    else if (tipoPago === 'Pago de Diplomado') {
        const idDiplomado = await Cursa.fetchDiplomadosCursando(matricula);
        PagoDiplomado.save_transferencia(matricula, idDiplomado[0][0].IDDiplomado, fecha, importe, nota);
    }
    else if (tipoPago === 'Pago a Registrar') {
        pagosRegistrar.push({ nombre, matricula, referencia, importe, deuda, tipoPago, fecha });
    }
    else if (tipoPago === 'Pago Extra') {
        const idLiquida = await Liquida.fetchID(matricula);

        if (idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined') {
            const idPagoExtra = await Pago_Extra.fetchID(importe);
            if (idPagoExtra[0] && idPagoExtra[0][0] && typeof idPagoExtra[0][0].IDPagosExtras !== 'undefined') {
                Liquida.update_transferencia(nota, fecha, idLiquida[0][0].IDLiquida)
            }
            else {
                success = false;
            }
        }
        else {
            const idPagoExtra = await Pago_Extra.fetchID(importe);
            if (idPagoExtra[0] && idPagoExtra[0][0] && typeof idPagoExtra[0][0].IDPagosExtras !== 'undefined') {
                Liquida.save_transferencia(matricula, idPagoExtra[0][0].IDPagosExtras, fecha, nota);
            }
            else {
                success = false;
            }
        }
    }

    response.json({ success: success });
};

