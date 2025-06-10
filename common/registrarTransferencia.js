const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const Pago_Extra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');
const Colegiatura = require('../models/colegiatura.model');
const moment = require('moment-timezone');
moment.locale('es-mx');

async function registrarTransferencia({
    matricula, importe, tipoPago, fecha, nota
  }) {

    let success = true;
    let mensajeError = '';
    let deudaEstudiante = 0;

    try {
        if (tipoPago === 'Pago de Colegiatura') {
            const deuda = await Deuda.fetchDeuda(matricula);
            const idDeuda = await Deuda.fetchIDDeuda(matricula);

            // Verificar si idDeuda está definido
            if (!idDeuda || !idDeuda[0] || !idDeuda[0][0] || !idDeuda[0][0].IDDeuda) {
                success = false;
                mensajeError = 'Este alumno ya no tiene una deuda, por lo que no se puede registrar un pago de Colegiatura.'
                return { success, message: mensajeError, deudaEstudiante };
            }

            const colegiatura = await Deuda.fetchColegiatura(idDeuda[0][0].IDDeuda);
            const idColegiatura = colegiatura[0][0].IDColegiatura;

            if (typeof deuda[0]?.[0]?.montoAPagar === 'undefined') {
                success = false;
                mensajeError = 'Este alumno ya no tiene una deuda, por lo que no se puede registrar un pago de Colegiatura.';
                return { success, message: mensajeError, deudaEstudiante };
            }

            await Deuda.fetchNoPagadas(idColegiatura)
                .then(async ([deudas_noPagadas, fieldData]) => {
                    await Pago.save_transferencia(deudas_noPagadas[0].IDDeuda, importe, nota, fecha);

                    let monto_a_usar = parseFloat(importe);
                    for (let deuda of deudas_noPagadas) {
                        if (monto_a_usar <= 0) {
                            break;
                        } else if (parseFloat((deuda.montoAPagar - deuda.montoPagado).toFixed(2)) < monto_a_usar) {
                            // Se guarda el monto de deuda actual 
                            let montoDeudaActual = (deuda.montoAPagar - deuda.montoPagado).toFixed(2); 
                            let recargos = false;
                            // Si se pagó más del monto total y tiene recargos, se quitan los recargos
                            if (moment(fecha).isSameOrBefore(moment(deuda.fechaLimitePago), 'day')) {
                                if (deuda.Recargos == 1) {
                                    Deuda.removeRecargosDeuda(deuda.IDDeuda);
                                    // Aquí es donde se cambia el monto
                                    montoDeudaActual = (deuda.montoSinRecargos - deuda.montoPagado).toFixed(2); 
                                    recargos = true;
                                }
                            }

                            // Como el monto a usar el mayor que la deuda, subes lo que deben a esa deuda
                            await Deuda.update_Deuda(montoDeudaActual, deuda.IDDeuda);
                            await Colegiatura.update_Colegiatura(montoDeudaActual, idColegiatura);

                            if (recargos == true) {
                                monto_a_usar = monto_a_usar - parseFloat((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2));
                                continue;
                            }
                            
                        } else if (parseFloat((deuda.montoAPagar - deuda.montoPagado).toFixed(2)) >= monto_a_usar) {
                            // Si se pago el monto total y estuvo a tiempo el pago, se quitan los recargos
                            if (Number((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2)) == Number(monto_a_usar)) {
                                if (moment(fecha).isSameOrBefore(moment(deuda.fechaLimitePago), 'day')) {
                                    if (deuda.Recargos == 1) {
                                        Deuda.removeRecargosDeuda(deuda.IDDeuda);
                                    }
                                }
                            } else if ((Number((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2)) - Number(monto_a_usar)) <= 10) {
                                if (moment(fecha).isSameOrBefore(moment(deuda.fechaLimitePago), 'day')) {
                                    if (deuda.Recargos == 1) {
                                        Deuda.removeRecargosDeuda(deuda.IDDeuda);
                                    }
                                }
                            } else if (Number((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2)) < Number(monto_a_usar)) {
                                if (moment(fecha).isSameOrBefore(moment(deuda.fechaLimitePago), 'day')) {
                                    // Si tiene recargos, se quitan y se asegura que solo se pague lo de la ficha para que pase para la siguiente
                                    if (deuda.Recargos == 1) {
                                        Deuda.removeRecargosDeuda(deuda.IDDeuda);

                                        await Deuda.update_Deuda((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2), deuda.IDDeuda);
                                        await Colegiatura.update_Colegiatura((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2), idColegiatura);

                                        monto_a_usar = monto_a_usar - parseFloat((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2));
                                        continue;
                                    }
                                }
                            }

                            await Deuda.update_Deuda(monto_a_usar, deuda.IDDeuda);
                            await Colegiatura.update_Colegiatura(monto_a_usar, idColegiatura);
                        }

                        monto_a_usar = monto_a_usar - parseFloat((deuda.montoAPagar - deuda.montoPagado).toFixed(2));
                    }

                    if (monto_a_usar > 0) {
                        await Alumno.update_credito(matricula, monto_a_usar);
                    }

                    deudaEstudiante = monto_a_usar;
                })
                .catch(error => {
                    success = false;
                    mensajeError = 'Error al procesar el pago de colegiatura';
                    console.error(error);
                });
        }
        else if (tipoPago === 'Pago de Diplomado') {
            const idDiplomado = await Cursa.fetchDiplomadosCursando(matricula);
            
            if (!idDiplomado || !idDiplomado[0] || !idDiplomado[0][0] || !idDiplomado[0][0].IDDiplomado) {
                success = false;
                mensajeError = 'No se pudo encontrar el Diplomado asociado al alumno.';
                return { success, message: mensajeError, deudaEstudiante };
            }

            await PagoDiplomado.save_transferencia(matricula, idDiplomado[0][0].IDDiplomado, fecha, importe, nota)
                .catch(error => {
                    success = false;
                    mensajeError = 'Error al registrar el pago del diplomado';
                    console.error(error);
                });
        }
        else if (tipoPago === 'Pago Extra') {
            const idLiquida = await Liquida.fetchID(matricula);

            if (idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined') {
                const idPagoExtra = await Pago_Extra.fetchID(importe);
                if (idPagoExtra[0] && idPagoExtra[0][0] && typeof idPagoExtra[0][0].IDPagosExtras !== 'undefined') {
                    await Liquida.update_transferencia(nota, fecha, idLiquida[0][0].IDLiquida);
                } else {
                    success = false;
                    mensajeError = 'No se pudo encontrar el pago extra.';
                    return { success, message: mensajeError, deudaEstudiante };
                }
            } else {
                const idPagoExtra = await Pago_Extra.fetchID(importe);
                if (idPagoExtra[0] && idPagoExtra[0][0] && typeof idPagoExtra[0][0].IDPagosExtras !== 'undefined') {
                    await Liquida.save_transferencia(matricula, idPagoExtra[0][0].IDPagosExtras, fecha, nota);
                } else {
                    success = false;
                    mensajeError = 'No se pudo encontrar el pago extra.';
                    return { success, message: mensajeError, deudaEstudiante };
                }
            }
        }
    
      } catch (err) {
        console.error(error);
        return { success: false, message: 'Error inesperado en el servicio de pagos.', deudaEstudiante };
      }    

    return { success, message: mensajeError, deudaEstudiante };
}

module.exports = { registrarTransferencia };