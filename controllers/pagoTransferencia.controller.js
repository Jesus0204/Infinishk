const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Alumno = require('../models/alumno.model');

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
        const currentYear = moment().format('YYYY');
        const fechaCompleta = moment(rawFecha + `-${currentYear}`, 'DD-MMM-YYYY');

        if (fechaCompleta.isValid()) {
            fechaFormato = fechaCompleta.format('D/M/YYYY');
        } else {
            console.error('Fecha inválida:', rawFecha);
        }

        const monto = Monto ? parseFloat(Monto.trim().replace(/[$,]/g, '')) : 0;

        filas.push({ fechaFormato, monto, ReferenciaAlum, Matricula, inicioRef, Metodo, Nota });
    });

    parser.on('end', async () => {
        const resultados = [];
        
        for (const fila of filas) {
            const matricula = fila.Matricula;
            let tipoPago;
            let nombre = '', apellidos = '';

            if (fila.inicioRef === '1') tipoPago = 'Pago de Colegiatura';
            else if (fila.inicioRef === '8') tipoPago = 'Pago de Diplomado';
            else tipoPago = 'Pago a Registrar';

            const fechaISO = moment(fila.fechaFormato, 'D/M/YYYY').format('YYYY-MM-DD');

            const pagoCompleto = await Pago.fetch_fecha_pago(fechaISO, fila.monto, matricula);
            const pagoValido = pagoCompleto?.[0]?.[0];

            const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fechaISO, matricula);
            const pagoDiplomadoValido = pagoDiplomadoCompleto?.[0]?.[0];
            
            const nombreRows = await Alumno.fetchNombre(matricula);
            if (nombreRows?.[0]?.[0]) {
                nombre = nombreRows[0][0].Nombre;
                apellidos = nombreRows[0][0].Apellidos;
            }

            if (!pagoValido && !pagoDiplomadoValido) {
                const resultado = await registrarTransferencia({
                    matricula:  fila.Matricula,
                    importe:    fila.monto,
                    tipoPago,
                    fecha:      fechaISO,
                    nota:       fila.Nota
                  });

                  resultados.push({
                      ...fila,
                      tipoPago,
                      nombre:          nombre,
                      apellidos:       apellidos,
                      deudaEstudiante: resultado.deudaEstudiante,
                      resultadoPago:   resultado.success ? 'Registrado correctamente' : resultado.message
                    });
            } else {
                resultados.push({
                    ...fila,
                    tipoPago,
                    nombre:          nombre,
                    apellidos:       apellidos,
                    deudaEstudiante: 0,
                    resultadoPago:   'Pago ya registrado'
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
