async function actualizarAlumno() {
    try {
        const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content'); // Obtener el token CSRF del meta tag
        const response = await fetch('/configuracion/actualizarAlumnos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken // Agregar el token CSRF como parte de los headers
            }
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

