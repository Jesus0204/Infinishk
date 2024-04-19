$('#pago').change(function () {
    // Sacas el monto de la opcion con data-monto
    var num_monto = $(this).find(':selected').data('monto');
    // Cambias el DOM para mostrar el precio correcto
    const monto = document.querySelector('#monto');
    monto.innerHTML = '<strong>Monto: </strong> $' + num_monto.toLocaleString('mx', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
});