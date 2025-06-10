const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');

const csvParser = require('csv-parser');
const fs = require('fs');
const stream = require('stream');
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_pagos_transferencias = (request, response, next) => {
    response.render('pago/pago_transferencia', {
        pagosSubidos: null,
        csrfToken: request.csrfToken(),
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || '',
    });
};

exports.subirYRegistrarTransferencia = async (request, response, next) => {
    if (!request.file) {
        console.warn("No se subió ningún archivo");
        return response.status(400).send('No se subió ningún archivo.');
    }

    const fileBuffer = request.file.buffer;
    const contenido = fileBuffer.toString('utf8');
    const lineas = contenido.split('\n').slice(5); // quitar encabezados
    const contenidoRecortado = lineas.join('\n');

    const fileStream = new stream.Readable();
    fileStream.push(contenidoRecortado);
    fileStream.push(null);

    const parser = fileStream.pipe(csvParser());
    const filas = [];

    parser.on('data', (data) => {
        const cleanedData = {};
        for (const key in data) {
            cleanedData[key.trim()] = data[key];
        }

        const { Fecha, Monto, Referencia, Metodo, Nota } = cleanedData;
        let fechaFormato = "";
        const rawFecha = Fecha.trim();
        const referenciaLimpia = Referencia.replace(/\s+/g, '');
        const ReferenciaAlum = referenciaLimpia.substring(0, 7);
        const Matricula = referenciaLimpia.substring(0, 6);
        const inicioRef = referenciaLimpia.substring(0, 1);
        const fechaCompleta = moment(rawFecha + '-2025', 'DD-MMM-YYYY');

        if (fechaCompleta.isValid()) {
            fechaFormato = fechaCompleta.format('D/M/YYYY');
        } else {
            console.error('Fecha inválida:', rawFecha);
        }

        const monto = Monto ? parseFloat(Monto.trim().replace(/[$,]/g, '')) : 0;

        filas.push({ fechaFormato, monto, ReferenciaAlum, Matricula, inicioRef, Metodo, Nota });
    });

    parser.on('end', async () => {
        console.log("Inicio del procesamiento de filas");
        const resultados = [];
        let count = 0;
        let esPrimeraFila = false; 

        for (const fila of filas) {
            if (count == 0) {
                esPrimeraFila = true;
            }
            let nombre = '', apellidos = '', deudaEstudiante = 0, tipoPago = '', montoAPagar = 0;
            const matricula = fila.Matricula;

            const fechaMoment = moment(fila.fechaFormato, 'D/M/YYYY').format('YYYY-MM-DD');

            try {
                const [nombreCompleto, deuda, deudaPagada] = await Promise.all([
                    (fila.inicioRef === '1' || fila.inicioRef === '8') ? Alumno.fetchNombre(matricula) : null,
                    fila.inicioRef === '1' ? Deuda.fetchDeuda(matricula) : null,
                    fila.inicioRef === '1' ? Deuda.fetchDeudaPagada(matricula) : null
                ]);

                if (nombreCompleto?.[0]?.[0]?.Nombre) {
                    nombre = nombreCompleto[0][0].Nombre;
                    apellidos = nombreCompleto[0][0].Apellidos;
                } else {
                    if(esPrimeraFila){
                        console.warn(`Nombre no encontrado para matrícula ${matricula}`);
                    }
                    tipoPago = "Pago no Reconocido";
                }

                if (fila.inicioRef === '1') {
                    if(esPrimeraFila){
                        console.log("Lógica de colegiatura");
                    }
                    montoAPagar = deuda?.[0]?.[0]?.montoAPagar !== undefined ?
                        Number(deuda[0][0].montoAPagar.toFixed(2)) :
                        Number(deudaPagada?.[0]?.[0]?.montoAPagar?.toFixed(2) || 0);

                    if(esPrimeraFila){
                        console.log("Monto a pagar: ",montoAPagar);
                        console.log("fechaMoment: ",fechaMoment);
                        console.log("fila.monto: ",fila.monto);
                    }

                    const pagoCompleto = await Pago.fetch_fecha_pago(fechaMoment, fila.monto, matricula);
                    const pagoValido = pagoCompleto?.[0]?.[0];

                    if(esPrimeraFila){
                        console.log("Pago Valido: ",pagoValido);
                    }

                    if (pagoValido) {
                        const fechaFormateada = moment(new Date(pagoValido.fechaPago)).format('YYYY-MM-DD');
                        if (
                            Math.round(pagoValido.montoPagado * 100) / 100 === Math.round(fila.monto * 100) / 100 &&
                            fechaFormateada === fechaMoment &&
                            pagoValido.matricula === matricula
                        ) {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = 0;
                            if(esPrimeraFila){
                                console.log(`Pago completo detectado para ${matricula}`);
                            }
                        }
                    }

                    const idLiquida = await Liquida.fetchIDPagado(matricula, fechaMoment);
                    if (idLiquida?.[0]?.[0]?.IDLiquida) {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                        if(esPrimeraFila){
                            console.log(`Liquidación detectada para ${matricula}`);
                        }
                    }

                    if (fila.monto >= montoAPagar && tipoPago !== 'Pago Completo') {
                        tipoPago = 'Pago de Colegiatura';
                        deudaEstudiante = montoAPagar;
                        if(esPrimeraFila){
                            console.log(`Pago exacto de colegiatura para ${matricula}`);
                        }
                    } else if (!tipoPago) {
                        tipoPago = 'Pago a Registrar';
                        deudaEstudiante = montoAPagar;
                        if(esPrimeraFila){
                            console.log(`Pago a registrar para ${matricula}`);
                        }
                    }

                } else if (fila.inicioRef === '8') {
                    if(esPrimeraFila){
                        console.log("Lógica de diplomado");
                    }
                    const idLiquidaPagada = await Liquida.fetchIDPagado(matricula, fechaMoment);
                    const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fechaMoment);
                    const pagoValido = pagoDiplomadoCompleto?.[0]?.[0];

                    if (pagoValido) {
                        if (Math.round(pagoValido.montoPagado * 100) / 100 === Math.round(fila.monto * 100) / 100) {
                            tipoPago = 'Pago Completo';
                            deudaEstudiante = 0;
                            if(esPrimeraFila){
                                console.log(`Pago completo diplomado para ${matricula}`);
                            }
                        }
                    }

                    if (idLiquidaPagada?.[0]?.[0]?.IDLiquida) {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                        if(esPrimeraFila){
                            console.log(`Liquidación diplomado detectada para ${matricula}`);
                        }
                    } else {
                        tipoPago = tipoPago || 'Pago de Diplomado';
                    }
                } else {
                    if(esPrimeraFila){
                        console.log(`Referencia con prefijo desconocido (${fila.inicioRef}), se ignorará`);
                    }
                    tipoPago = 'Pago a Ignorar';
                }

                resultados.push({ ...fila, tipoPago, deudaEstudiante, nombre, apellidos });

                if (tipoPago === 'Pago de Colegiatura') {
                    if(esPrimeraFila){
                        console.log(`Registrando automáticamente pago para ${matricula}`);
                    }
                    const idDeuda = await Deuda.fetchIDDeuda(matricula);
                    const idDeudaValida = idDeuda?.[0]?.[0]?.IDDeuda;

                    if(esPrimeraFila){
                        console.log(`IDdeuda`,idDeudaValida);
                    }
                    if (!idDeudaValida) continue;

                    const colegiatura = await Deuda.fetchColegiatura(idDeudaValida);
                    const idColegiatura = colegiatura?.[0]?.[0]?.IDColegiatura;

                    if(esPrimeraFila){
                        console.log(`IDColegiatura`,idColegiatura);
                    }

                    const [deudasNoPagadas] = await Deuda.fetchNoPagadas(idColegiatura);

                    if(esPrimeraFila){
                        console.log(`DeudasNoPagadas`,deudasNoPagadas);
                        console.log(`DeudasNoPagadas`,deudasNoPagadas[0].IDDeuda);
                        console.log('Monto',fila.monto);
                        console.log('Fecha',fechaMoment);
                    }

                    await Pago.save_transferencia(deudasNoPagadas[0].IDDeuda, fila.monto, '', fechaMoment);

                    let montoAUsar = fila.monto;
                    for (const deudaItem of deudasNoPagadas) {
                        if (montoAUsar <= 0) break;
                        const restante = deudaItem.montoAPagar - deudaItem.montoPagado;
                        if (moment(fechaMoment).isSameOrBefore(moment(deudaItem.fechaLimitePago), 'day') && deudaItem.Recargos == 1) {
                            await Deuda.removeRecargosDeuda(deudaItem.IDDeuda);
                        }
                        montoAUsar -= restante;
                    }
                }

            } catch (error) {
                if(esPrimeraFila){
                    console.error(`Error procesando matrícula ${matricula}:`, error);
                }
                resultados.push({ ...fila, tipoPago: 'Error al procesar', deudaEstudiante: 0 });
            }

            count++;
            esPrimeraFila = false;
        }

        response.render('pago/pago_transferencia', {
            pagosSubidos: resultados,
            csrfToken: request.csrfToken(),
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || '',
        });
    });
};
