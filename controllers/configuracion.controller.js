const PlanPago = require('../models/planpago.model');
const PrecioCredito = require('../models/precio_credito.model');
const Alumno = require('../models/alumno.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const Materia = require('../models/materia.model');
const Periodo = require('../models/periodo.model');
const Posee = require('../models/posee.model');
const Colegiatura = require('../models/colegiatura.model');
const PagoDiplomado = require('../models/pagadiplomado.model');
const PagoExtra = require('../models/liquida.model');
const Usuario = require('../models/usuario.model')
const estudianteDiplomado = require('../models/estudiante_Diplomado.model');
const Diplomado = require('../models/diplomado.model');
const Rol = require('../models/rol.model');

const {
    aceptar_horario_resagados
} = require('./schedule.controller');

const {
    getAllUsers,
    getAllCourses,
    getAllPeriods,
    getUser,
    getAllAdmins,
    getUserGroups,
} = require('../util/adminApiClient');

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const jwt = require('jsonwebtoken');

const config = require('../config');

const path = require('path');

const fs = require('fs');

// Usar la clave secreta en tu código
const secretKey = config.jwtSecret;

// Configuras a moment con el locale. 
const moment = require('moment-timezone');
moment.locale('es-mx');

const { fetchIDActivo } = require('../models/periodo.model');

exports.get_configuracion = (request, response, next) => {
    response.render('configuracion/configuracion');
};

exports.get_administrar_planpago = (request, response, next) => {
    PlanPago.fetchAll()
        .then(([planpagos]) => {
            response.render('configuracion/administrar_planpago', {
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
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

exports.post_modificar_planpago = (request, response, next) => {
    const nombre = request.body.nombrePlan;
    const activo = request.body.planPagoActivo;
    const IDPlanPago = request.body.IDPlanPago;

    PlanPago.update(nombre, activo, IDPlanPago)
        .then(([planespago, fieldData]) => {
            // Aquí puedes enviar una respuesta JSON indicando éxito
            response.json({ success: true });
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.get_registrar_planpago = (request, response, next) => {
    response.render('configuracion/registrar_planpago', {
         csrfToken: request.csrfToken(),
         username: request.session.username || '',
         permisos: request.session.permisos || [],
         rol: request.session.rol || "",
         error_alumno: false
     });
};

exports.get_consultar_usuario = (request, response, next) => {
    Usuario.fetchActivos()
        .then(([usuariosActivos, fieldData]) => {
            Usuario.fetchNoActivos()
                .then(([usuariosNoActivos, fieldData]) => {
                    response.render('configuracion/consultar_usuario', {
                        usuariosNoActivos: usuariosNoActivos,
                        usuariosActivos: usuariosActivos,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
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
            console.log(error)
        });
};

exports.get_registrar_usuario = (request, response, next) => {
    Rol.fetchAll()
        .then(([roles_disponibles, fieldData]) => {
            response.render('configuracion/registrar_usuario', {
                roles_disponibles: roles_disponibles,
                csrfToken: request.csrfToken(),
                error: false,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            })
        })
        .catch((error) => {
            console.log(error)
        })
};


exports.post_registrar_usuario = async (request, response, next) => {
    const [roles_disponibles, fieldData] = await Rol.fetchAll()

    const rol = request.body.roles;
    const matricula = request.body.IDUsuario_NoAlumno;
    const correo = request.body.correoElectronico_NoAlumno;

    const token_noAlumno = jwt.sign({
        matricula: matricula
    }, secretKey, {
        expiresIn: '3d'
    });

    // Enlace con el token incluido
    const setPasswordLinkNoAlumno = `http://localhost:4000/auth/set_password?token=${token_noAlumno}`;

    const msg_noAlumno = {
        to: correo,
        from: {
            name: 'VIA PAGO',
            email: 'soporte@pagos.ivd.edu.mx',
        },
        subject: 'Bienvenido a VIA Pago',
        html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLinkNoAlumno}">Establecer Contraseña</a></p>`
    };

     if (rol === 'Administrador') {
        
        const [usuarioExistente, fieldData] = await Usuario.fetchOne(matricula);
        if (usuarioExistente.length > 0) { 
            return response.render('configuracion/registrar_usuario', {
                roles_disponibles: roles_disponibles,
                csrfToken: request.csrfToken(),
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            })
        }

        await Usuario.saveUsuario(matricula, correo);
        await Posee.savePosee(matricula, 1);

        try {
            await sgMail.send(msg_noAlumno);
            console.log('Correo electrónico enviado correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        };
     }
     
     if (rol === 'Visualizador') {

        const [usuarioExistente, fieldData] = await Usuario.fetchOne(matricula);
        if (usuarioExistente.length > 0) {
            return response.render('configuracion/registrar_usuario', {
                roles_disponibles: roles_disponibles,
                csrfToken: request.csrfToken(),
                error: true,
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            })
        }

        await Usuario.saveUsuario(matricula, correo);
        await Posee.savePosee(matricula, 2);

        try {
            await sgMail.send(msg_noAlumno);
            console.log('Correo electrónico enviado correctamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        };
    }
    
    if (rol === 'Alumno') {

       const matricula_alumno = request.body.IDUsuario;
       const correo_alumno = request.body.correoElectronico;
       const nombre = request.body.nombre;
       const apellidos = request.body.apellidos;
       const referenciaBancaria = request.body.referenciaBancaria;
       const fechaInscripcion = request.body.fechaInscripcion.split("/").reverse().join("-");
       const fechaModificacion = fechaInscripcion + ' 08:00:00';

       console.log(correo_alumno);

       const [usuarioExistente, fieldData] = await Usuario.fetchOne(matricula_alumno);
       if (usuarioExistente.length > 0) {
           return response.render('configuracion/registrar_usuario', {
               roles_disponibles: roles_disponibles,
               csrfToken: request.csrfToken(),
               error: true,
               username: request.session.username || '',
               permisos: request.session.permisos || [],
               rol: request.session.rol || "",
           })
       };

       // Registras al usuario y al alumno
       await Usuario.saveUsuario(matricula_alumno, correo_alumno);
       await Posee.savePosee(matricula_alumno, 3);
       await Alumno.save_alumno(matricula_alumno, nombre, apellidos, referenciaBancaria);

       // Registras al estudiante en diplomado
       const estudiante = new estudianteDiplomado(matricula_alumno, fechaModificacion);
       await estudiante.save();

       const token = jwt.sign({
           matricula: matricula_alumno
       }, secretKey, {
           expiresIn: '3d'
       });

       // Enlace con el token incluido
       const setPasswordLink = `http://localhost:4000/auth/set_password?token=${token}`;

       const msgAlumno = {
           to: correo,
           from: {
               name: 'VIA PAGO',
               email: 'soporte@pagos.ivd.edu.mx',
           },
           subject: 'Bienvenido a VIA Pago',
           html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLink}">Establecer Contraseña</a></p>`
       };

       try {
           await sgMail.send(msgAlumno);
           console.log('Correo electrónico enviado correctamente');
       } catch (error) {
           console.error('Error al enviar el correo electrónico:', error.toString());
       }
    }

    response.redirect('/configuracion/consultar_usuario');
};

exports.get_obtener_usuario = async (request, response, next) => {
    const users = await getAllAdmins();

    response.render('configuracion/obtener_usuario', {
        error: false,
        users: users,
        errorMensaje: '',
        csrfToken: request.csrfToken(),
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
    })
}

exports.post_getAdmins = async(request, response, next) => {
    let input = request.body.input;
    const users = JSON.parse(request.body.admins);
    try {

        let unregisteredAdmins = [];
        let registeredAdmins = [];
    
        for (let count = 0; count < users.data.length; count++) {
            let admin_matricula = (users.data[count].ivd_id).toString()
            let [usuarioExistente, fieldData] = await Usuario.fetchOne(admin_matricula);

            if (usuarioExistente.length == 0){
                unregisteredAdmins.push(admin_matricula)
            } 
        }

        // Filtras dependiendo del user input
        function filterArray(userInput) {
            return unregisteredAdmins.filter(number => number.includes(userInput));
        }

        // llamas la función con el input
        const filteredResults = filterArray(input);

        // Sacas si existe un usuario con el input
        let [usuarioExistente, fieldData] = await Usuario.fetchOne(input);

        let usuarioExist = JSON.stringify(usuarioExistente);

        if (usuarioExist.length != 2) {
            registeredAdmins.push(input)
        }

        return response.status(200).json({
            admins: filteredResults,
            registered: registeredAdmins
        });

    } catch (error) {
        console.log(error);
    }
};

exports.post_obtener_usuario = async (request, response, next) => {
    const matricula = request.body.user;
    const roles = await Rol.fetchNotAll();
    const roles_disponibles = roles[0].map(rol => rol.nombreRol);

    try {
        const user = await getUser(matricula);

        const usuarios = {
            ivd_id: user.data.ivd_id || '',
            email: user.data.email || '',
        }

        response.render('configuracion/activar_usuario', {
            usuarios: usuarios,
            roles_disponibles: roles_disponibles,
            csrfToken: request.csrfToken(),
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
        })

    } catch (error) {
        console.log(error);
        response.redirect('/configuracion/consultar_usuario')
    }
}

exports.post_activar_usuario = async (request, response, next) => {
    const rol = request.body.roles;
    const matricula = request.body.matricula;
    const correo = request.body.correo;

    if (rol === 'Administrador') {
        await Usuario.saveUsuario(matricula,correo);
        await Posee.savePosee(matricula,1);

        const token = jwt.sign({ matricula: matricula }, secretKey, { expiresIn: '3d' });
        
        // Enlace con el token incluido
        const setPasswordLink = `http://localhost:4000/auth/set_password?token=${token}`;

        const msg = {
            to: correo,
            from: {
                name: 'VIA PAGO',
                email: 'soporte@pagos.ivd.edu.mx',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLink}">Establecer Contraseña</a></p>`
        };
    
        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado correctamente');
        } 
        catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        }

        response.redirect('/configuracion/consultar_usuario')

    }

    if (rol === 'Visualizador') {
        await Usuario.saveUsuario(matricula,correo);
        await Posee.savePosee(matricula,2); 

        const token = jwt.sign({ matricula: matricula }, secretKey, { expiresIn: '3d' });
        
        // Enlace con el token incluido
        const setPasswordLink = `http://localhost:4000/auth/set_password?token=${token}`;

        const msg = {
            to: correo,
            from: {
                name: 'VIA PAGO',
                email: 'soporte@pagos.ivd.edu.mx',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLink}">Establecer Contraseña</a></p>`
        };
    
        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado correctamente');
        } 
        catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        }

        response.redirect('/configuracion/consultar_usuario');

    }
};

exports.get_search_activo = (request, response, next) => {
    const consulta = request.query.q;
    Usuario.buscar(consulta) // Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_search_noactivo = (request, response, next) => {
    const consulta = request.query.q;
    Usuario.buscarNoActivos(consulta)// Búsqueda de usuarios
        .then(([usuarios]) => {
            response.json(usuarios);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_modificar_usuario = (request, response, next) => {
    const id = request.body.IDUsuario;
    const status = request.body.statusUsuario === 'on' ? '1' : '0';

    Usuario.update(id, status)
        .then(() => {
            // Redirigir al usuario de vuelta a la misma página
            response.redirect('/configuracion/consultar_usuario');
        })
        .catch((error) => {
            console.log('Hubo error');
            console.log(error);
            // Manejar el error de alguna forma
            response.redirect('/configuracion/consultar_usuario');
        });
}

exports.get_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then((precio_actual) => {
            PrecioCredito.fetchAnios()
                .then(([anios, fieldData]) => {
                    // Conviertes las fechas a tu zona horaria con moment
                    precio_actual[0][0].fechaModificacion = moment(new Date(precio_actual[0][0].fechaModificacion)).tz('America/Mexico_City').format('LL');

                    response.render('configuracion/precio_credito', {
                        precio_actual: precio_actual[0],
                        anios: anios,
                        username: request.session.username || '',
                        permisos: request.session.permisos || [],
                        rol: request.session.rol || "",
                        csrfToken: request.csrfToken()
                    })
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
};

exports.post_precio_credito = (request, response, next) => {
    const anioSelect = request.body.anio;
    PrecioCredito.fetchPrecioAnio(anioSelect)
        .then(([precio_anio, fieldData]) => {
            // Conviertes las fechas a tu zona horaria con moment
            for (let count = 0; count < precio_anio.length; count++) {
                precio_anio[count].fechaModificacion = moment(new Date(precio_anio[count].fechaModificacion)).tz('America/Mexico_City').format('LL');
            };
            response.status(200).json({
                success: true,
                precio_anio: precio_anio
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
                success: false,
                error: 'Error cargando precioCredito'
            });
        });
};

exports.get_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.fetchPrecioActual()
        .then(([precio_actual, fieldData]) => {
            // Conviertes las fechas a tu zona horaria con moment
            for (let count = 0; count < precio_actual.length; count++) {
                precio_actual[count].fechaModificacion = moment(new Date(precio_actual[count].fechaModificacion)).tz('America/Mexico_City').format('LL');
            };
            response.render('configuracion/registrar_precio_credito', {
                precio_actual: precio_actual[0],
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
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


exports.get_check_plan = (request, response, next) => {
    const num = request.params.num;
    PlanPago.fetchOne(num)
        .then(([planpagos]) => {
            if (planpagos.length > 0) {
                response.json({ exists: true });
            } else {
                response.json({ exists: false });
            }
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_planpago = (request, response, next) => {
    const nombre = request.body.nombrePlan;
    const numero = request.body.numeroPagos;

    PlanPago.save(nombre, numero)
        .then(([planespago, fieldData]) => {
            response.redirect('/configuracion/administrar_planpago');
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
}

exports.post_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.update(request.body.monto)
        .then(([precio_credito, fieldData]) => {
            response.redirect('/configuracion/precio_credito');
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

exports.get_exportar_datos = (request, response, next) => {
    response.render('configuracion/exportarDatos', {
        error: false,
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
}

exports.post_exportar_datos = async (request, response, next) => {
    const colegiatura = request.body.colegiatura === 'on';
    const diplomado = request.body.pag_dipl === 'on';
    const extra = request.body.extra === 'on';
    const fechas = request.body.fecha.split("-");

    const fechaInicio_temp = fechas[0];
    const fechaFin_temp = fechas[1];
    const fechaInicio_utc = fechaInicio_temp.replace(/\s/g, '');
    const fechaFin_utc = fechaFin_temp.replace(/\s/g, '');

    const fechaInicio = moment(fechaInicio_utc, 'DD MM YYYY').add(6, 'hours').format();
    const fechaFin = moment(fechaFin_utc, 'DD MM YYYY').add(29, 'hours').add(59, 'minutes').add(59, 'seconds').format();

    const uploadsDir = path.join(__dirname, '../', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }

    // Función para eliminar acentos
    function eliminarAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    let csvContent = '';
    let errorMensaje = '';
    let errorColegiatura = false;
    let errorDiplomado = false;
    let errorExtra = false;

    if (colegiatura) {
        const datosColegiatura = await Colegiatura.fetchDatosColegiatura(fechaInicio, fechaFin);
        if (datosColegiatura.length === 0 || datosColegiatura[0].length === 0) {
            errorColegiatura = true;
        } else {
            datosEncontrados = true;
            csvContent += 'Colegiatura\n';
            csvContent += 'Matricula,Nombre,Apellidos,referenciaBancaria,Motivo,montoPagado,metodoPago,fechaPago,Nota\n';
            datosColegiatura.forEach((dato) => {
                dato.forEach((valor) => {
                    let fechaFormateada = '';
                    if (!isNaN(valor.fechaPago)) {
                        fechaFormateada = moment(valor.fechaPago).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                    }

                    csvContent += `${valor.Matricula ? eliminarAcentos(valor.Matricula) : ''},${valor.Nombre ? eliminarAcentos(valor.Nombre) : ''},${valor.Apellidos ? eliminarAcentos(valor.Apellidos) : ''},${valor.referenciaBancaria ? eliminarAcentos(valor.referenciaBancaria) : ''},${valor.Motivo ? eliminarAcentos(valor.Motivo) : ''},${valor.montoPagado || ''},${valor.metodoPago ? eliminarAcentos(valor.metodoPago) : ''},${fechaFormateada || ''},${valor.Nota ? eliminarAcentos(valor.Nota) : ''}\n`;
                });
                csvContent += '\f';
            });
        }
    }

    if (diplomado) {
        const datosDiplomado = await PagoDiplomado.fetchDatosDiplomado(fechaInicio, fechaFin);
        if (datosDiplomado.length === 0 || datosDiplomado[0].length === 0) {
            errorDiplomado = true;
        } else {
            datosEncontrados = true;
            csvContent += '\nDiplomado\n';
            csvContent += 'Matricula,Nombre,Apellidos,referenciaBancaria,IDDiplomado,nombreDiplomado,Motivo,montoPagado,metodoPago,fechaPago,Nota\n';
            datosDiplomado.forEach((dato) => {
                dato.forEach((valor) => {
                    let fechaFormateada = '';
                    if (!isNaN(valor.fechaPago)) {
                        fechaFormateada = moment(valor.fechaPago).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                    }

                    csvContent += `${valor.Matricula ? eliminarAcentos(valor.Matricula) : ''},${valor.Nombre ? eliminarAcentos(valor.Nombre) : ''},${valor.Apellidos ? eliminarAcentos(valor.Apellidos) : ''},${valor.referenciaBancaria ? eliminarAcentos(valor.referenciaBancaria) : ''},${valor.IDDiplomado || ''},${valor.nombreDiplomado ? eliminarAcentos(valor.nombreDiplomado) : ''},${valor.Motivo ? eliminarAcentos(valor.Motivo) : ''},${valor.montoPagado || ''},${valor.metodoPago ? eliminarAcentos(valor.metodoPago) : ''},${fechaFormateada || ''},${valor.Nota ? eliminarAcentos(valor.Nota) : ''}\n`;
                });
                csvContent += '\f';
            });
        }
    }

    if (extra) {
        const datosExtra = await PagoExtra.fetchDatosLiquida(fechaInicio, fechaFin);
        if (datosExtra.length === 0 || datosExtra[0].length === 0) {
            errorExtra = true;
        } else {
            datosEncontrados = true;
            csvContent += '\nExtra\n';
            csvContent += 'Matricula,Nombre,Apellidos,referenciaBancaria,metodoPago,fechaPago,Nota,Pagado,motivoPago\n';
            datosExtra.forEach((dato) => {
                dato.forEach((valor) => {
                    let fechaFormateada = '';
                    if (!isNaN(valor.fechaPago)) {
                        fechaFormateada = moment(valor.fechaPago).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
                    }

                    csvContent += `${valor.Matricula ? eliminarAcentos(valor.Matricula) : ''},${valor.Nombre ? eliminarAcentos(valor.Nombre) : ''},${valor.Apellidos ? eliminarAcentos(valor.Apellidos) : ''},${valor.referenciaBancaria ? eliminarAcentos(valor.referenciaBancaria) : ''},${valor.metodoPago ? eliminarAcentos(valor.metodoPago) : ''},${fechaFormateada || ''},${valor.Nota ? eliminarAcentos(valor.Nota) : ''},${valor.Pagado || ''},${valor.motivoPago ? eliminarAcentos(valor.motivoPago) : ''}\n`;
                });
                csvContent += '\f';
            });
        }
    }

    if (errorColegiatura && !errorDiplomado && !errorExtra) {
        errorMensaje = 'No se encontraron datos de Colegiatura en ese rango de fecha.';
    } else if (!errorColegiatura && errorDiplomado && !errorExtra) {
        errorMensaje = 'No se encontraron datos de Diplomado en ese rango de fecha.';
    } else if (!errorColegiatura && !errorDiplomado && errorExtra) {
        errorMensaje = 'No se encontraron datos de Pago Extra en ese rango de fecha.';
    } else if (!errorColegiatura && errorDiplomado && errorExtra) {
        errorMensaje = 'No se encontraron datos para Diplomado y Pago Extra.';
    } else if (errorColegiatura && !errorDiplomado && errorExtra) {
        errorMensaje = 'No se encontraron datos para Colegiatura y Pago Extra.';
    } else if (errorColegiatura && errorDiplomado && !errorExtra) {
        errorMensaje = 'No se encontraron datos para Colegiatura y Diplomado.';
    } else if (errorColegiatura || errorDiplomado || errorExtra) {
        errorMensaje = 'No se encontraron datos en el rango de fechas.';
    }

    if (errorMensaje !== '') {
        return response.render('configuracion/exportarDatos', {
            error: true,
            errorMensaje: errorMensaje,
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            csrfToken: request.csrfToken()
        });
    }

    const fechaActual = new Date().toISOString().replace(/:/g, '-');
    let nombreArchivo = '';

    const opcionesSeleccionadas = [colegiatura, diplomado, extra].filter(Boolean).length;
    if (opcionesSeleccionadas === 3 || opcionesSeleccionadas === 2) {
        nombreArchivo = `datos_exportados_${fechaActual}.csv`;
    } else if (colegiatura) {
        nombreArchivo = `datos_colegiatura_${fechaActual}.csv`;
    } else if (diplomado) {
        nombreArchivo = `datos_diplomado_${fechaActual}.csv`;
    } else if (extra) {
        nombreArchivo = `datos_extra_${fechaActual}.csv`;
    }

    response.attachment(nombreArchivo);
    response.send(csvContent);
}

exports.get_actualizar_base = (request, response, next) => {
    response.render('configuracion/actualizarBase', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};


exports.get_alumnos = async (request, response, next) => {

    try {
        // Llama a las funciones necesarias para obtener datos
        const users = await getAllUsers();

        const parsedUsers = users.data.map(user => {
            const {
                ivd_id = '',
                name,
                first_surname,
                second_surname,
                email ='',
                status,
                semester,
                degree_name,
                version,
            } = user;

            const apellidos = `${first_surname} ${second_surname}`;
            return {
                ivd_id: ivd_id,
                name: name,
                apellidos: apellidos,
                email: email,
                status: status,
                semester: semester,
                planEstudio: degree_name,
                planVersion: version,
            };
        });

        const filteredUsers = parsedUsers.filter(user => (
            (user.ivd_id.toString().startsWith('1') || user.ivd_id.toString().startsWith('8')) &&
            user.status === 'active'
        ));

        // Realiza la comparación para cada usuario
        const updatedUsers = [];
        for (const user of filteredUsers) {
            const usuarioExistente = await Alumno.fetchOne(user.ivd_id);
            if (usuarioExistente && usuarioExistente.length > 0 && usuarioExistente[0].length > 0) {
                // Si la comparación devuelve resultados, actualiza el usuario
                await Alumno.updateAlumno(user.ivd_id, user.name, user.apellidos);
                if (!isNaN(user.ivd_id)) {
                    await Usuario.updateUsuario(user.ivd_id, user.email);
                } else {
                    console.log(`IDUsuario inválido`);
                }
                
                await EstudianteProfesional.update_alumno_profesional(user.ivd_id, user.semester)
                updatedUsers.push({ ...user, updated: true });
            } else {
                updatedUsers.push({ ...user, updated: false });
            }
        }

        // Filtra los usuarios que no fueron actualizados
        const usuariosSinActualizar = updatedUsers.filter(user => !user.updated);

        response.render('configuracion/actualizarAlumnos', {
            usuarios: usuariosSinActualizar, // Utiliza la lista de usuarios actualizados
            //cursos: cursos,
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            csrfToken: request.csrfToken()
        });
    }

    catch (error) {
        console.error('Error realizando operaciones:', error);
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
    }
};



exports.get_materias = async (request, response, next) => {

    try {
        // Llama a las funciones necesarias para obtener datos
        const courses = await getAllCourses();

        const parsedCourses = courses.data.map(course => {

            const {
                id,
                name,
                credits,
                sep_id,
            } = course;

            const semestre = course.plans_courses?.[0]?.semester;
            const carrera = course.plans?.[0]?.degree?.name;
            return {
                id: id,
                name: name,
                credits: credits,
                sep_id: sep_id,
                semestre: semestre,
                carrera: carrera,
            };
        });

        const updatedCourses = [];

        for (const course of parsedCourses) {
            const courseExistente = await Materia.fetchOne(course.id)
            if (courseExistente && courseExistente.length > 0 && courseExistente[0].length > 0) {
                // Si la comparación devuelve resultados, actualiza la materia
                await Materia.updateMateria(course.id, course.name, course.carrera, course.semestre, course.credits, course.sep_id)
                updatedCourses.push({ ...course, updated: true });
            } else {
                updatedCourses.push({...course, updated: false});
            }
        }

        // Filtra las materias que no fueron actualizadas
        coursesSinActualizar = updatedCourses.filter(course => !course.updated);

        for(const course of coursesSinActualizar) {
            try {
                // Si la materia no existe, registrarla automaticamente
                await Materia.saveMateria(course.id, course.name, course.carrera, course.semestre, course.credits, course.sep_id);
                course.updated = true;
            }
                catch (error) {
                    console.error('Error registrando curso ${course.name}:', error);
                    course.updated = false;
                }
            }

            response.json({
                success: true,
                updateCourses: updatedCourses,
                coursesSinActualizar: coursesSinActualizar.filter(course => !course.updated)
            });
        }
        catch (error) {
            console.error('Error realizando operaciones:', error);
            response.status(500).json({
                success: false
            });
        }
};


exports.get_periodos = async (request, response, next) => {

    try {
        // Llama a las funciones necesarias para obtener datos
        const periods = await getAllPeriods();

        const parsedPeriods = periods.data.map(period => {

            const {
                id,
                code,
                start_date,
                end_date,
                active,
            } = period;

            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const status = active ? 1 : 0;

            const yearStart = startDate.getFullYear();
            const monthStart = startDate.getMonth() + 1; // El mes comienza desde 0 (enero es 0)
            const dayStart = startDate.getDate();

            const yearEnd = endDate.getFullYear();
            const monthEnd = endDate.getMonth() + 1; // El mes comienza desde 0 (enero es 0)
            const dayEnd = endDate.getDate();

            return {
                id: id,
                name: code,
                start: `${yearStart}-${monthStart}-${dayStart}`,
                end: `${yearEnd}-${monthEnd}-${dayEnd}`,
                status: status,
            };
        });

        const updatedPeriods = [];
        for (const period of parsedPeriods) {
            const periodoExistente = await Periodo.fetchOne(period.id);
            if (periodoExistente && periodoExistente.length > 0 && periodoExistente[0].length > 0) {
                // Si la comparación devuelve resultados, actualiza el usuario
                await Periodo.updatePeriodo(period.id,period.start,period.end,period.name,period.status)
                updatedPeriods.push({ ...period, updated: true });
            } else {
                updatedPeriods.push({ ...period, updated: false });
            }
        }

        // Filtra los usuarios que no fueron actualizados
        const periodosSinActualizar = updatedPeriods.filter(period => !period.updated);

        for (let count = 0; count < periodosSinActualizar.length; count++){
            periodosSinActualizar[count].start = moment(periodosSinActualizar[count].start, 'YYYY-MM-DD').format('LL');
            periodosSinActualizar[count].end = moment(periodosSinActualizar[count].end, 'YYYY-MM-DD').format('LL');
        }

        // Guardar los periodos sin actualizar en la base de datos
        for (const period of periodosSinActualizar) {
            const idPeriodo = period.id;
            const nombre = period.name;
            const inicio_string = period.start;
            const fin_string = period.end;
            const status = period.status;

            const inicio = moment(inicio_string, 'LL').format('YYYY-MM-DD');
            const fin = moment(fin_string, 'LL').format('YYYY-MM-DD');

            try {
                // Si el periodo no existe, registrarlo automaticamente
                await Periodo.savePeriodo(idPeriodo, inicio, fin, nombre, status);

                period.updated = true;
            }
                catch (error) {
                    console.error('Error registrando period ${period.name}:', error);
                    period.updated = false;
                }
            }

        response.json({
            success: true,
            updatedPeriods: updatedPeriods.map(period => ({
                ...period,
                start: moment(period.start, 'YYYY-MM-DD').format('LL'),
                end: moment(period.end, 'YYYY-MM-DD').format('LL'),
            }))
        });

    } catch (error) {
        console.error('Error realizando operaciones:', error);
        response.status(500).render('500', {
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            error_alumno: false
        });
    }
};


exports.post_alumnos = async (request,response,next) => {
    try {
        let success = true;
        const matricula = request.body.matricula;
        const nombre = request.body.nombre;
        const apellidos = request.body.apellidos;
        const email = request.body.email;
        const semestre = request.body.semestre;
        const planEstudio = request.body.planEstudio;
        const referencia = request.body.referenciaBancaria;
        const beca = request.body.beca;
    
        const token = jwt.sign({ matricula: matricula }, secretKey, { expiresIn: '11d' });
            
            // Enlace con el token incluido
        const setPasswordLink = `http://localhost:4000/auth/set_password?token=${token}`;
    
        await Alumno.save_alumno(matricula,nombre,apellidos,referencia);
        await EstudianteProfesional.save_alumno_profesional(matricula,semestre,planEstudio,beca);
        await Usuario.saveUsuario(matricula,email);
        await Posee.savePosee(matricula,3);
    
        const msg = {
            to: email,
            from: {
                name: 'VIA PAGO',
                email: 'soporte@pagos.ivd.edu.mx',
            },
            subject: 'Bienvenido a VIA Pago',
            html: `<p>Hola!</p><p>Haz clic en el siguiente enlace para establecer tu contraseña. Toma en cuenta que la liga tiene una validez de 3 días: <a href="${setPasswordLink}">Establecer Contraseña</a></p>`
        };
    
        try {
            await sgMail.send(msg);
            console.log('Correo electrónico enviado correctamente');
        } 
        catch (error) {
            console.error('Error al enviar el correo electrónico:', error.toString());
        }
    
        response.json({
            success: success
        });
        
    } catch (error) {
        let success = false;
        console.log(error);
        response.json({
            success: success
        });
    };
}

exports.aceptar_horario_resagados = async (request, response, next) => {

    let success;
    try {
        // Llamar la función para aceptar los horarios y mandar correos en caso de fallo
        await aceptar_horario_resagados(request, response, next);

        success = true;
        return response.status(200).json({
            success: success,
        });
    } catch (error) {
        success = false;
        console.log(error);
        return response.status(500).json({
            success: success,
        });
    }

}