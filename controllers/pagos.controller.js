const Deuda = require('../models/deuda.model');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

exports.get_pago = (request,response,next) => {
    response.render('pago/pago');
};

exports.get_registro_transferencias = (request,response,next) => {
    response.render('pago/registro_transferencia',{
        subir:true,
        revisar:false,
    });
};

exports.post_subir_archivo = upload.single('archivo'), (req, res) => {
    const resultados = [];
    fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            const { Fecha, Hora, Importe, Concepto } = data;
            const ConceptoCorto = Concepto.substring(0, 7); 
            let tipoPago = '';
            if (ConceptoCorto.startsWith('1')) {
                tipoPago = 'pagocolegiatura';
            } else if (ConceptoCorto.startsWith('8')) {
                tipoPago = 'pagodiplomado';
            }
            resultados.push({ Fecha, Hora, Importe, Concepto: ConceptoCorto, TipoPago: tipoPago });
        })
        .on('end', () => {
            res.render('registro_transferencia', { subir: false, datos: resultados });
        });
};

