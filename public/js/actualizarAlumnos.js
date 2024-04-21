document.querySelectorAll('.form-enviar-datos').forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('/configuracion/actualizarAlumnos', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(data => {
                if (!data.success) {
                    // Manejar el caso en que success no es true
                    console.error('La operación no fue exitosa:', data);
                    // Aquí puedes agregar código para mostrar un mensaje de error al usuario
                    alert('Hubo un error en la consulta, por favor intenta de nuevo');
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
                alert('Hubo un error en la consulta, por favor intenta de nuevo');
            });
    });
});