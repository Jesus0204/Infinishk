const resultadoActivo = document.querySelector('#resultadoActivo');

$(document).ready(function () {
    $('#searchAlumnos').on('input', function () {
        const consulta = $(this).val().toLowerCase();
        $('#tablaAlumnos tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(consulta) > -1);
        });

        let count = 0;
        let table_length = $('#tablaAlumnos tbody tr').length;

        $('#tablaAlumnos tbody tr').each(function () {
            if (this.getAttribute("style")) {
                count++;
            }
        });

        const tabla_alumnos = document.querySelector('#tablaAlumnos');

        if (count == table_length) {
            tabla_alumnos.classList.add('is-hidden');
            // Asegúrate de tener un elemento con el ID 'resultadoActivo' para mostrar el mensaje
            resultadoActivo.classList.remove('is-hidden');
        } else {
            tabla_alumnos.classList.remove('is-hidden');
            resultadoActivo.classList.add('is-hidden');
        }
    });
});

