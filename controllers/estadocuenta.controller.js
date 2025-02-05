const Periodo = require('../models/periodo.model');
const Grupo = require('../models/grupo.model');
const Colegiatura = require('../models/colegiatura.model');
const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const Cursa = require('../models/cursa.model');
const Alumno = require('../models/alumno.model');
const Liquida = require('../models/liquida.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const PagoExtra = require('../models/pago_extra.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

exports.get_pago_alumno = (request, response, next) => {

    // Del input del usuario sacas solo la matricula con el regular expression
    let username = request.session.username;
    Alumno.fetchOne(username)
        .then(([alumno, fieldData]) => {
            Liquida.fetch_Pendientes(username)
                .then(async ([solicitud_otro_pago, fieldData]) => {
                    const [periodoActivo, fieldData_2] = await Periodo.fetchActivo();
                    // Si es estudiante de colegiatura sacas la siguiente información
                    if (username[0] == '1') {
                        const [infoColegiatura, fieldData] = await Colegiatura.fetchColegiaturaActiva(username);
                        let info_Deuda = '';

                        // Si existe sacas la información de la deuda
                        if (infoColegiatura.length != 0) {
                            const [infoDeuda, fieldData_3] = await Deuda.fetchNoPagadas(infoColegiatura[0].IDColegiatura);

                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoDeuda.length; count++) {
                                infoDeuda[count].fechaLimitePago = moment(new Date(infoDeuda[count].fechaLimitePago)).format('LL');
                            }
                            info_Deuda = infoDeuda;
                        };
                        const [totalDeuda, fieldData_4] = await Deuda.fetchDeuda(username);

                        response.render('estadocuenta/realizar_pago', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            solicitudes: solicitud_otro_pago,
                            colegiatura: infoColegiatura,
                            deuda: info_Deuda,
                            totales: totalDeuda,
                            pago_col: true,
                            diplomado: '',
                            pagoDiplomado: '',
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken()
                        })
                        // Si no, es alumno de diplomado
                    } else if (username[0] == '8') {
                        let fechaActual = moment().tz('America/Mexico_City').format('YYYY-MM-DD');
                        // Sacas información del diplomado que estan cursando
                        const [infoDiplomado, fieldData] = await Cursa.fetchDiplomadosCursando(username, fechaActual);
                        let infoPagosDiplomado = '';
                        if (infoDiplomado.length != 0) {
                            // Sacas información de algún pago si es que existe
                            const [infoPagosDipl, fieldData_2] = await Cursa.fetchPagosHechos(username, infoDiplomado[0].IDDiplomado);
                            // Conviertes la fecha si existe
                            for (let count = 0; count < infoPagosDipl.length; count++) {
                                infoPagosDipl[count].fechaPago = moment(new Date(infoPagosDipl[count].fechaPago)).tz('America/Mexico_City').format('LL');
                            }
                            infoPagosDiplomado = infoPagosDipl;
                        }
                        response.render('estadocuenta/realizar_pago', {
                            alumno: alumno,
                            periodo: periodoActivo,
                            solicitudes: solicitud_otro_pago,
                            colegiatura: '',
                            deuda: '',
                            totales: '',
                            pago_col: false,
                            diplomado: infoDiplomado,
                            pagoDiplomado: infoPagosDiplomado,
                            username: request.session.username || '',
                            permisos: request.session.permisos || [],
                            rol: request.session.rol || "",
                            csrfToken: request.csrfToken()
                        })
                    };
                })
                .catch((error) => {
                    response.status(500).render('500', {
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        error_alumno: false
                    });
                    console.log(error)
                });
        })
        .catch((error) => {
            response.status(500).render('500', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                error_alumno: false
            });
            console.log(error);
        });
};

// Importar el archivo con las funciones de cifrado
const cipher = require('../util/cipher');
const axios = require('axios');
const {
    v4: uuidv4
} = require('uuid');

