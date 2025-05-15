const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Pago_Extra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');
const Periodo = require('../models/periodo.model');
const Colegiatura = require('../models/colegiatura.model');
const Usuario = require('../models/usuario.model');
const Reporte = require('../models/reporte.model');

const csvParser = require('csv-parser');
const fs = require('fs');
const stream = require('stream');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
const PagoExtra = require('../models/pago_extra.model');
moment.locale('es-mx');

exports.get_pagos_transferencias = (request, response, next) => {
    response.render('pago/pago_transferencia', {
        pagosSubidos: null,
        csrfToken: request.csrfToken(),
        permisos: request.session.permisos || [],
        rol: request.session.rol || '',
    });
};


exports.subirYRegistrarTransferencia = async (request, response, next) => {
    console.log("Ando aqui en la funcion de subir y registrar");
    if (!request.file) {
        return response.status(400).send('No se subió ningún archivo.');
    }

    const fileBuffer = request.file.buffer;
    const filas = [];

    // Convertir el buffer a string y eliminar las primeras 5 líneas
    const contenido = fileBuffer.toString('utf8');
    const lineas = contenido.split('\n').slice(5); // A6 en adelante
    const contenidoRecortado = lineas.join('\n');

    // Crear un stream de lectura a partir del nuevo contenido
    const fileStream = new stream.Readable();
    fileStream.push(contenidoRecortado);
    fileStream.push(null); // Finalizar el stream

    // Configurar el parser de CSV
    const parser = fileStream.pipe(csvParser());

    parser.on('data', (data) => {
        console.log('Fila CSV:', data);
        const { Fecha, Monto, Referencia, Metodo, Nota } = data;
        let fechaFormato = "";
        const rawFecha = Fecha.trim();
        const referenciaLimpia = Referencia.replace(/\s+/g, ''); // elimina todos los espacios
        const ReferenciaAlum = referenciaLimpia.substring(0, 7);
        const Matricula = referenciaLimpia.substring(0, 6);
        const inicioRef = referenciaLimpia.substring(0, 1);
        const fechaCompleta = moment(rawFecha + '-2025', 'DD-MMM-YYYY');

        if (fechaCompleta.isValid()) {
            fechaFormato = fechaCompleta.format('D/M/YYYY'); // Ejemplo: '17/9/2025'
            // Utiliza fechaFormato según tus necesidades
        } else {
            console.error('Fecha inválida:', fechaTexto);
            // Maneja el error según corresponda
        }

        const monto = Monto ? parseFloat(Monto.trim().replace(/[$,]/g, '')) : 0;

        filas.push({
            fechaFormato,
            monto,
            ReferenciaAlum,
            Matricula,
            inicioRef,
            Metodo,
            Nota
        });
    });

    parser.on('end', async () => {
        const resultados = [];

        for (const fila of filas) {
            console.log(fila);
            let nombre = '', apellidos = '', deudaEstudiante = 0, tipoPago = '', montoAPagar = 0;
            const matricula = fila.Matricula;

            // Ejecutar las consultas en paralelo usando Promise.all
            const [nombreCompleto, deuda, deudaPagada] = await Promise.all([
                (fila.inicioRef === '1' || fila.inicioRef === '8') ? Alumno.fetchNombre(matricula) : null,
                fila.inicioRef === '1' ? Deuda.fetchDeuda(matricula) : null,
                fila.inicioRef === '1' ? Deuda.fetchDeudaPagada(matricula) : null
            ]);

            if (nombreCompleto?.[0]?.[0]?.Nombre) {
                nombre = nombreCompleto[0][0].Nombre;
                apellidos = nombreCompleto[0][0].Apellidos;
            } else {
                tipoPago = "Pago no Reconocido";
            }

            if (fila.inicioRef === '1') {
                // Lógica de pago para Colegiatura
                montoAPagar = deuda?.[0]?.[0]?.montoAPagar !== undefined ?
                    Number(deuda[0][0].montoAPagar.toFixed(2)) :
                    Number(deudaPagada?.[0]?.[0]?.montoAPagar?.toFixed(2) || 0);

                let pagoCompleto = await Pago.fetch_fecha_pago(fila.fechaFormato, fila.monto);

                const pagoValido = pagoCompleto?.[0]?.[0];
                if (pagoValido) {
                    const fechaFormateada = moment(new Date(pagoValido.fechaPago)).format('YYYY-MM-DD');
                    if (Math.round(pagoValido.montoPagado * 100) / 100 === Math.round(fila.Monto * 100) / 100 &&
                        fechaFormateada === fila.fechaFormato &&
                        pagoValido.matricula === matricula) {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    }
                }

                // Verificar si se ha liquidado la deuda
                const idLiquida = await Liquida.fetchIDPagado(matricula, fila.fechaFormato);
                if (idLiquida?.[0]?.[0]?.IDLiquida) {
                    tipoPago = 'Pago Completo';
                    deudaEstudiante = 0;
                }

                // Si el monto a pagar es el importe, marcar como Pago de Colegiatura
                if (fila.Monto === montoAPagar && tipoPago !== 'Pago Completo') {
                    tipoPago = 'Pago de Colegiatura';
                    deudaEstudiante = montoAPagar;
                } else if (!tipoPago) {
                    tipoPago = 'Pago a Registrar';
                    deudaEstudiante = montoAPagar;
                }

            } else if (fila.inicioRef === '8') {
                // Lógica de pago para Diplomado
                const idLiquidaPagada = await Liquida.fetchIDPagado(matricula, fila.fechaFormato);
                const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fila.fechaFormato);

                const pagoValido = pagoDiplomadoCompleto?.[0]?.[0];
                if (pagoValido) {
                    const fechaFormateada = moment(new Date(pagoValido.fechaPago)).format('YYYY-MM-DD HH:mm');
                    if (Math.round(pagoValido.montoPagado * 100) / 100 === Math.round(fila.Monto * 100) / 100) {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    }
                }

                if (idLiquidaPagada?.[0]?.[0]?.IDLiquida) {
                    tipoPago = 'Pago Completo';
                    deudaEstudiante = 0;
                } else {
                    tipoPago = tipoPago || 'Pago de Diplomado';
                }
            } else {
                tipoPago = 'Pago a Ignorar';
            }

            resultados.push({
                ...fila,
                tipoPago,
                deudaEstudiante,
                nombre,
                apellidos
            });

            // Registro automático opcional solo para ciertos tipos de pago
            if (tipoPago === 'Pago de Colegiatura') {
                try {
                    const deuda = await Deuda.fetchDeuda(matricula);
                    const idDeuda = await Deuda.fetchIDDeuda(matricula);
                    const idDeudaValida = idDeuda?.[0]?.[0]?.IDDeuda;

                    if (!idDeudaValida) continue;

                    const colegiatura = await Deuda.fetchColegiatura(idDeudaValida);
                    const idColegiatura = colegiatura?.[0]?.[0]?.IDColegiatura;

                    const deudasNoPagadas = await Deuda.fetchNoPagadas(idColegiatura);
                    await Pago.save_transferencia(deudasNoPagadas[0].IDDeuda, fila.Monto, '', fila.fechaFormato);

                    let montoAUsar = fila.Monto;
                    for (const deudaItem of deudasNoPagadas) {
                        if (montoAUsar <= 0) break;
                        const restante = deudaItem.montoAPagar - deudaItem.montoPagado;
                        if (moment(fila.fechaFormato).isSameOrBefore(moment(deudaItem.fechaLimitePago), 'day') && deudaItem.Recargos == 1) {
                            await Deuda.removeRecargosDeuda(deudaItem.IDDeuda);
                        }
                        montoAUsar -= restante;
                    }
                } catch (error) {
                    console.error(`Error al registrar transferencia automática para matrícula ${matricula}:`, error);
                }
            }
        }

        response.render('pago/pago_transferencia', {
            pagosSubidos: resultados,
            csrfToken: request.csrfToken(),
            permisos: request.session.permisos || [],
            rol: request.session.rol || '',
        });
    });
};
