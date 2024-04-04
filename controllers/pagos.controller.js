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
const Pago_Extra = require('../models/pago_extra.model');

exports.get_solicitudes = (request, response, next) => {
    Liquida.fetchNoPagados()
        .then(([rows, fieldData]) => {
            Pago_Extra.fetchAll()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/solicitudes', {
                        solicitudes: rows,
                        pagos: pagos_extra,
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

exports.post_solicitudes_modify = (request, response, next) => {
    Liquida.update(request.body.id, request.body.pago)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/solicitudes');
        })
        .catch((error) => {
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