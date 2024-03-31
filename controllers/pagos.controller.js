const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const upload = multer({
    dest: 'uploads/'
});

exports.get_pago = (request, response, next) => {
    response.render('pago/pago');
};

const PagoExtras = require('../models/pago_extra.model');

exports.get__registrar_pago_extra = (request, response, next) => {
    response.render('pago/registrar_pago_extra');
};

exports.post_registrar_pago_extra = (request, response, next) => {
    const pago_extra = new PagoExtras(request.body.motivo, request.body.monto);

    pago_extra.save()
    .then(([rows, fieldData]) => {
        response.redirect('/pagos');
    })
    .catch((error) => {
        console.log(error);
    });
};

const Deuda = require('../models/deuda.model');

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