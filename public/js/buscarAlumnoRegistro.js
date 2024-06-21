const resultadoAlumno = document.querySelector('#resultadoAlumno');

$(document).ready(function () {
    // Función para manejar la búsqueda en la tabla de alumnos para registrar
    $('#searchAlumnos').on('input', function () {
        const consulta = $(this).val().toLowerCase();
        $('#tablaAlumnosRegistro tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(consulta) > -1);
        });

        let count = 0;
        let table_length = $('#tablaAlumnosRegistro tbody tr').length;

        $('#tablaAlumnosRegistro tbody tr').each(function() {
            if (this.getAttribute("style")){
                count++;
            }
        });

        const tabla_alumnos = document.querySelector('#tablaAlumnosRegistro');

        if (count == table_length){
            tabla_alumnos.classList.add('is-hidden');
            resultadoAlumno.classList.remove('is-hidden');
        } else {
            tabla_alumnos.classList.remove('is-hidden');
            resultadoAlumno.classList.add('is-hidden');
        }
    });
})