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

const Pago_Extra = require('../models/pago_extra.model');

exports.get__registrar_pago_extra = (request, response, next) => {
    response.render('pago/registrar_pago_extra');
};

exports.post_registrar_pago_extra = (request, response, next) => {
    const pago_extra = new Pago_Extra(request.body.motivo, request.body.monto);

    pago_extra.save()
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/pagos_extra');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_pago_extra = (request, response, next) => {
    Pago_Extra.fetchAll()
        .then(([pagosExtra, fieldData]) => {
            Pago_Extra.fetchNoAsignados()
                .then(([pagosExtraNoAsignados, fieldData]) => {
                    response.render('pago/pagos_extra', {
                        pagosNoAsignados: pagosExtraNoAsignados,
                        pagos: pagosExtra
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.post_pago_extra_modify = (request, response, next) => {
    Pago_Extra.update(request.body.id, request.body.motivo, request.body.monto)
        .then(([rows, fieldData]) => {
            response.redirect('/pagos/pagos_extra');
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.post_modify_status = (request, response, next) => {
    Pago_Extra.update_estatus(request.body.id, request.body.estatus)
    .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.post_pago_extra_delete = (request, response, next) => {
    Pago_Extra.delete(request.body.id)
        .then(([rows, fieldData]) => {
            response.status(200).json({
                success: true
            });
        })
        .catch((error) => {
            console.log(error)
        })
};

exports.get_registro_transferencias = (request, response, next) => {
    response.render('pago/registro_transferencia', {
        subir: true,
        revisar: false,
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
                revisar:true,
                datos: resultados,
            });
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


