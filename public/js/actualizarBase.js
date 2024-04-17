async function actualizarBase() {
    try {
        const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content'); // Obtener el token CSRF del meta tag
        const response = await fetch('/configuracion/actualizarBase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken // Agregar el token CSRF como parte de los headers
            },
            body: JSON.stringify({}), // Si es necesario, enviar datos en el cuerpo de la solicitud
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
