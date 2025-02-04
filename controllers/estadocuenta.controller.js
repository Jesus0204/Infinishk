const Periodo = require('../models/periodo.model');
const Grupo = require('../models/grupo.model');
const Colegiatura = require('../models/colegiatura.model');
const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const Cursa = require('../models/cursa.model');
const Usuario = require('../models/usuario.model');
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

exports.post_mandar_pago = (request, response, next) => {
    let monto = Number(request.body.monto);
    monto = monto.toFixed(2);
    let matricula = request.body.matricula;
    let id_liquida = request.body.id_liquida;
    let tipo = request.body.tipo_pago;
    let motivo = request.body.motivo;

    const idLiquidaXML = id_liquida !== '' ? `
        <data id="4" display="false">
            <label>ID Liquida</label>
            <value>${id_liquida}</value>
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

    const xml = `
        <P>
            <business>
                <id_company>${process.env.ID_COMPANY}</id_company>
                <id_branch>${process.env.ID_BRANCH}</id_branch>
                <user>${process.env.API_USER}</user>
                <pwd>${process.env.API_PASSWORD}</pwd>
            </business>
            <url>
                <reference>${uuidv4()}</reference>
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

    } else if (tipo_pago === 'Diplomado') {

    } else if (tipo_pago === 'Otros') {
        
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

exports.post_notificacion_pago = async (request, response, next) => {
    try {
        const tipo = "Colegiatura";
        const strResponse = decodeURIComponent("yO3hhCLQmgOr2R6j1WHzb5S5IL5raWDL4zSTFIc6VcZOEGQXi4SFK5EDATyDAHQZalBxRhZDJZ46FAFpltJ95CCo59pYVDqpFjmIcqePs4FiUx3BEcRkrjVeqwUyJUILxtlLBOgm9YbYqT%2F%2Fbe8nYCW8sj%2FOH%2BIvXKcxojy%2BljqlZn4Mqi1dsStM%2FSCQa%2BSFLOJ%2FJXcSuAjhu7i7Sj%2BNxrqB5mAicNlZ3SoZv2z3MULe9MIuyzgYNg6bUC%2BCHMRiujhoUXOs55gts7kAVdEasRiNl0LFWw8neGCB%2FYKWk6n3Xw2moBrIylqGI6yM1p49c2fQBs6FHsGKWtc%2BkP9nbWBy25HtrnWdQmgXbanJV4MoXqivlhrOSkDFi0qYzVzI%2BlhYLGYq6zF23u%2BIhsM4szG1qiMocOymkTrqWU7Ns7WWqCzYYX1N3WUVIzpFiJKKJ4gymbIwbvBel5HKy6ZUDxgvpPLGLl1KfzuhNzYg%2F%2FklGpEDxPmZf9km0exPcSKJQGphpj%2BW8LH3Jo0BqIE6qRW434E6LLbmyGyd8AOHlQX%2BZ2a17VBkTR%2BqDz6Ca%2FEwf0aMaDQIQam5zIrqHzL5xPwQgXl0RH66IUM%2FeSpE4h2PeTPY11qEL7Pvyf5bXbuCGFss4GPT0Mj7OiSq6x%2FgHNWjFiHLzPXqOita%2B1PXQu5VNO2VAjZMCSK6XU1LQELDdo4MUtBB6%2BCU16gz5vc6F%2FSwtllu3tbMB4jNGjk6Y9kvvg%2BoHCWSmI2mX0JHDySajJC23tOHW2vO1D%2B9xsM2k%2BwQ8f9xjKjeIXkA2qoPHlgUfDavufWKTyuGWutGKZCCPvvFRTHJoUxpbMYTZQo%2BArsczE4IYkSIHk2FUVDTfRddpuOuoLdBXJQPSHxIruv4OcvsXQnEuknd06zdGYEgM0eyMWfMaSaWIuKJFzuf9p3mQznV8OXA%2F1aNyCOsh90AvHt%2FOPKOi1xwrQU7d9iiNiufr%2FzE4lp%2FmWY6s6TQbZAAyphkqxfwmeNg6Ogsg9hq48RP%2FwjyFdnZwplF8GBgFARBWhy22d8r8vGWVijbYbRYcBnWNtF1GTmWsET7lEzXJfGODOLSZoEQUn%2Fw2%2BfIl4kPx%2F0ycK7yeXC39zpj04hf3bTFuYchz%2BKjzuvHYeDE");
        
        let key = "5DCC67393750523CD165F17E1EFADD21";
        const responseText = cipher.decifrarAES(strResponse, key);
    
        if (tipo === 'Colegiatura') {

        } else if (tipo === 'Diplomado') {

        } else if (tipo === 'Otros') {

        }
    
        return response.status(200).json({
            success: true,
            respuestaXML: responseText
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            success: false,
            error: 'Error al decifrar la respuesta'
        });
    }
};

exports.get_recibir_pago = async (request, response, next) => {
    return response.status(200).json({
        success: true,
        respuestaXML: 'Recibido'
    });
}

const xml2js = require('xml2js');

exports.post_recibir_pago = async (request, response, next) => {
    return response.status(200).json({
        success: true,
        respuestaXML: 'Recibido'
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

