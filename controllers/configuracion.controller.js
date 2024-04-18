const PlanPago = require('../models/planpago.model');
const PrecioCredito = require('../models/precio_credito.model');
const Usuario = require('../models/usuario.model');
const { getAllUsers } = require('../util/adminApiClient');

exports.get_configuracion = (request, response, next) => {
    response.render('configuracion/configuracion');
};

exports.get_administrar_planpago = (request, response, next) => {
    PlanPago.fetchAll()
        .then(([planpagos]) => {
            response.render('configuracion/administrar_planpago', {
                planpago: planpagos,
                csrfToken: request.csrfToken(),
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
            });
        })
        .catch((error) => {
            console.log(error);
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
                    console.log(error)
                });
        })
        .catch((error) => {
            console.log(error)
        });
}


exports.get_search_activo = (request, response, next) => {
    const consulta = request.query.q;
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
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
    console.log('Consulta recibida:', consulta); // Verifica si la consulta se está recibiendo correctamente
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
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error)
        });
};

// Configuras a moment con el locale. 
const moment = require('moment');
moment.locale('es-mx');

exports.post_precio_credito = (request, response, next) => {
    const anioSelect = request.body.anio;
    PrecioCredito.fetchPrecioAnio(anioSelect)
        .then(([precio_anio, fieldData]) => {
            // Conviertes las fechas a tu zona horaria con moment
            for (let count = 0; count < precio_anio.length; count++) {
                precio_anio[count].fechaModificacion = moment(new Date(precio_anio[count].fechaModificacion)).format('LL');
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
        .then((precio_actual) => {
            response.render('configuracion/registrar_precio_credito', {
                precio_actual: precio_actual[0],
                username: request.session.username || '',
                permisos: request.session.permisos || [],
                rol: request.session.rol || "",
                csrfToken: request.csrfToken()
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.post_registrar_precio_credito = (request, response, next) => {
    PrecioCredito.update(request.body.monto)
        .then(([precio_credito, fieldData]) => {
            response.redirect('/configuracion/precio_credito');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.get_actualizar_base = (request, response, next) => {
    response.render('configuracion/actualizarBase', {
        username: request.session.username || '',
        permisos: request.session.permisos || [],
        rol: request.session.rol || "",
        csrfToken: request.csrfToken()
    });
};

exports.post_actualizar_base = async (request, response, next) => {
    try {
        // Llama a las funciones necesarias para obtener datos
        const users = await getAllUsers();

        if (!Array.isArray(users)) {
            throw new Error('La función getAllUsers no ha devuelto un array de usuarios.');
        }

        const parsedUsers = []; // Array para almacenar los usuarios parseados

        // Parsea los datos de cada usuario y agrégalos al array parsedUsers
        users.forEach(user => {
            const {
                id,
                uid,
                name,
                first_surname,
                second_surname,
                email,
                status,
                type,
                semester,
                regular,
                graduated,
                role
            } = user;

            const {
                id: roleId,
                name: roleName,
                description: roleDescription
            } = role;

            // Guardar datos específicos de cada usuario en variables separadas
            const userId = id;
            const userUid = uid;
            const fullName = `${name} ${first_surname} ${second_surname}`;
            const userEmail = email;
            const userStatus = status;
            const userType = type;
            const userSemester = semester;
            const userRegular = regular;
            const userGraduated = graduated;
            const userRoleId = roleId;
            const userRoleName = roleName;
            const userRoleDescription = roleDescription;

            // Agregar los datos a parsedUsers si es necesario
            parsedUsers.push({
                id: userId,
                uid: userUid,
                fullName,
                email: userEmail,
                status: userStatus,
                userType,
                semester: userSemester,
                regular: userRegular,
                graduated: userGraduated,
                role: {
                    id: userRoleId,
                    name: userRoleName,
                    description: userRoleDescription
                }
            });

            // Guardar datos específicos en variables individuales para cada alumno
            // Aquí puedes realizar cualquier otra operación con los datos individuales de cada alumno
            console.log(`Datos del alumno ${fullName}:`, {
                id: userId,
                uid: userUid,
                fullName,
                email: userEmail,
                status: userStatus,
                userType,
                semester: userSemester,
                regular: userRegular,
                graduated: userGraduated,
                roleId: userRoleId,
                roleName: userRoleName,
                roleDescription: userRoleDescription
            });
        });

        // Envía los datos de los usuarios parseados como respuesta
        response.send(parsedUsers);

        // Muestra los datos en la consola
        console.log('Usuarios parseados:', parsedUsers);
    } catch (error) {
        console.error('Error realizando operaciones:', error);
        // Puedes enviar una respuesta de error si es necesario
        response.status(500).send('Error obteniendo datos de usuarios');
    }
}
