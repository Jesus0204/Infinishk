$(document).ready(function () {
    // Para poner el monto del pago modificado al iniciar la página
    const selectedOption = $('#pago').find(':selected'); // Conseguir el motivo de pago_mod
    const initialMonto = selectedOption.data('monto'); // Obtener el monto asociado
    $('#monto').val(initialMonto); // Poner ese monto como el inicial

    // Inicializar fecha inicial
    const fecha = document.getElementById('fechapago')
    
    const startDate = fecha.getAttribute('placeholder');

    const calendars = bulmaCalendar.attach('[id=fechapago' + ']', {
        startDate: startDate,
        displayMode: 'dialog',
        dateFormat: 'dd/MM/yyyy',
        weekStart: 1,
        lang: 'es',
        showFooter: false
    });

    $('#pago').change(function () {
        // Saca la opción seleccionada
        let opcion = $(this).find(':selected');
        // Sacas el monto de la opcion con data-monto
        let num_monto = $(this).find(':selected').data('monto');
        let motivo = $(this).find(':selected').text();
        // Cambias el DOM para mostrar el precio correcto
        const monto = document.querySelector('#monto');

        // Sacar los inputs personalizados
        const motivoCustom = document.getElementById("motivo-custom");
        const montoCustom = document.getElementById("monto-custom-total");
        const montoAuto = document.getElementById("monto-total");

        if (opcion.val() === 'custom') {
            motivoCustom.style.display = 'block';
            montoCustom.style.display = 'block';
            montoAuto.style.display = 'none';
            monto.value = '';
        } else {
            motivoCustom.style.display = 'none';
            montoCustom.style.display = 'none';
            montoAuto.style.display = 'block';

            monto.value = num_monto.toLocaleString('mx', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Cambias el DOM dentro del modal
            document.querySelector('#monto_modal').innerHTML = '<strong>Monto Pagado: </strong> $' + num_monto
                .toLocaleString('mx', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            document.querySelector('#motivo_modal').innerHTML = '<strong>Motivo: </strong>' + motivo;
            }
    });

    $('#metodo').change(function () {
        // Sacas el metodo de la opcion seleccionada
        let metodo_seleccionado = $(this).find(':selected').text();
        // Cambias el DOM para mostrar el precio correcto
        const metodo = document.querySelector('#metodo_modal');
        metodo.innerHTML = metodo_seleccionado;
    });
});

// Sacar los botones de clear para agregar validaciones
const clear = document.querySelectorAll('.datetimepicker-clear-button');
let count = 0;
clear.forEach((button) => {
    if (clear.length == 2) {
        if (count == 0) {
            button.addEventListener('click', clear_button)
        } else if (count == 1) {
            button.addEventListener('click', clear_button_pago_extra)
        }
        count++;
    } else if (clear.length == 1) {
        button.addEventListener('click', clear_button_pago_extra)
    }
})
