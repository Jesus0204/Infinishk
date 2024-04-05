const Deuda = require('../models/deuda.model');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const upload = multer({
    dest: 'uploads/'
});

exports.get_pago = (request, response, next) => {
    response.render('pago/pago');
};

exports.get_registro_transferencias = (request, response, next) => {
    response.render('pago/registro_transferencia', {
        subir: true,
        revisar: false,
    });
};

exports.post_subir_archivo = upload.single('archivo'), async (request, response, next) => {
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
            filas.push({
                Fecha,
                Hora,
                Importe,
                Concepto: Matricula,
                Concepto: Referencia
            });
        })
        .on('end', async () => {
            const resultados = [];
            for (const fila of filas) {
                const deuda = await Deuda.fetchDeuda(fila.Matricula);
                let tipoPago = '';
                if (fila.Referencia.startsWith('1')) {
                    if (fila.Importe == deuda) {
                        tipoPago = 'pagocolegiatura';
                    } else {
                        tipoPago = 'pagoextra';
                    }
                } else if (fila.Referencia.startsWith('8')) {
                    tipoPago = 'pagodiplomado';
                }
                resultados.push({
                    ...fila,
                    TipoPago: tipoPago
                });
            }
            response.render('pago/registro_transferencia', {
                subir: false,
                revisar: true,
                datos: resultados
            });
        });
};

const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Pago_Extra = require('../models/pago_extra.model');

exports.get_registrar_solicitud = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: true
    });
};

exports.post_fetch_registrar_solicitud = (request, response, next) => {
    // Del input del usuario sacas solo la matricula con el regular expression
    let matches = request.body.buscar.match(/(\d+)/);
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Pago_Extra.fetchAll()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/registrar_solicitud', {
                        alumno: alumno,
                        pagos_extra: pagos_extra
                    })
                })
                .catch((error) => {
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error)
        });
};

exports.post_registrar_solicitud = (request, response, next) => {
    const solicitud_pago = new Liquida(request.body.matricula, request.body.pago);

    solicitud_pago.save()
        .then(([rows, fieldData]) => {
            response.redirect('/solicitudes');
        })
        .catch((error) => {
            console.log(error)
        });
};

exports.get_autocomplete = (request, response, next) => {
    // Con la regular expression sacas toda la matricula
    let matricula = '   ';
    let nombre = '   ';
    if (!request.params) {
        matricula = ' ';
        nombre = ' ';
    } else if (!request.params.valor_busqueda) {
        matricula = ' ';
        nombre = ' ';
    } else {
        let matches_matricula = request.params.valor_busqueda.match(/(\d+)/);
        let matches_nombre = request.params.valor_busqueda.replace(/[0-9]/g, '');

        if (matches_matricula && matches_nombre != '') {
            matricula = matches_matricula[0];
            nombre = matches_nombre;

            Alumno.fetch_both(matricula, nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                })
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
        } else if (matches_nombre) {
            nombre = matches_nombre[0];

            Alumno.fetch(nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
};