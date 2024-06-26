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

const planPagoLength = document.getElementById('planPagoLength');

for (let count = 0; count < planPagoLength.innerHTML; count++) {

    const bt_Aplicar = document.querySelector('#btn_aplicar_cambios' + count);
    const nombre = document.querySelector('#nombre' + count);
    const ayuda_nombre = document.querySelector('#ayuda_nombre' + count);
    const monto = document.querySelector('#monto');
    const div_aplicar = document.querySelector('#boton_aplicar' + count);
    const estatus = document.querySelector('#estatus' + count);


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

    function mensaje_monto() {

        if (monto.value.includes('e') || monto.value.includes('E')) {
            bt_Registrar.disabled = true;
            ayuda_monto_exponente.classList.remove('is-hidden');
        } else {
            ayuda_monto_exponente.classList.add('is-hidden');
        }
    }

    function btn_aplicar(){
        div_aplicar.classList.remove('is-hidden');
    }
    

    nombre.addEventListener('input', checar_contenido);
    nombre.addEventListener('input', mensaje_nombre);
    nombre.addEventListener('input', btn_aplicar);
    estatus.addEventListener('change', btn_aplicar);
}