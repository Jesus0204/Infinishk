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

exports.get_registrar_solicitud = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: true
    });
};

exports.post_fetch_registrar_solicitud = (request, response, next) => {

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
    Alumno.fetch(request.params.valor_busqueda || '')
    .then(([alumnos, fieldData]) => {
        return response.status(200).json({
            alumnos: alumnos
        });
    })
    .catch((error) => {console.log(error)});
};