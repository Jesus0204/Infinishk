function checkSeleccion() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const boton = document.getElementById('boton_agregar');
    const mensaje = document.getElementById('ayuda_seleccion');
    
    // Revisar si se ha seleccionado al menos un alumno
    var seleccionAlumno = false;
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            seleccionAlumno = true;
        }
    });
    
    // Activar / desactivar botón cuando hay una selección
    if (seleccionAlumno) {
        boton.removeAttribute('disabled');
        mensaje.classList.add('is-hidden');
    } else {
        boton.setAttribute('disabled', 'disabled');
        mensaje.classList.remove('is-hidden');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkSeleccion();
    
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', checkSeleccion);
    });
});

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

