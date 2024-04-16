$(document).ready(function () {
    // Función para manejar la búsqueda en la tabla de usuarios activos
    $('#searchActivos').on('input', function () {
        const consulta = $(this).val().toLowerCase();
        $('#tablaActivos tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(consulta) > -1);
        });
    });

    // Función para manejar la búsqueda en la tabla de usuarios no activos
    $('#searchNoActivos').on('input', function () {
        const consulta = $(this).val().toLowerCase();
        $('#tablaNoActivos tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(consulta) > -1);
        });
    });
});

/* Funciones para alternar entre usuarios activos y no activos */
function usuarios_activos() {
    const tab_no_activos = document.querySelector('#nav_no_activos');
    const tab_activos = document.querySelector('#nav_activos');

    tab_no_activos.classList.remove('is-active');
    tab_activos.classList.add('is-active');

    const usuarios_no_activos = document.querySelector('#usuarios_no_activos');
    usuarios_no_activos.classList.add('is-hidden');

    const usuarios_activos = document.querySelector('#usuarios_activos');
    usuarios_activos.classList.remove('is-hidden');
}

function usuarios_no_activos() {
    const tab_no_activos = document.querySelector('#nav_no_activos');
    const tab_activos = document.querySelector('#nav_activos');

    tab_no_activos.classList.add('is-active');
    tab_activos.classList.remove('is-active');

    const usuarios_no_activos = document.querySelector('#usuarios_no_activos');
    usuarios_no_activos.classList.remove('is-hidden');

    const usuarios_activos = document.querySelector('#usuarios_activos');
    usuarios_activos.classList.add('is-hidden');
}

$(document).ready(function () {
    // Función para mostrar la notificación y recargar la página
    function mostrarNotificacionYRecargar(tabla, notificacion) {
        $(notificacion).removeClass('is-hidden'); // Mostrar notificación

        // Recargar la página después de mostrar la notificación por 3 segundos (3000 milisegundos)
        setTimeout(function () {
            window.location.reload(); // Recargar la página
        }, 1500);
    }

    // Mostrar la notificación y recargar la página después de enviar cualquier formulario
    $('form').submit(function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe automáticamente

        $.ajax({
            type: 'POST',
            url: $(this).attr('action'), // Obtener la URL del formulario actual
            data: $(this).serialize(),
            success: function () {
                // Buscar la tabla y la notificación relacionadas con el formulario enviado
                var tabla = $(event.target).closest('.table-container').find('table');
                var notificacion = $(event.target).closest('.table-container').siblings('.notification');

                mostrarNotificacionYRecargar(tabla, notificacion);
            },
            error: function () {
                console.log('Error al enviar el formulario');
            }
        });
    });

    // Cerrar notificación al hacer clic en el botón eliminar
    $('.delete').click(function () {
        $(this).parent().addClass('is-hidden'); // Ocultar notificación al hacer clic en el botón eliminar
    });
});