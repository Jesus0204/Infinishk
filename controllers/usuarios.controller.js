exports.get_usuarios = (request, response, next) => {
    response.render('usuarios/usuarios');
};

const Deuda = require('../models/Deuda.model');

exports.get_alumnos_atrasados = (request, response, next) => {
    // Primero sacas las matriculas de alumnos que estan atrasados
    Deuda.fetchNoPagados()
        .then(([alumnos_atrasados, fieldData]) => {

            Deuda.fetchDeuda(alumnos_atrasados[0].matricula)
            .then(([deuda_alumno, fieldData]) => {
                 // Pasas a plantilla deudas de alumnos que tienen pago atrasado
                 response.render('usuarios/alumnos_atrasados', {
                     deudas_atrasadas: deuda_alumno
                 });
            })
            .catch((error) => {
                console.log(error);
            })
            // let deuda = [];
            // // Para cada alumno atrasado sacas todos los datos
            // for (let alumno of alumnos_atrasados) {
            //     Deuda.fetchDeuda(alumno.matricula)
            //         .then(([deuda_alumno, fieldData]) => {
            //             deuda.push(deuda_alumno);
            //             console.log(deuda);
            //         })
            //         .catch((error) => {
            //             console.log(error);
            //         })
            // }
        })
        .catch((error) => {
            console.log(error);
        });
};