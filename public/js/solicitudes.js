const solicitudes_length = document.getElementById('solicitudes_length');

for (let count = 0; count < solicitudes_length.innerHTML; count++) {
    const modificar = document.getElementById('modificar' + count);

    $('#pago' + count).change(function () {
        modificar.classList.remove('is-hidden');
        // Sacas el monto de la opcion con data-monto
        let num_monto = $(this).find(':selected').data('monto');
        // Cambias el DOM para mostrar el precio correcto
        const monto = document.querySelector('#monto' + count);
        monto.innerHTML = '<strong>Monto: </strong> $' + num_monto.toLocaleString('mx', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
    });

}

const eliminar = (id) => {
    console.log(id);
    //El token de protección CSRF
    const csrf = document.getElementById('_csrf').value;

    // Enviar los datos al servidor
    fetch('/pagos/solicitudes/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'csrf-token': csrf
            },
            body: JSON.stringify({
                id: id
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const table = document.getElementById(id);

            if (table) {
                table.remove();
            } else {
                console.error(`No se encontró la fila ${id}.`);
            }

            document.getElementById('modificacion').classList.remove('is-hidden');
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
        })
        .catch(error => {
            console.error('Error en la petición fetch:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {

        $delete.addEventListener('click', () => {
            document.getElementById('modificacion').classList.add('is-hidden');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.message .delete') || []).forEach(($delete) => {
        const $message = $delete.parentNode.parentNode;

        $delete.addEventListener('click', () => {
            $message.parentNode.removeChild($message);
        });
    });
});