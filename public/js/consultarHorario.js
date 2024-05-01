const select_plan = document.querySelector('#PlanPagoOption');

$('#IDPlanPago').change(function () {
    let numPagos = $(this).find(':selected').data('num');

    // Mostrar la tabla de pagos dependiendo del número
    if (numPagos != 2){

    }
});