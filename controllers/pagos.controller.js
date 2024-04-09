const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const pagoDiplomado = require('../models/pagadiplomado.model');
const pagoExtra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');

const csvParser = require('csv-parser');
const fs = require('fs');

exports.get_pago = (request, response, next) => {
    response.render('pago/pago');
};

exports.get_registro_transferencias = (request, response, next) => {
    response.render('pago/registro_transferencia', {
        subir: true,
        revisar: false,
        resultado: false,
    });
};

exports.post_subir_archivo = (request, response, next) => {
    const filas = [];
    fs.createReadStream(request.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            const { Fecha, Hora, Importe, Concepto } = data;
            const Referencia = Concepto.substring(0, 7);
            const Matricula = Concepto.substring(0, 6);
            const inicioRef = Concepto.substring(0, 1);
            const dia = Fecha.substring(1, 3);
            const mes = Fecha.substring(3, 5);
            const anio = Fecha.substring(5, 9);
            fechaFormato = anio + '-' + mes + '-' + dia;
            filas.push({ fechaFormato, Hora, Importe, Referencia, Matricula, inicioRef });
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
                }
                else {
                    nombre = ''
                    apellidos = ''
                }

                if (fila.inicioRef == '1') {

                    let montoAPagar = 0;
                    const deuda = await Deuda.fetchDeuda(fila.Matricula);
                    const deudaPagada = await Deuda.fetchDeudaPagada(fila.Matricula);
                    
                    if (deuda && deuda[0] && deuda[0][0] && typeof deuda[0][0].montoAPagar !== 'undefined') {
                        // La deuda existe y tiene un monto a pagar definido
                        montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));
                    } else {
                        montoAPagar = Number(deudaPagada[0][0].montoAPagar.toFixed(2));
                    }

                    const idLiquida = await Liquida.fetchID(fila.Matricula);
                    const pagadoLiquida = await Liquida.fetchStatus(fila.Matricula);
                    const estado = await Deuda.fetchEstado(fila.Matricula);
                    const pagado = (estado[0][0].Pagado);

                    if(idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined' && pagadoLiquida[0][0].Pagado === 1){
                        tipoPago = 'Pago Completo';
                    }

                    else if (fila.Importe == montoAPagar) {
                        if (pagado === 0) {
                            tipoPago = 'Pago de Colegiatura';
                            deudaEstudiante = montoAPagar;
                        } else {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = montoAPagar;
                        }
                    }

                    else {
                        tipoPago = 'Pago a Registrar'; // Si el importe no coincide con el monto a pagar
                        deudaEstudiante = montoAPagar;
                    }

                }

                else if (fila.inicioRef == '8') {
                    const idLiquida = await Liquida.fetchID(fila.Matricula);
                    const pagadoLiquida = await Liquida.fetchStatus(fila.Matricula);

                    if (idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined' && pagadoLiquida[0][0].Pagado === 1) {
                        tipoPago = 'Pago Completo';
                    }

                    else {

                        tipoPago = 'Pago de Diplomado';
                    }
                }
                else if (fila.inicioRef = 'A') {
                    tipoPago = 'Pago a Ignorar';
                }
                resultados.push({ ...fila, tipoPago, deudaEstudiante, nombre, apellidos });
            }
            response.render('pago/registro_transferencia', {
                subir: false,
                revisar: true,
                datos: resultados,
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
        const deuda = await Deuda.fetchDeuda(matricula);
        const idDeuda = await Deuda.fetchIDDeuda(matricula);
        const montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));

        if(importe > montoAPagar){
            diferencia = importe - montoAPagar;
        }
        console.log(diferencia)
        await Pago.save_transferencia(idDeuda[0][0].IDDeuda, importe, nota, fecha);
        const deudaNext = await Deuda.fetchIDDeuda(matricula)
        if(deudaNext[0] && deudaNext[0][0] && typeof deudaNext[0][0].IDDeuda !== 'undefined'){
            await Deuda.updateDescuento(diferencia,deudaNext[0][0].IDDeuda);
        } 
    }
    else if (tipoPago === 'Pago de Diplomado') {
        const idDiplomado = await Cursa.fetchDiplomado(matricula);
        pagoDiplomado.save_transferencia(matricula, idDiplomado[0][0].IDDiplomado, fecha, importe, nota);
    }
    else if (tipoPago === 'Pago a Registrar') {
        pagosRegistrar.push({ nombre, matricula, referencia, importe, deuda, tipoPago, fecha });
    }
    else if (tipoPago === 'Pago Extra') {
        const idLiquida = await Liquida.fetchID(matricula);
        if (idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined') {
            Liquida.update_transferencia(nota, fecha, idLiquida[0][0].IDLiquida)
        }
        else {
            const idPagoExtra = await pagoExtra.fetchID(importe);
            if (idPagoExtra[0] && idPagoExtra[0][0] && typeof idPagoExtra[0][0].IDPagosExtras !== 'undefined') {
                Liquida.save_transferencia(matricula, idPagoExtra[0][0].IDPagosExtras, fecha, nota);
            }
            else {
                success = false;
            }
        }
    }

    response.json({ success: success });
}


