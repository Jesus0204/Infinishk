$(document).ready(function () {
    // Función para mostrar la notificación y recargar la página
    function mostrarNotificacionYRecargar(notificacion) {
        $(notificacion).removeClass('is-hidden'); // Mostrar notificación

        // Recargar la página después de mostrar la notificación por 3 segundos (3000 milisegundos)
        setTimeout(function () {
            window.location.reload(); // Recargar la página
        }, 1500);
    }

    // Mostrar la notificación y recargar la página después de enviar un formulario
    $('.formModificarPlanPago').submit(function (event) {
        event.preventDefault(); // Evitar que el formulario se envíe automáticamente

        $.ajax({
            type: 'POST',
            url: $(this).attr('action'), // Obtener la URL del formulario actual
            data: $(this).serialize(),
            success: function () {
                // Buscar la notificación relacionada con el formulario enviado
                var notificacion = $('#notificationPlanPago');

                mostrarNotificacionYRecargar(notificacion);
                $('html, body').animate({ scrollTop: 0 }, 'slow'); // Desplazarse al inicio de la página
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