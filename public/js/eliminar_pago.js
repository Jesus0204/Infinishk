// Eliminar Pagos Extra
function eliminarPagoExtra(IDLiquida)
{   
    // Obtener token de protección CSRF
    const csrf = document.getElementById('_csrf').value;

    // Enviar los datos al servidor
    fetch('/alumnos/datos_alumno/eliminar_pago_extra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            IDLiquida: IDLiquida,
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
                // Encontrar fila 
                const rowId = `${IDLiquida}`; // Encontrar fila de pago eliminado
                const tableRow = document.querySelector(`[data-id='${IDLiquida}']`);

                if (tableRow) {
                    tableRow.remove();
                } else {
                    console.error(`No se encontró la fila con el id ${rowId}.`);
                }

                // Mostrar la notificación de eliminación
                const notification = document.getElementById('eliminacionPE');
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

// Eliminar Colegiatura

// Eliminar Diplomado
function eliminarPagoDip(IDPagaDiplomado) {   
    // Obtener token de protección CSRF
    const csrf = document.getElementById('_csrf').value;

    // Enviar los datos al servidor
    fetch('/alumnos/datos_alumno/eliminar_pago_dip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            IDPagaDiplomado: IDPagaDiplomado,
        })
    })
    .then((response) => {
        if (!response.ok) {
            console.error('Error en la respuesta del servidor');
            throw new Error('Error en la respuesta del servidor');
        }

        return response.json();
    })
    .then((data) => {
        console.log('Server response:', data);
        if (data.success) {
            // Verificar si la fila está en el DOM antes de intentar removerla
            const rowId = `${IDPagaDiplomado}`;
            const tableRow = document.querySelector(`[data-id='${IDPagaDiplomado}']`);

            if (tableRow) {
                console.log(`Removing row with ID: ${rowId}`);
                tableRow.remove();
            } else {
                console.error(`No se encontró la fila con el id ${rowId}. Verifique si el ID es correcto.`);
            }

            // Mostrar la notificación de eliminación
            const notification = document.getElementById('eliminacionCol');
            if (notification) {
                notification.classList.remove('is-hidden');
            }

            setTimeout(() => {
                window.location.reload();
            }, 2000); // Recargar página
        } else {
            console.error('Error en el servidor:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la petición fetch:', error);
    });
}