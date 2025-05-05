const moment = require('moment');
const csvParser = require('csv-parser');
const stream = require('stream');
const Alumno = require('../models/alumno.model');
const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const Liquida = require('../models/liquida.model');
const PagoDiplomado = require('../models/pagadiplomado.model');

exports.subirYRegistrarTransferencia = async (request, response, next) => {
    if (!request.file) {
        return response.status(400).send('No se subió ningún archivo.');
    }

    const fileBuffer = request.file.buffer;
    const fileStream = new stream.Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    const parser = fileStream.pipe(csvParser());
    const filas = [];

    parser.on('data', (data) => {
        const { Fecha, Hora, Monto, Referencia, Metodo, Nota } = data;
        const rawFecha = Fecha.replace(/['"]+/g, '');
        const ReferenciaAlum = Referencia.substring(0, 7);
        const Matricula = Referencia.substring(0, 6);
        const inicioRef = Referencia.substring(0, 1);
        const dia = rawFecha.substring(0, 2);
        const mes = rawFecha.substring(2, 4);
        const anio = rawFecha.substring(4, 8);
        const fechaFormato = `${anio}-${mes}-${dia}`;

        filas.push({
            fechaFormato,
            Hora,
            Monto: parseFloat(Monto),
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

            if (fila.inicioRef === '1' || fila.inicioRef === '8') {
                const nombreCompleto = await Alumno.fetchNombre(matricula);
                if (nombreCompleto?.[0]?.[0]?.Nombre) {
                    nombre = nombreCompleto[0][0].Nombre;
                    apellidos = nombreCompleto[0][0].Apellidos;
                } else {
                    tipoPago = "Pago no Reconocido";
                }
            }

            if (fila.inicioRef === '1') {
                const deuda = await Deuda.fetchDeuda(matricula);
                const deudaPagada = await Deuda.fetchDeudaPagada(matricula);
                const idLiquida = await Liquida.fetchIDPagado(matricula, fila.fechaFormato);
                const pagoCompleto = await Pago.fetch_fecha_pago(fila.fechaFormato, fila.Importe);

                montoAPagar = deuda?.[0]?.[0]?.montoAPagar !== undefined ?
                    Number(deuda[0][0].montoAPagar.toFixed(2)) :
                    Number(deudaPagada?.[0]?.[0]?.montoAPagar?.toFixed(2) || 0);

                const pagoValido = pagoCompleto?.[0]?.[0];
                if (pagoValido) {
                    const fechaFormateada = moment(new Date(pagoValido.fechaPago)).format('YYYY-MM-DD');
                    if (Math.round(pagoValido.montoPagado * 100) / 100 === Math.round(fila.Importe * 100) / 100 &&
                        fechaFormateada === fila.fechaFormato &&
                        pagoValido.matricula === matricula) {
                        tipoPago = 'Pago Completo';
                        deudaEstudiante = 0;
                    }
                }

                if (idLiquida?.[0]?.[0]?.IDLiquida) {
                    tipoPago = 'Pago Completo';
                    deudaEstudiante = 0;
                }

                if (fila.Importe === montoAPagar && tipoPago !== 'Pago Completo') {
                    tipoPago = 'Pago de Colegiatura';
                    deudaEstudiante = montoAPagar;
                } else if (!tipoPago) {
                    tipoPago = 'Pago a Registrar';
                    deudaEstudiante = montoAPagar;
                }

            } else if (fila.inicioRef === '8') {
                const idLiquidaPagada = await Liquida.fetchIDPagado(matricula, fila.fechaFormato);
                const pagoDiplomadoCompleto = await PagoDiplomado.fetch_fecha_pago(fila.fechaFormato);

                const pagoValido = pagoDiplomadoCompleto?.[0]?.[0];
                if (pagoValido) {
                    const fechaFormateada = moment(new Date(pagoValido.fechaPago)).format('YYYY-MM-DD HH:mm');
                    if (Math.round(pagoValido.montoPagado * 100) / 100 === Math.round(fila.Importe * 100) / 100) {
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

            // REGISTRO AUTOMÁTICO OPCIONAL SOLO PARA CIERTOS TIPOS DE PAGO
            if (tipoPago === 'Pago de Colegiatura') {
                try {
                    const deuda = await Deuda.fetchDeuda(matricula);
                    const idDeuda = await Deuda.fetchIDDeuda(matricula);
                    const idDeudaValida = idDeuda?.[0]?.[0]?.IDDeuda;

                    if (!idDeudaValida) continue;

                    const colegiatura = await Deuda.fetchColegiatura(idDeudaValida);
                    const idColegiatura = colegiatura?.[0]?.[0]?.IDColegiatura;

                    const deudasNoPagadas = await Deuda.fetchNoPagadas(idColegiatura);
                    await Pago.save_transferencia(deudasNoPagadas[0].IDDeuda, fila.Importe, '', fila.fechaFormato);

                    let montoAUsar = fila.Importe;
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

        response.render('pago/registro_transferencia', {
            subir: false,
            error: false,
            revisar: true,
            datos: resultados,
            csrfToken: request.csrfToken(),
            permisos: request.session.permisos || [],
            rol: request.session.rol || '',
        });
    });
};
