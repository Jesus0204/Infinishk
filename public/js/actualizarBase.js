// Función para mostrar la notificación y recargar la página
function mostrarNotificacionYRecargar(notificacion) {
    $(notificacion).removeClass('is-hidden'); // Mostrar notificación

    // Para que se vea la notifiación
    $('html, body').animate({
        scrollTop: 0
    }, 'slow');

    // Recargar la página después de mostrar la notificación por 3 segundos (3000 milisegundos)
    setTimeout(function () {
        window.location.reload(); // Recargar la página
    }, 3000);
}

const aceptar_horarios = () => {

    // Llamar la función con AJAX
    fetch('/configuracion/aceptar_horarios_resagados', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((result) => {
        return result.json(); // Regresa otra promesa
    }).then((data) => {
        const notificacion = document.querySelector('#aceptar_resagados')
        mostrarNotificacionYRecargar(notificacion);

    }).catch(err => {
        console.log(err);
        console.log('Error al enviar el formulario');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-confirmar-reinicio');
    const btnConfirmar = document.getElementById('btn-confirmar-reinicio');
    const btnCancelar = document.getElementById('btn-cancelar-reinicio');

    if (btnConfirmar && btnCancelar) {
        btnConfirmar.addEventListener('click', () => {
            // Cerrar modal
            modal.classList.remove('is-active');

            // Ejecutar acción
            fetch('/configuracion/reiniciarDatos', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    alert("✅ Los datos se han reiniciado correctamente.");
                    window.location.reload();
                } else {
                    alert("❌ Ocurrió un error al reiniciar los datos.");
                }
            }).catch(err => {
                console.error(err);
                alert("❌ Error al conectar con el servidor.");
            });
        });

        btnCancelar.addEventListener('click', () => {
            modal.classList.remove('is-active');
        });
    }
});