exports.post_mandar_pago = async (request, response, next) => {
    let monto = Number(request.body.monto);
    monto = monto.toFixed(2);
    let matricula = request.body.matricula;
    let id_liquida = request.body.id_liquida;
    let id_diplomado = request.body.id_diplomado;
    let id_deuda = request.body.id_deuda;
    let tipo = request.body.tipo_pago;
    let motivo = request.body.motivo;
    let nota = request.body.nota;

    const idLiquidaXML = id_liquida !== '' ? `
        <data id="4" display="false">
            <label>ID Liquida</label>
            <value>${id_liquida}</value>
        </data>
        <data id="5" display="false">
            <label>Nota</label>
            <value>${nota}</value>
        </data>
    ` : '';

    let tipo_pago = '';
    if (tipo === 'Normal') {
        if (matricula[0] == '1') {
            tipo_pago = 'Colegiatura';
        } else if (matricula[0] == '8') {
            tipo_pago = 'Diplomado';
        }
    } else if (tipo === 'Otro') {
        tipo_pago = 'Otros';
    }

    let idReferencia = uuidv4();
    const xml = `
        <P>
            <business>
                <id_company>${process.env.ID_COMPANY}</id_company>
                <id_branch>${process.env.ID_BRANCH}</id_branch>
                <user>${process.env.API_USER}</user>
                <pwd>${process.env.API_PASSWORD}</pwd>
            </business>
            <url>
                <reference>${idReferencia}</reference>
                <amount>${monto}</amount>
                <moneda>MXN</moneda>
                <canal>W</canal>
                <omitir_notif_default>0</omitir_notif_default>
                <nb_fpago>TCD</nb_fpago>
                <datos_adicionales>
                    <data id="1" display="false">
                        <label>PRINCIPAL</label>
                        <value>${matricula}</value>
                    </data>
                    <data id="2" display="true">
                        <label>Motivo</label>
                        <value>${motivo}</value>
                    </data>
                    <data id="3" display="false">
                        <label>Tipo de Pago</label>
                        <value>${tipo_pago}</value>
                    </data>
                    ${idLiquidaXML}
                </datos_adicionales>
                <version>IntegraWPP</version>
            </url>
        </P>
    `; 

    if (tipo_pago === 'Colegiatura') {
        await Pago.save_pago_tarjeta_web(id_deuda, motivo, monto, nota, 'Tarjeta Web', moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm'), idReferencia);
    } else if (tipo_pago === 'Diplomado') {
        await PagoDiplomado.save_pago_tarjeta_web(matricula, id_diplomado, moment().tz('America/Mexico_City').format('YYYY-MM-DD HH:mm'), monto, motivo, nota, 'Tarjeta Web', idReferencia);
    }

    // Pones todo el xml en un string
    let originalString = xml.toString();

    let key = process.env.CIPHER_KEY;

    // Lo cifras con las funciones del github de documentación
    let cipherText = cipher.cifrarAES(originalString, key);

    // Creas otro xml para hacer el post con el texto cifrado
    let xmlContent = `<pgs><data0>${process.env.DATA0}</data0><data>` + cipherText + "</data></pgs>";

    const params = new URLSearchParams();
    params.append('xml', xmlContent);

    // Haces el post del xml generado
    axios.post(`${process.env.PAGO_URL}`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        withCredentials: true
    }).then(function (xml_response) {
        // Esperas la respuesta cifrada
        let responseText = xml_response.data;
        let decipherText = cipher.decifrarAES(responseText, key);

        return response.status(200).json({
            success: true,
            respuestaXML: decipherText,
            matricula: matricula,
        });
    }).catch((error) => {
        console.log(error);
        return response.status(500).json({
            success: false,
            error: 'Error al generar la liga de pago'
        });
    })
};

const xml2js = require('xml2js');

