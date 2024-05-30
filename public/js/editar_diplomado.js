
// Obtén las fechas de inicio y fin del diplomado
var fechaInicio = new Date(document.getElementById('fechaInicio').value);
var fechaFin = new Date(document.getElementById('fechaFin').value);

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: fechaInicio,
    endDate: fechaFin,
    displayMode: 'dialog',
    dateFormat: 'dd/MM/yyyy',
    weekStart: 1,
    lang: 'es',
    showFooter: false, 
    isRange: true
});

$(document).ready(function () {
    // Inicializar el botón desactivado
    actualizarBotonYMensaje();

    // Evento para cada vez que se modifica un campo
    $('input').on('input', function () {
        actualizarBotonYMensaje();
    });

    function actualizarBotonYMensaje() {
        var duracion = $('#Duracion').val().trim();
        var precio = $('#precioDiplomado').val().trim();
        var nombre = $('#nombreDiplomado').val().trim();
        var mensaje = '';
        var camposCompletos = duracion && precio && nombre;
        var valor = document.getElementById('precioDiplomado').value;

        if (!camposCompletos) {
            mensaje = 'Por favor completa todos los campos.';
            $('#alerta').text(mensaje).show();
            $('button[type="submit"]').prop('disabled', true);
        } else if (parseFloat(precio) <= 0) {
            mensaje = 'El precio debe ser mayor a 0.';
            $('#alerta').text(mensaje).show();
            $('button[type="submit"]').prop('disabled', true);
        } else if (valor.match(/[eE]/)) { // Verificar si hay caracteres de exponente
            mensaje = 'El precio no puede tener exponentes';
            $('#alerta').text(mensaje).show();
            $('button[type="submit"]').prop('disabled', true);
        } else {
            $('#alerta').hide();
            $('button[type="submit"]').prop('disabled', false);
        }
    }
});

document.getElementById('statusDiplomado').addEventListener('change', function () {
    var hiddenInput = document.getElementById('statusDiplomadoHidden');
    hiddenInput.value = this.checked ? 'on' : 'off';
});


document.querySelector('form').addEventListener('submit', function () {
    var inputs = document.querySelectorAll('#Duracion, #precioDiplomado, #nombreDiplomado');
    inputs.forEach(function (input) {
        input.disabled = false;
    });
});