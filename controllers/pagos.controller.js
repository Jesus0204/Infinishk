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

const Pago_Extra = require('../models/pago_extra.model');

exports.get__registrar_pago_extra = (request, response, next) => {
    response.render('pago/registrar_pago_extra');
};

exports.post_registrar_pago_extra = (request, response, next) => {
    const pago_extra = new Pago_Extra(request.body.motivo, request.body.monto);

    pago_extra.save()
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/pagos_extra');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_pago_extra = (request, response, next) => {
    Pago_Extra.fetchAll()
        .then(([pagosExtra, fieldData]) => {
            Pago_Extra.fetchNoAsignados()
                .then(([pagosExtraNoAsignados, fieldData]) => {
                    response.render('pago/pagos_extra', {
                        pagosNoAsignados: pagosExtraNoAsignados,
                        pagos: pagosExtra
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.post_pago_extra_modify = (request, response, next) => {
    Pago_Extra.update(request.body.id, request.body.motivo, request.body.monto)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/pagos_extra');
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.post_modify_status = (request, response, next) => {
    console.log(request.body.estatus);
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