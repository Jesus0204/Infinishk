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
                var notificacion = $('.notificationPlanPago');

                mostrarNotificacionYRecargar(notificacion);
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

const planPagoLength = document.getElementById('planPagoLength');

for (let count = 0; count < planPagoLength.innerHTML; count++) {

    const bt_Aplicar = document.querySelector('#btn_aplicar_cambios' + count);
    const nombre = document.querySelector('#nombre' + count);
    const ayuda_nombre = document.querySelector('#ayuda_nombre' + count);

    // Checar si hay contenido dentro del input, pata desactivar el boton
    function checar_contenido() {
        bt_Aplicar.disabled = nombre.value.length === 0;
    }

    // Activar mensaje si el motivo no tiene input
    function mensaje_nombre() {
        if (nombre.value.length === 0) {
            ayuda_nombre.classList.remove('is-hidden');
        } else {
            ayuda_nombre.classList.add('is-hidden');
        }
    }

    nombre.addEventListener('input', checar_contenido);
    nombre.addEventListener('input', mensaje_nombre);
}