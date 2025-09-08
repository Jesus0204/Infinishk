const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Alumno = require('../models/alumno.model');
const Deuda = require('../models/deuda.model');


const csvParser = require('csv-parser');
const fs = require('fs');
const stream = require('stream');
const moment = require('moment-timezone');
moment.locale('es-mx');

const { registrarTransferencia } = require('../common/registrarTransferencia');

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
        for (const key in data) cleanedData[key.trim()] = data[key];

        const { Fecha, Monto, Referencia, Metodo, Nota } = cleanedData;
        const rawFecha = Fecha.trim();
        const referenciaLimpia = Referencia.replace(/\s+/g, '');
        const ReferenciaAlum = referenciaLimpia.substring(0, 7);
        const Matricula = referenciaLimpia.substring(0, 6);
        const inicioRef = referenciaLimpia.substring(0, 1);
        const currentYear = moment().format('YYYY');
        const fechaCompleta = moment(rawFecha + `-${currentYear}`, 'DD-MMM-YYYY');
        const fechaFormato = fechaCompleta.isValid() ? fechaCompleta.format('D/M/YYYY') : '';

        const monto = Monto
        ? parseFloat(parseFloat(Monto.trim().replace(/[$,]/g, '')).toFixed(2))
        : 0;

        filas.push({ fechaFormato, monto, ReferenciaAlum, Matricula, inicioRef, Metodo, Nota });
    });

    parser.on('end', async () => {
        const resultados = [];

        for (const fila of filas) {
            const matricula = fila.Matricula;
            let tipoPago;
            let nombre = '', apellidos = '';
            let noReconocido = false;
            let errorMessage = '';
            let deudaEstudiante = 0;

            if (fila.inicioRef === '1') tipoPago = 'Pago de Colegiatura';
            else if (fila.inicioRef === '8') tipoPago = 'Pago de Diplomado';
            else tipoPago = 'Pago a Registrar';

            const fechaISO = moment(fila.fechaFormato, 'D/M/YYYY').format('YYYY-MM-DD');

            // Verificar si el pago ya existe
            const pagoCompleto = await Pago.fetch_fecha_pago(fechaISO, fila.monto, matricula);
            const pagoValido = pagoCompleto?.[0]?.[0];

            if (matricula == '100698' || matricula == '100646') {
                console.log(pagoValido);
                console.log("fechaISO: " + fechaISO);
                console.log("monto: " + fila.monto);
            }

            const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fechaISO, matricula);
            const pagoDiplomadoValido = pagoDiplomadoCompleto?.[0]?.[0];

            // Buscar nombre del alumno
            const nombreRows = await Alumno.fetchNombre(matricula);
            if (nombreRows?.[0]?.[0]) {
                nombre = nombreRows[0][0].Nombre;
                apellidos = nombreRows[0][0].Apellidos;
            } else {
                noReconocido = true;
                errorMessage = 'Alumno no reconocido';
            }

            // Registrar el pago solo si no está registrado y el alumno es reconocido
            if (!pagoValido && !pagoDiplomadoValido && !noReconocido) {
                let resultado = { success: false, message: '' };

                try {
                    if (tipoPago === 'Pago de Colegiatura') {
                        const deudaRows = await Deuda.fetchDeuda(matricula);
                        const idDeudaRows = await Deuda.fetchIDDeuda(matricula);

                        if (!idDeudaRows?.[0]?.[0]?.IDDeuda || !deudaRows?.[0]?.[0] || typeof deudaRows[0][0].montoAPagar === 'undefined') {
                            noReconocido = true;
                            errorMessage = 'No hay deuda activa';
                        } else {
                            resultado = await registrarTransferencia({
                                matricula,
                                importe: fila.monto,
                                tipoPago,
                                fecha: fechaISO,
                                nota: fila.Nota
                            });
                            deudaEstudiante = resultado.deudaEstudiante || 0;
                        }
                    } else if (tipoPago === 'Pago de Diplomado') {
                        const idDiplomado = await Cursa.fetchDiplomadosCursando(matricula);
                        if (!idDiplomado?.[0]?.[0]?.IDDiplomado) {
                            noReconocido = true;
                            errorMessage = 'Diplomado no encontrado';
                        } else {
                            resultado = await PagoDiplomado.save_transferencia(matricula, idDiplomado[0][0].IDDiplomado, fechaISO, fila.monto, fila.Nota);
                        }
                    } else {
                        resultado.success = true;
                        resultado.message = 'Pago a registrar manualmente';
                    }
                } catch (err) {
                    noReconocido = true;
                    errorMessage = err.message || 'Error al registrar pago';
                    console.error(err);
                }

                resultados.push({
                    ...fila,
                    tipoPago,
                    nombre,
                    apellidos,
                    noReconocido,
                    deudaEstudiante,
                    resultadoPago: noReconocido ? 'Nuevo-Error' : 'Nuevo-Registrado',
                    errorMessage: noReconocido ? errorMessage : '',
                    yaRegistrado: false
                });

            } else {
                resultados.push({
                    ...fila,
                    tipoPago,
                    nombre,
                    apellidos,
                    noReconocido,
                    deudaEstudiante: 0,
                    resultadoPago: noReconocido ? 'Nuevo-Error' : 'Registrado',
                    errorMessage: noReconocido ? errorMessage : '',
                    yaRegistrado: pagoValido || pagoDiplomadoValido
                });
            }
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
