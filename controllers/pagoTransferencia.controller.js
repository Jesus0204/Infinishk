const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Alumno = require('../models/alumno.model');
const Deuda = require('../models/deuda.model');
const Cursa = require('../models/cursa.model'); // agregado si no lo tenías

const csvParser = require('csv-parser');
const fs = require('fs');
const stream = require('stream');
const moment = require('moment-timezone');
moment.locale('es-mx');

const { registrarTransferencia } = require('../common/registrarTransferencia');

exports.get_pagos_transferencias = (request, response, next) => {
    console.log("Renderizando vista inicial de pagos por transferencia...");
    response.render('pago/pago_transferencia', {
        pagosSubidos: null,
        csrfToken: request.csrfToken(),
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || '',
    });
};

exports.subirYRegistrarTransferencia = async (request, response, next) => {
    console.log("=== INICIO subirYRegistrarTransferencia ===");

    if (!request.file) {
        console.warn("⚠️ No se subió ningún archivo");
        return response.status(400).send('No se subió ningún archivo.');
    }

    console.log("📄 Archivo recibido:", request.file.originalname);
    console.log("📏 Tamaño:", request.file.size, "bytes");

    const fileBuffer = request.file.buffer;
    const contenido = fileBuffer.toString('utf8');
    const lineas = contenido.split('\n').slice(5); // quitar encabezados
    console.log(`📊 Total de líneas después de encabezado: ${lineas.length}`);

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
        const rawFecha = (Fecha || '').trim();
        const referenciaLimpia = (Referencia || '').replace(/\s+/g, '');
        const ReferenciaAlum = referenciaLimpia.substring(0, 7); // referencia completa
        const Matricula = referenciaLimpia.substring(0, 6); // matrícula
        const inicioRef = referenciaLimpia.substring(0, 1);

        // CSV: DD/MM/YYYY
        const fechaCompleta = moment(rawFecha, 'DD/MM/YYYY', true);

        const fechaFormato = fechaCompleta.isValid()
            ? fechaCompleta.format('D/M/YYYY')
            : '';
        const monto = Monto
        ? parseFloat(parseFloat(Monto.trim().replace(/[$,]/g, '')).toFixed(2))
        : 0;

        console.log("📥 Fila CSV:", { Fecha, Monto, Referencia, Metodo, Nota });
        console.log("➡️ Procesada como:", { fechaFormato, monto, ReferenciaAlum, Matricula, inicioRef });

        filas.push({ fechaFormato, monto, ReferenciaAlum, Matricula, inicioRef, Metodo, Nota });
    });

    parser.on('end', async () => {
        console.log("✅ Lectura CSV completada. Filas procesadas:", filas.length);
        const resultados = [];

        for (const [index, fila] of filas.entries()) {
            console.log(`\n=== 🔍 Fila ${index + 1}/${filas.length} ===`);
            console.log(fila);

            const matricula = fila.Matricula;
            const referenciaArchivo = fila.ReferenciaAlum;
            let tipoPago;
            let nombre = '', apellidos = '', referenciaAlumno = '';
            let noReconocido = false;
            let errorMessage = '';
            let deudaEstudiante = 0;

            // Determinar tipo de pago
            if (fila.inicioRef === '1') tipoPago = 'Pago de Colegiatura';
            else if (fila.inicioRef === '8') tipoPago = 'Pago de Diplomado';
            else tipoPago = 'Pago a Registrar';
            console.log("🏷️ Tipo de pago detectado:", tipoPago);

            const fechaISO = moment(fila.fechaFormato, 'D/M/YYYY').format('YYYY-MM-DD');
            console.log("📅 Fecha ISO:", fechaISO);

            // Buscar alumno
            console.log("👤 Buscando alumno por matrícula:", matricula);
            const nombreRows = await Alumno.fetchNombre(matricula);

            if (nombreRows?.[0]?.[0]) {
                nombre = nombreRows[0][0].Nombre;
                apellidos = nombreRows[0][0].Apellidos;
                referenciaAlumno = nombreRows[0][0].referenciaBancaria?.trim() || '';
                console.log(`✅ Alumno encontrado: ${nombre} ${apellidos} | Ref BD: ${referenciaAlumno}`);

                // Validar coincidencia exacta de referencia
                if (referenciaAlumno !== referenciaArchivo) {
                    noReconocido = true;
                    errorMessage = `Referencia no coincide (archivo: ${referenciaArchivo} ≠ BD: ${referenciaAlumno})`;
                }
            } else {
                noReconocido = true;
                errorMessage = 'Alumno no reconocido';
            }

            // Verificar si el pago ya existe
            const pagoCompleto = await Pago.fetch_fecha_pago(fechaISO, fila.monto, fila.Nota, matricula);
            const pagoValido = pagoCompleto?.[0]?.[0];
            const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fechaISO, matricula, fila.Nota, fila.monto);
            const pagoDiplomadoValido = pagoDiplomadoCompleto?.[0]?.[0];
            console.log("🔎 Pago existente (colegiatura):", !!pagoValido);
            console.log("🔎 Pago existente (diplomado):", !!pagoDiplomadoValido);

            if (!pagoValido && !pagoDiplomadoValido && !noReconocido) {
                console.log("🧾 Intentando registrar pago nuevo...");
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
                            resultado = await PagoDiplomado.save_transferencia(
                                matricula,
                                idDiplomado[0][0].IDDiplomado,
                                fechaISO,
                                fila.monto,
                                fila.Nota
                            );
                        }
                    } else {
                        resultado.success = true;
                        resultado.message = 'Pago a registrar manualmente';
                    }
                } catch (err) {
                    noReconocido = true;
                    errorMessage = err.message || 'Error al registrar pago';
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
                if (!noReconocido && tipoPago === 'Pago de Colegiatura') {
                    const deudaPendiente = await Deuda.fetchDeuda(matricula);
                    deudaEstudiante = deudaPendiente?.[0]?.reduce((total, row) =>
                        total + parseFloat(row.montoAPagar), 0) || 0;
                }
                resultados.push({
                    ...fila,
                    tipoPago,
                    nombre,
                    apellidos,
                    noReconocido,
                    deudaEstudiante,
                    resultadoPago: noReconocido ? 'Nuevo-Error' : 'Registrado',
                    errorMessage: noReconocido ? errorMessage : '',
                    yaRegistrado: pagoValido || pagoDiplomadoValido
                });
            }

            // ✅ Mostrar solo errores que NO sean “Alumno no reconocido”
            if (noReconocido && errorMessage !== "Alumno no reconocido") {
                console.warn(`⚠️ [${matricula}] ${errorMessage}`);
            }
        }

        console.log("\n=== ✅ PROCESAMIENTO FINALIZADO ===");
        console.table(resultados.map(r => ({
            Matricula: r.Matricula,
            RefArchivo: r.ReferenciaAlum,
            RefAlumno: r.errorMessage.includes('Referencia no coincide') ? '⚠️' : 'OK',
            Tipo: r.tipoPago,
            Monto: r.monto,
            Resultado: r.resultadoPago,
            Error: r.errorMessage
        })));

        response.render('pago/pago_transferencia', {
            pagosSubidos: resultados,
            csrfToken: request.csrfToken(),
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || '',
        });
    });
};
