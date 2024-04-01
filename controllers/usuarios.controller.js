exports.get_usuarios = (request, response, next) => {
    response.render('usuarios/usuarios');
};

const Deuda = require('../models/Deuda.model');

exports.get_alumnos_atrasados = (request, response, next) => {
    // Primero sacas las matriculas de alumnos que estan atrasados
    Deuda.fetchNoPagados()
        .then(async ([alumnos_atrasados, fieldData]) => {
            let deudas = [];
            // Para cada alumno atrasado sacas todos los datos
            for (let alumno of alumnos_atrasados) {
                const [deuda, fieldData] = await Deuda.fetchDeuda(alumno.matricula);
                deudas.push(deuda);
            }
            // Pasas a plantilla deudas de alumnos que tienen pago atrasado
            response.render('usuarios/alumnos_atrasados', {
                pagos_atrasados: deudas
            });
        })
        .catch((error) => {
            console.log(error);
        });
};