exports.post_notificacion_pago = async (request, response, next) => {
    try {
        const strResponse = request.body.strResponse;
        
        let key = process.env.CIPHER_KEY;
        const responseText = cipher.decifrarAES(strResponse, key);

        const parser = new xml2js.Parser();

        const result = await parser.parseStringPromise(responseText);

        const payments = result.CENTEROFPAYMENTS;

        console.log(payments);

        const reference = payments.reference[0];
        const responseStatus = payments.response[0];
        const monto = payments.amount[0];

        const datosAdicionales = payments.datos_adicionales[0].data;

        let matricula;
        let tipoPago;
        let idLiquida;
        let nota;

        datosAdicionales.forEach(item => {
            const label = item.label[0];
            const value = item.value[0];

            if (label === 'PRINCIPAL') {
                matricula = value;
            } else if (label === 'Tipo de Pago') {
                tipoPago = value;
            } else if (label === 'ID Liquida') {
                idLiquida = value;
            } else if (label === 'Nota'){
                nota = value;
            }
        });
                
        if (tipoPago === 'Colegiatura') {
            if (responseStatus == 'approved') {
                const time = payments.time[0];
                const date = payments.date[0];

                const combinedDateTime = `${date} ${time}`;
                const formattedFechaPago = moment(combinedDateTime, "DD/MM/YY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

                await Pago.update_estado_pago(formattedFechaPago, monto, reference);

                const [pago_reference] = await Pago.fetchPago_referencia(reference);
                const [IDColegiatura] = await Deuda.fetchColegiatura(pago_reference[0].IDDeuda);

                let monto_float = parseFloat(monto);

                const fecha_body = moment(formattedFechaPago, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD");

                try {
                    const [deudas_noPagadas, fieldData] = await Deuda.fetchNoPagadas(IDColegiatura[0].IDColegiatura);

                    // El monto inicial a usar es lo que el usuario decidió
                    let monto_a_usar = monto_float;

                    for (let deuda of deudas_noPagadas) {
                        if (monto_a_usar <= 0) {
                                break;
                        } 
                        // Convertimos (deuda.montoAPagar - deuda.montoPagado).toFixed(2) a número:
                        else if (parseFloat((deuda.montoAPagar - deuda.montoPagado).toFixed(2)) < monto_a_usar) {
                            // Se guarda el monto de deuda actual 
                            let montoDeudaActual = (deuda.montoAPagar - deuda.montoPagado).toFixed(2); 
                            let recargos = false;
                            // Si se pagó más del monto total y tiene recargos, se quitan los recargos
                            if (moment(fecha_body).isSameOrBefore(moment(deuda.fechaLimitePago), 'day')) {
                                if (deuda.Recargos == 1) {
                                    await Deuda.removeRecargosDeuda(deuda.IDDeuda);
                                    // Aquí es donde se cambia el monto
                                    montoDeudaActual = (deuda.montoSinRecargos - deuda.montoPagado).toFixed(2); 
                                    recargos = true;
                                }
                            }

                            // Como el monto a usar el mayor que la deuda, subes lo que deben a esa deuda
                            await Deuda.update_Deuda(montoDeudaActual, deuda.IDDeuda);
                            await Colegiatura.update_Colegiatura(montoDeudaActual, IDColegiatura[0].IDColegiatura);

                            if (recargos == true) {
                                monto_a_usar = monto_a_usar - parseFloat((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2));
                                continue;
                            }
                        } 
                        // Convertimos (deuda.montoAPagar - deuda.montoPagado).toFixed(2) a número:
                        else if (parseFloat((deuda.montoAPagar - deuda.montoPagado).toFixed(2)) >= monto_a_usar) {
                            // Si se pago el monto total y estuvo a tiempo el pago, se quitan los recargos
                            if (Number((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2)) == Number(monto_a_usar)) {
                                if (moment(fecha_body).isSameOrBefore(moment(deuda.fechaLimitePago), 'day')) {
                                    if (deuda.Recargos == 1) {
                                        await Deuda.removeRecargosDeuda(deuda.IDDeuda);
                                    }
                                }
                            } else if (Number((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2)) < Number(monto_a_usar)) {
                                if (moment(fecha_body).isSameOrBefore(moment(deuda.fechaLimitePago), 'day')) {
                                    // Si tiene recargos, se quitan y se asegura que solo se pague lo de la ficha para que pase para la siguiente
                                    if (deuda.Recargos == 1) {
                                        await Deuda.removeRecargosDeuda(deuda.IDDeuda);

                                        await Deuda.update_Deuda((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2), deuda.IDDeuda);
                                        await Colegiatura.update_Colegiatura((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2), IDColegiatura[0].IDColegiatura);

                                        monto_a_usar = monto_a_usar - parseFloat((deuda.montoSinRecargos - deuda.montoPagado).toFixed(2));
                                        continue;
                                    }
                                }
                            }

                            // Como el monto a usar es menor, se usa monto a usar (lo que resto)
                            await Deuda.update_Deuda(monto_a_usar, deuda.IDDeuda);
                            await Colegiatura.update_Colegiatura(monto_a_usar, IDColegiatura[0].IDColegiatura);
                        }

                        monto_a_usar = monto_a_usar - parseFloat((deuda.montoAPagar - deuda.montoPagado).toFixed(2));
                    }

                    // Si el monto a usar es positivo despues de recorrer las deudas, agregar ese monto a credito
                    if (monto_a_usar > 0) {
                        await Alumno.update_credito(matricula, monto_a_usar);
                    }
                } catch(error) {
                    console.log(error);
                    return response.status(500).json({
                        success: false,
                        error: 'Error al recibir el pago'
                    });
                }
            } else if (responseStatus == 'denied' || responseStatus == 'error') {
                await Pago.update_pago_rechazado(reference);
            }
        } else if (tipoPago === 'Diplomado') {
            if (responseStatus == 'approved') {
                const time = payments.time[0];
                const date = payments.date[0];

                const combinedDateTime = `${date} ${time}`;
                const formattedFechaPago = moment(combinedDateTime, "DD/MM/YY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

                await PagoDiplomado.update_estado_pago(formattedFechaPago, monto, reference);
            } else if (responseStatus == 'denied' || responseStatus == 'error') {
                await PagoDiplomado.update_pago_rechazado(reference);
            }
        } else if (tipoPago === 'Otros') {
            if (responseStatus == 'approved') {
                const time = payments.time[0];
                const date = payments.date[0];

                const combinedDateTime = `${date} ${time}`;
                const formattedFechaPago = moment(combinedDateTime, "DD/MM/YY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");

                await Liquida.update_pago_tarjeta_web_exito(formattedFechaPago,"Tarjeta Web", nota, reference, matricula, idLiquida)
            } else if (responseStatus == 'denied' || responseStatus == 'error') {
                await Liquida.update_pago_tarjeta_web_fallo("Tarjeta Web", nota, reference, matricula, idLiquida)
            }
        }

        return response.status(200).json({
            success: true,
            message: 'Pago recibido'
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            success: false,
            error: 'Error al decifrar la respuesta'
        });
    }
};

exports.get_confirmacion_pago = async (request, response, next) => {
    const {
        nbResponse: responseStatus,
        importe: monto,
        email,
        empresa,
        nbMoneda: tipoMoneda,
        banco,
        marca,
        tpTdc: tipoTarjeta,
        referencia,
        fecha,
        operacion,
        nuAut: numAutorizacion,
        cdResponse,
        nb_adquirente: adquirente
    } = request.query;
    
    const datosPago = {
        responseStatus,
        monto,
        email,
        empresa,
        tipoMoneda,
        banco,
        marca,
        tipoTarjeta,
        referencia,
        fecha,
        operacion,
        numAutorizacion,
        cdResponse,
        adquirente
    };
    
    response.render('estadocuenta/recibir_pago', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken(),
        datosPago
    });
};

exports.get_estado_cuenta = async (request, response, next) => {
    try {

        const now = moment().tz('America/Mexico_City').startOf('day').subtract(1, 'days').format();
        const matricula = request.session.username;
        const [cargosExtra] = await PagoExtra.fetchSinPagar(matricula);
        const [pagosExtra] = await PagoExtra.fetchPagados(matricula);
        const periodo = await Periodo.fetchActivo();
        
        // Formatear fechas
        for (let count = 0; count < pagosExtra.length; count++) {
            pagosExtra[count].fechaPago = moment(pagosExtra[count].fechaPago).tz('America/Mexico_City').format('LL');
        }
        
        if(matricula[0] == '1') {
            
            // Consultas para estudiante
            
            const [pagos] = await Pago.fetchOne(matricula);
            const estudianteProfesional = await EstudianteProfesional.fetchOne(request.session.username);
            const [deuda] = await Deuda.fetchDeudaEstado(matricula);

            const beca = await EstudianteProfesional.fetchBeca(matricula);
            const porcenBeca = beca[0][0].porcBeca;

            const [colegiaturaActual, fieldData] = await Colegiatura.fetchColegiaturaActiva(request.session.username);
            
            let credito;
            if (colegiaturaActual.length != 0) {
                credito = colegiaturaActual[0].creditoColegiatura;
            } else {
                credito = 0;
            }

            const precio = await Grupo.fetchPrecioTotal(matricula, periodo[0][0].IDPeriodo);
            const precioTotal = (precio[0][0].Preciototal);
            
            // Formatear fechas
            for (let count = 0; count < deuda.length; count++){
                deuda[count].fechaLimitePago = moment(deuda[count].fechaLimitePago).format('LL');
            }

            for (let count = 0; count < pagos.length; count++) {
                pagos[count].fechaPago = moment(pagos[count].fechaPago).tz('America/Mexico_City').format('LL');
            }

            response.render('estadocuenta/estado_cuenta', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                csrfToken: request.csrfToken(),
                estudianteProfesional: estudianteProfesional[0][0],
                pagos: pagos,
                periodo: periodo[0][0],
                deuda: deuda,
                porcBeca: porcenBeca,
                credito: Number(credito),
                precioTotal: precioTotal,
                fechaActual: now,
                pagosExtra: cargosExtra,
                pagadosExtra: pagosExtra,
                matricula: matricula,
                rol: request.session.rol || "",
                
            });
        } else if (matricula[0] == '8') {

            let fechaActual = moment().tz('America/Mexico_City').format('YYYY-MM-DD');

            const [pagosDiplomado] = await PagoDiplomado.fetchPagosDiplomado(matricula);
            const [diplomadoCursando] = await Cursa.fetchDiplomadosCursando(matricula, fechaActual);

            // Formatear fechas
            for (let count = 0; count < pagosDiplomado.length; count++) {
                pagosDiplomado[count].fechaPago = moment(pagosDiplomado[count].fechaPago).tz('America/Mexico_City').format('LL');
            }

            for (let count = 0; count < diplomadoCursando.length; count++) {
                diplomadoCursando[count].fechaInicio = moment(diplomadoCursando[count].fechaInicio).format('LL');
            }

            for (let count = 0; count < diplomadoCursando.length; count++) {
                diplomadoCursando[count].fechaFin = moment(diplomadoCursando[count].fechaFin).format('LL');
            }

            response.render('estadocuenta/estado_cuenta', {
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                csrfToken: request.csrfToken(),
                pagosExtra: cargosExtra,
                periodo: periodo[0][0],
                pagadosExtra: pagosExtra,
                fechaActual: now,
                matricula: matricula,
                diplomados: diplomadoCursando,
                rol: request.session.rol || "",
                pagosDiplomado: pagosDiplomado,
                
            });
        }
    } catch (error) {
        console.log(error);
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
    }
}

