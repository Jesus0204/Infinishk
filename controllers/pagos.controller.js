const Deuda = require('../models/deuda.model');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const upload = multer({ storage:multer.memoryStorage() });

exports.get_pago = (request,response,next) => {
    response.render('pago/pago');
};

exports.get_registro_transferencias = (request,response,next) => {
    response.render('pago/registro_transferencia',{
        subir:true,
        revisar:false,
    });
};

exports.post_subir_archivo = upload.single('archivo'),(request, response,next) => {
    const filas = [];
    fs.createReadStream(request.file.buffer)
        .pipe(csvParser())
        .on('data', (data) => {
            const { Fecha, Hora, Importe, Concepto } = data;
            const Referencia = Concepto.substring(0, 7); 
            const Matricula = Concepto.substring(0,6);
            console.log(Fecha);
            console.log(Hora);
            console.log(Importe);
            console.log(Concepto);
            console.log(Referencia);
            console.log(Matricula);
            filas.push({ Fecha, Hora, Importe, Concepto:Matricula,Concepto: Referencia });
        })
        .on('end', async () => {
            const resultados = [];
            for (const fila of filas) {
                const deuda = await Deuda.fetchDeuda(fila.Matricula);
                console.log(deuda);
                let tipoPago = '';
                if (fila.Referencia.startsWith('1')) {
                    if(fila.Importe == deuda){
                        tipoPago = 'pagocolegiatura';
                    }
                    else
                    {
                        tipoPago = 'pagoextra';
                    }
                } else if (fila.Referencia.startsWith('8')) {
                    tipoPago = 'pagodiplomado';
                }
                resultados.push({ ...fila, TipoPago: tipoPago });
            }
            response.render('pago/registro_transferencia', { 
                subir: false,
                revisar:true,
                datos: resultados 
            });
        });
};


