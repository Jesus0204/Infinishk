// Función para mostrar la notificación y recargar la página
function mostrarNotificacionYRecargar(notificacion) {
    $(notificacion).removeClass('is-hidden'); // Mostrar notificación

    // Para que se vea la notificación
    $('html, body').animate({
        scrollTop: 0
    }, 'slow');

    // Recargar la página después de mostrar la notificación por 3 segundos (3000 milisegundos)
    setTimeout(function () {
        window.location.reload(); // Recargar la página
    }, 3000);
}


const registrar_materias = () => {
    // Llamar la función con AJAX
    fetch('/configuracion/actualizarMaterias', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((result) => {
        return result.json(); // Regresa otra promesa
    }).then((data) => {
        const notificacion = document.querySelector('#aceptar_materias')
        mostrarNotificacionYRecargar(notificacion);

    }).catch(err => {
        console.log(err);
        console.log('Error al enviar el formulario');
    });
}








/*document.querySelectorAll('.form-enviar-datos').forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/configuracion/actualizarMaterias', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                if (!data.success) {
                    // Manejar el caso en que success no es true
                    console.error('La operación no fue exitosa:', data);
                    // Aquí puedes agregar código para mostrar un mensaje de error al usuario
                    alert('Hubo un error al registrar la materia. Favor de intentar de nuevo.');
                } else {
                    // Si la respuesta fue exitosa, eliminar la fila de la tabla
                    const filaId = form.parentElement.parentElement.id;
                    const fila = document.getElementById(filaId);
                    if (fila) {
                        fila.remove();
                    } else {
                        console.error(`No se encontró la fila ${filaId}.`);
                    }
                }
            })
            .catch(error => {
                console.error('Error en la petición fetch:', error);
                alert('Hubo un error al registrar la materia. Favor de intentar de nuevo');
            });
    });
});*/