const PlanPago = require('../models/planpago.model');
const PrecioCredito = require('../models/precio_credito.model');
const Usuario = require('../models/usuario.model');
const Alumno = require('../models/alumno.model');
const EstudianteProfesional = require('../models/estudiante_profesional.model');
const Materia = require('../models/materia.model');
const { getAllUsers, getAllCourses } = require('../util/adminApiClient');

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

exports.get_alumnos = async (request, response, next) => {

    try {
        // Llama a las funciones necesarias para obtener datos
        const users = await getAllUsers();

        const parsedUsers = users.data.map(user => {
            const {
                ivd_id,
                name,
                first_surname,
                second_surname,
                email,
                status,
                semester,
                degree_name,
            } = user;

            const apellidos = ` ${first_surname} ${second_surname}`;
            return {
                ivd_id: ivd_id,
                name: name,
                apellidos: apellidos,
                email: email,
                status: status,
                semester: semester,
                planEstudio: degree_name,
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
                await Usuario.updateUsuario(user.ivd_id, user.email);
                await EstudianteProfesional.update_alumno_profesional(user.ivd_id, user.semester, user.planEstudio)
                updatedUsers.push({ ...user, updated: true });
            } else {
                updatedUsers.push({ ...user, updated: false });
            }
        }

        // Filtra los usuarios que no fueron actualizados
        const usuariosSinActualizar = updatedUsers.filter(user => !user.updated);

        response.render('configuracion/actualizarAlumnos', {
            usuarios: usuariosSinActualizar, // Utiliza la lista de usuarios actualizados
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            csrfToken: request.csrfToken()
        });
    }

    catch (error) {
        console.error('Error realizando operaciones:', error);
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
                // Si la comparación devuelve resultados, actualiza el usuario
                await Materia.updateMateria(course.sep_id,course.name,course.carrera,course.semestre,course.credits,course.id)
                updatedCourses.push({ ...course, updated: true });
            } else {
                updatedCourses.push({ ...course, updated: false });
            }
        }

        // Filtra los usuarios que no fueron actualizados
        const coursesSinActualizar = updatedCourses.filter(course => !course.updated);

        response.render('configuracion/actualizarMaterias', {
            materias: coursesSinActualizar,
            username: request.session.username || '',
            permisos: request.session.permisos || [],
            rol: request.session.rol || "",
            csrfToken: request.csrfToken()
        });
    }

    catch (error) {
        console.error('Error realizando operaciones:', error);
    }
};

exports.post_alumnos = async (request,response,next) => {
    let success = true;
    const matricula = request.body.matricula;
    const nombre = request.body.nombre;
    const apellidos = request.body.apellidos;
    const email = request.body.email;
    const semestre = request.body.semestre;
    const planEstudio = request.body.planEstudio;
    const referencia = request.body.referenciaBancaria;

    await Alumno.save_alumno(matricula,nombre,apellidos,referencia);
    await EstudianteProfesional.save_alumno_profesional(matricula,semestre,planEstudio)
    await Usuario.saveUsuario(matricula,email);

    response.json({success:success})
    
}

exports.post_materias = async (request,response,next) => {
    let success = true;
    const idMateria= request.body.id;
    const idSep = request.body.idsep;
    const nombre = request.body.nombre;
    const creditos = request.body.creditos;
    const semestre = request.body.semestre;
    const planEstudio = request.body.carrera;

    await Materia.saveMateria(idSep,nombre,planEstudio,semestre,creditos,idMateria)
    

    response.json({success:success})
    
}

