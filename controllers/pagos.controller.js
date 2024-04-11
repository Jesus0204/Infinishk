const Deuda = require('../models/deuda.model');
const Pago = require('../models/pago.model');
const pagoDiplomado = require('../models/pagadiplomado.model');
const pagoExtra = require('../models/pago_extra.model');
const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Cursa = require('../models/cursa.model');

const csvParser = require('csv-parser');
const fs = require('fs');
const upload = multer({
    dest: 'uploads/'
});

exports.get_pago = (request,response,next) => {
    response.render('pago/pago', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    });
};

exports.get_registro_transferencias = (request,response,next) => {
    response.render('pago/registro_transferencia',{
        subir:true,
        revisar:false,
        resultado:false,
    });
};

exports.post_subir_archivo = upload.single('archivo'), async (request, response, next) => {
    const filas = [];
    fs.createReadStream(request.file.path)
        .pipe(csvParser())
        .on('data', (data) => {
            const {
                Fecha,
                Hora,
                Importe,
                Concepto
            } = data;
            const Referencia = Concepto.substring(0, 7);
            const Matricula = Concepto.substring(0, 6);
            filas.push({
                Fecha,
                Hora,
                Importe,
                Concepto: Matricula,
                Concepto: Referencia
            });
        })
        .on('end', async () => {
            const resultados = [];
            for (const fila of filas) {

                let nombre = ''
                let apellidos = ''
                let deudaEstudiante = 0;

                if(fila.inicioRef === '1' || fila.inicioRef === "8"){
                    const nombreCompleto = await Alumno.fetchNombre(fila.Matricula);
                    nombre = String(nombreCompleto[0][0].Nombre);
                    apellidos = String(nombreCompleto[0][0].Apellidos);
                }
                else{
                    nombre = ''
                    apellidos = ''
                }
                let tipoPago = '';

                if (fila.inicioRef =='1') 
                {
                    const idLiquida = await Liquida.fetchID(fila.Matricula);
                    const pagadoLiquida = await Liquida.fetchStatus(fila.Matricula);
                    const deuda = await Deuda.fetchDeuda(fila.Matricula);
                    const montoAPagar = Number(deuda[0][0].montoAPagar.toFixed(2));
                    const estado = await Deuda.fetchEstado(fila.Matricula);
                    const pagado = (estado[0][0].Pagado);
    
                    if(idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined' && pagadoLiquida[0][0].Pagado === 1){
                        tipoPago = 'Pago Completo';
                    }

                    else if(fila.Importe == montoAPagar){
                        if(pagado === 0){
                            tipoPago = 'Pago de Colegiatura';
                            deudaEstudiante = montoAPagar;
                        }
                        else{
                            tipoPago = 'Pago Completo'
                        }
                    }

                    else
                    {
                        tipoPago = 'Pago a Registrar';
                        deudaEstudiante = montoAPagar;
                    }
                } 
                else if (fila.inicioRef=='8') 
                {
                    const idLiquida = await Liquida.fetchID(fila.Matricula);
                    const pagadoLiquida = await Liquida.fetchStatus(fila.Matricula);
    
                    if(idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined' && pagadoLiquida[0][0].Pagado === 1){
                        tipoPago = 'Pago Completo';
                    }

                    else{

                        tipoPago = 'Pago de Diplomado';
                    }
                }
                else if (fila.inicioRef='A')
                {
                    tipoPago = 'Pago a Ignorar';
                }
                resultados.push({
                    ...fila,
                    TipoPago: tipoPago
                });
            }
            response.render('pago/registro_transferencia', {
                subir: false,
                revisar: true,
                datos: resultados
            });
        });
};

const Liquida = require('../models/liquida.model');
const Alumno = require('../models/alumno.model');
const Pago_Extra = require('../models/pago_extra.model');

exports.get_registrar_solicitud = (request, response, next) => {
    response.render('fetch_alumno', {
        pago_manual: false,
        solicitud_pago: true
    });
};

exports.post_fetch_registrar_solicitud = (request, response, next) => {
    // Del input del usuario sacas solo la matricula con el regular expression
    let matches = request.body.buscar.match(/(\d+)/);
    Alumno.fetchOne(matches[0])
        .then(([alumno, fieldData]) => {
            Pago_Extra.fetchAll()
                .then(([pagos_extra, fieldData]) => {
                    response.render('pago/registrar_solicitud', {
                        alumno: alumno,
                        pagos_extra: pagos_extra
                    })
                })
                .catch((error) => {
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error)
        });
};

exports.post_registrar_solicitud = (request, response, next) => {
    const solicitud_pago = new Liquida(request.body.matricula, request.body.pago);

    solicitud_pago.save()
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/solicitudes');
        })
        .catch((error) => {
            console.log(error)
        });
};
exports.post_registrar_transferencia = async (request, response, next) => {
        const pagosRegistrar = [];
        const nombre = request.body.nombre;
        const matricula = request.body.matricula;
        const referencia = request.body.referencia;
        const importe = request.body.importe;
        const deuda = request.body.deuda;
        const tipoPago = request.body.tipoPago;
        const fecha = request.body.fecha;
        const nota = request.body.nota;
        if(tipoPago === 'Pago de Colegiatura'){
             const idDeuda = await Deuda.fetchIDDeuda(matricula);
             Pago.save_transferencia(idDeuda[0][0].IDDeuda,importe,nota,fecha);
        }
        else if(tipoPago === 'Pago de Diplomado'){
             const idDiplomado = await Cursa.fetchDiplomado(matricula);
             pagoDiplomado.save_transferencia(matricula,idDiplomado[0][0].IDDiplomado,fecha,importe,nota);
        }
        else if(tipoPago === 'Pago a Registrar'){
            pagosRegistrar.push({nombre,matricula,referencia,importe,deuda,tipoPago,fecha});
        }
        else if(tipoPago === 'Pago Extra'){
            const idLiquida = await Liquida.fetchID(matricula);
            if(idLiquida[0] && idLiquida[0][0] && typeof idLiquida[0][0].IDLiquida !== 'undefined'){
                Liquida.update_transferencia(nota,fecha,idLiquida[0][0].IDLiquida)
            }
            else{
                const idPagoExtra = await pagoExtra.fetchID(importe);
                Liquida.save_transferencia(matricula,idPagoExtra[0][0].IDPagosExtras,fecha,nota);
            }
        }
        
        response.json({sucess: true});
}
exports.get_autocomplete = (request, response, next) => {
    
    if (request.params && request.params.valor_busqueda) {
        let matricula = ' ';
        let nombre = ' ';
        // Con la regular expression sacas toda la matricula
        let matches_matricula = request.params.valor_busqueda.match(/(\d+)/);
        // Y con esta sacas el texto para manejar todo tipo de busqueda
        let matches_nombre = request.params.valor_busqueda.replace(/[0-9]/g, '');

        if (matches_matricula && matches_nombre != '') {
            matricula = matches_matricula[0];
            nombre = matches_nombre.trim();

            Alumno.fetch_both(matricula, nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                })
        } else if (matches_matricula) {
            matricula = matches_matricula[0];

            Alumno.fetch(matricula)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos,
                    });
                })
                .catch((error) => {
                    console.log(error)
                });
        } else if (matches_nombre != '') {
            nombre = matches_nombre;

            Alumno.fetch(nombre)
                .then(([alumnos, fieldData]) => {
                    return response.status(200).json({
                        alumnos: alumnos
                    });
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
};