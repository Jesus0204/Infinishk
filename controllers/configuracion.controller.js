const PlanPago = require('../models/planpago.model');
const PrecioCredito = require('../models/precio_credito.model');
const Usuario = require('../models/usuario.model');
const Alumno = require('../models/alumno.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const Materia = require('../models/materia.model');
const Periodo = require('../models/periodo.model');
const Posee = require('../models/posee.model');
const Colegiatura = require('../models/colegiatura.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const PagoExtra = require('../models/liquida.model');
const { getAllUsers, getAllCourses, getAllPeriods } = require('../util/adminApiClient');

const { createObjectCsvWriter } = require('csv-writer');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const path = require('path');

const fs = require('fs');

exports.get_configuracion = (request, response, next) => {
    response.render('configuracion/configuracion');
};

exports.get_administrar_planpago = (request, response, next) => {
    PlanPago.fetchAll()
        .then(([planpagos]) => {
            response.render('configuracion/administrar_planpago', {
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
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

exports.post_modificar_planpago = (request, response, next) => {
    const nombre = request.body.nombrePlan;
    const activo = request.body.planPagoActivo;
    const IDPlanPago = request.body.IDPlanPago;

    PlanPago.update(nombre, activo, IDPlanPago)
        .then(([planespago, fieldData]) => {
            // Aquí puedes enviar una respuesta JSON indicando éxito
            response.json({ success: true });
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.get_registrar_planpago = (request, response, next) => {
    PlanPago.fetchAll()
        .then(([planpagos]) => {
            response.render('configuracion/registrar_planpago', {
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
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

exports.get_consultar_usuario = (request, response, next) => {
    Usuario.fetchActivos()
        .then(([usuariosActivos, fieldData]) => {
            Usuario.fetchNoActivos()
                .then(([usuariosNoActivos, fieldData]) => {
                    response.render('configuracion/consultar_usuario', {
                        usuariosNoActivos: usuariosNoActivos,
                        usuariosActivos: usuariosActivos,
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
}

exports.get_search_activo = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
    Usuario.buscar(consulta) // Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_search_noactivo = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
    Usuario.buscarNoActivos(consulta)// Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_modificar_usuario = (request, response, next) => {
    const id = request.body.IDUsuario;
    const status = request.body.statusUsuario === 'on' ? '1' : '0';

    Usuario.update(id, status)
        .then(() => {
            // Redirigir al usuario de vuelta a la misma página
            response.redirect('/configuracion/consultar_usuario');
        })
        .catch((error) => {
            console.log('Hubo error');
            console.log(error);
            // Manejar el error de alguna forma
            response.redirect('/configuracion/consultar_usuario');
        });
}

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then((precio_actual) => {
            PrecioCredito.fetchAnios()
                .then(([anios, fieldData]) => {
                    // Conviertes las fechas a tu zona horaria con moment
                    precio_actual[0][0].fechaModificacion = moment(new Date(precio_actual[0][0].fechaModificacion)).tz('America/Mexico_City').format('LL');

                    response.render('configuracion/precio_credito', {
                        precio_actual: precio_actual[0],
                        anios: anios,
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

exports.post_precio_credito = (request, response, next) => {
    const anioSelect = request.body.anio;
    PrecioCredito.fetchPrecioAnio(anioSelect)
        .then(([precio_anio, fieldData]) => {
            // Conviertes las fechas a tu zona horaria con moment
            for (let count = 0; count < precio_anio.length; count++) {
                precio_anio[count].fechaModificacion = moment(new Date(precio_anio[count].fechaModificacion)).tz('America/Mexico_City').format('LL');
            };
            response.status(200).json({
                success: true,
                precio_anio: precio_anio
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
                success: false,
                error: 'Error cargando precioCredito'
            });
        });
};

exports.get_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then((precio_actual) => {
            response.render('configuracion/registrar_precio_credito', {
                precio_actual: precio_actual[0],
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
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


exports.get_check_plan = (request, response, next) => {
    const nombre = request.query.nombre;
    PlanPago.fetchOne(nombre)
        .then(([planpagos]) => {
            if (planpagos.length > 0) {
                response.json({ exists: true });
            } else {
                response.json({ exists: false });
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_planpago = (request, response, next) => {
    const nombre = request.body.nombrePlan;
    const numero = request.body.numeroPagos;
    const activo = request.body.planPagoActivo;

    PlanPago.save(nombre, numero, activo)
        .then(([planespago, fieldData]) => {
            response.redirect('/configuracion/administrar_planpago');
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
            console.log(error);
        });
}

exports.post_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.update(request.body.monto)
        .then(([precio_credito, fieldData]) => {
            response.redirect('/configuracion/precio_credito');
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

exports.get_exportar_datos = (request, response, next) => {
    response.render('configuracion/exportarDatos', {
        error: false,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
}

exports.post_exportar_datos = async (request, response, next) => {
    const colegiatura = request.body.colegiatura === 'on';
    const diplomado = request.body.pag_dipl === 'on';
    const extra = request.body.extra === 'on';
    const fechaInicio = request.body.fecha_inicio;
    const fechaFin = request.body.fecha_fin;

    const uploadsDir = path.join(__dirname, '../', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    // Función para eliminar acentos
    function eliminarAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    let csvContent = '';

    if (colegiatura) {
        const datosColegiatura = await Colegiatura.fetchDatosColegiatura(fechaInicio, fechaFin);
        if (datosColegiatura.length === 0 || datosColegiatura[0].length === 0) {
            return response.render('configuracion/exportarDatos', {
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            });
        }
        csvContent += 'Colegiatura\n';
        csvContent += 'Matricula,Nombre,Apellidos,referenciaBancaria,IDPago,Motivo,montoPagado,metodoPago,fechaPago,Nota\n';
        datosColegiatura.forEach((dato) => {
            dato.forEach((valor) => {
                let fechaFormateada = '';
                if (!isNaN(valor.fechaPago)) {
                    let fecha = new Date(valor.fechaPago);
                    let anio = fecha.getFullYear();
                    let mes = fecha.getMonth() + 1;
                    let dia = fecha.getDate();
                    let hora = fecha.getHours();
                    let minutos = fecha.getMinutes();

                    if (mes < 10) mes = '0' + mes;
                    if (dia < 10) dia = '0' + dia;

                    fechaFormateada = `${anio}-${mes}-${dia} ${hora}:${minutos}`;
                }

                csvContent += `${valor.Matricula ? eliminarAcentos(valor.Matricula) : ''},${valor.Nombre ? eliminarAcentos(valor.Nombre) : ''},${valor.Apellidos ? eliminarAcentos(valor.Apellidos) : ''},${valor.referenciaBancaria ? eliminarAcentos(valor.referenciaBancaria) : ''},${valor.IDPago || ''},${valor.Motivo ? eliminarAcentos(valor.Motivo) : ''},${valor.montoPagado || ''},${valor.metodoPago ? eliminarAcentos(valor.metodoPago) : ''},${fechaFormateada || ''},${valor.Nota ? eliminarAcentos(valor.Nota) : ''}\n`;
            });
            csvContent += '\f';
        });
    }

    if (diplomado) {
        const datosDiplomado = await PagoDiplomado.fetchDatosDiplomado(fechaInicio, fechaFin);
        if (datosDiplomado.length === 0 || datosDiplomado[0].length === 0) {
            return response.render('configuracion/exportarDatos', {
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            });
        }
        csvContent += '\nDiplomado\n';
        csvContent += 'Matricula,Nombre,Apellidos,referenciaBancaria,IDDiplomado,nombreDiplomado,Motivo,montoPagado,metodoPago,fechaPago,Nota\n';
        datosDiplomado.forEach((dato) => {
            dato.forEach((valor) => {
                let fechaFormateada = '';
                if (!isNaN(valor.fechaPago)) {
                    let fecha = new Date(valor.fechaPago);
                    let anio = fecha.getFullYear();
                    let mes = fecha.getMonth() + 1;
                    let dia = fecha.getDate();
                    let hora = fecha.getHours();
                    let minutos = fecha.getMinutes();

                    if (mes < 10) mes = '0' + mes;
                    if (dia < 10) dia = '0' + dia;

                    fechaFormateada = `${anio}-${mes}-${dia} ${hora}:${minutos}`;
                }

                csvContent += `${valor.Matricula ? eliminarAcentos(valor.Matricula) : ''},${valor.Nombre ? eliminarAcentos(valor.Nombre) : ''},${valor.Apellidos ? eliminarAcentos(valor.Apellidos) : ''},${valor.referenciaBancaria ? eliminarAcentos(valor.referenciaBancaria) : ''},${valor.IDDiplomado || ''},${valor.nombreDiplomado ? eliminarAcentos(valor.nombreDiplomado) : ''},${valor.Motivo ? eliminarAcentos(valor.Motivo) : ''},${valor.montoPagado || ''},${valor.metodoPago ? eliminarAcentos(valor.metodoPago) : ''},${fechaFormateada || ''},${valor.Nota ? eliminarAcentos(valor.Nota) : ''}\n`;
            });
            csvContent += '\f';
        });
    }

    if (extra) {
        const datosExtra = await PagoExtra.fetchDatosLiquida(fechaInicio, fechaFin);
        if (datosExtra.length === 0 || datosExtra[0].length === 0) {
            return response.render('configuracion/exportarDatos', {
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            });
        }
        csvContent += '\nExtra\n';
        csvContent += 'Matricula,Nombre,Apellidos,referenciaBancaria,IDLiquida,metodoPago,fechaPago,Nota,Pagado,IDPagosExtras,motivoPago\n';
        datosExtra.forEach((dato) => {
            dato.forEach((valor) => {
                let fechaFormateada = '';
                if (!isNaN(valor.fechaPago)) {
                    let fecha = new Date(valor.fechaPago);
                    let anio = fecha.getFullYear();
                    let mes = fecha.getMonth() + 1;
                    let dia = fecha.getDate();
                    let hora = fecha.getHours();
                    let minutos = fecha.getMinutes();

                    if (mes < 10) mes = '0' + mes;
                    if (dia < 10) dia = '0' + dia;

                    fechaFormateada = `${anio}-${mes}-${dia} ${hora}:${minutos}`;
                }

                csvContent += `${valor.Matricula ? eliminarAcentos(valor.Matricula) : ''},${valor.Nombre ? eliminarAcentos(valor.Nombre) : ''},${valor.Apellidos ? eliminarAcentos(valor.Apellidos) : ''},${valor.referenciaBancaria ? eliminarAcentos(valor.referenciaBancaria) : ''},${valor.IDLiquida || ''},${valor.metodoPago ? eliminarAcentos(valor.metodoPago) : ''},${fechaFormateada || ''},${valor.Nota ? eliminarAcentos(valor.Nota) : ''},${valor.Pagado || ''},${valor.IDPagosExtras || ''},${valor.motivoPago ? eliminarAcentos(valor.motivoPago) : ''}\n`;
            });
            csvContent += '\f';
        });
    }

    const fechaActual = new Date().toISOString().replace(/:/g, '-');
    let nombreArchivo = '';

    const opcionesSeleccionadas = [colegiatura, diplomado, extra].filter(Boolean).length;
    if (opcionesSeleccionadas === 3) {
        nombreArchivo = `datos_exportados_${fechaActual}.csv`;
    } else if (opcionesSeleccionadas === 2) {
        nombreArchivo = `datos_exportados_${fechaActual}.csv`;
    } else if (colegiatura) {
        nombreArchivo = `datos_colegiatura_${fechaActual}.csv`;
    } else if (diplomado) {
        nombreArchivo = `datos_diplomado_${fechaActual}.csv`;
    } else if (extra) {
        nombreArchivo = `datos_extra_${fechaActual}.csv`;
    }

    response.attachment(nombreArchivo);
    response.send(csvContent);
}
