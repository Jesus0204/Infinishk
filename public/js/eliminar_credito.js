function eliminarCredito(matricula) {
    // Obtener token de protección CSRF
    const csrf = document.getElementById('_csrf').value;

    // Enviar los datos al servidor
    fetch('/alumnos/datos_alumno/eliminar_credito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            matricula: matricula,
        })
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            return response.json();
        })
        .then((data) => {
            if (data.success) {
                // Mostrar la notificación de eliminación
                const notification = document.getElementById('eliminacionCredito');
                if (notification) {
                    notification.classList.remove('is-hidden');
                }

                // Recargar la página después de mostrar la notificación durante unos segundos
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // 2000 milisegundos = 2 segundos
            } else {
                console.error('Error en el servidor:', data.message);
            }
        })
    .catch(error => {
        console.error('Error en la petición fetch:', error);
    });
}