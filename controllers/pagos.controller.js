const Deuda = require('../models/deuda.model');
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

exports.post_subir_archivo = (request, response,next) => {
    const filas = [];
    fs.createReadStream(request.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            const { Fecha, Hora, Importe, Concepto } = data;
            const Referencia = Concepto.substring(0, 7); 
            const Matricula = Concepto.substring(0,6);
            const inicioRef = Concepto.substring(0,1);
            const dia = Fecha.substring(1,3);
            const mes = Fecha.substring(3,5);
            const anio = Fecha.substring(5,9);
            fechaFormato = anio+'-'+mes+'-'+dia;
            filas.push({ fechaFormato, Hora, Importe,Referencia,Matricula,inicioRef});
        })
        .on('end', async () => {
            const resultados = [];
            for (const fila of filas) {
                let tipoPago = ''; 
                if (fila.inicioRef =='1') 
                {
                    const deuda = await Deuda.fetchDeuda(fila.Matricula);
                    const montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));
                    if(fila.Importe == montoAPagar){
                        tipoPago = 'Pago de Colegiatura';
                        deudaEstudiante = montoAPagar;
                    }
                    else
                    {
                        tipoPago = 'Pago a Registrar';
                        deudaEstudiante = montoAPagar;
                    }
                } 
                else if (fila.inicioRef=='8') 
                {
                    tipoPago = 'Pago de Diplomado';
                }
                else if (fila.inicioRef='A')
                {
                    tipoPago = 'Pago a Ignorar';
                }
                resultados.push({ ...fila, tipoPago,deudaEstudiante });
            }
            response.render('pago/registro_transferencia', { subir: false,revisar:true,datos: resultados });
        });
};


