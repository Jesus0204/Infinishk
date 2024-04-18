document.addEventListener('DOMContentLoaded', function () {
    const nombrePlanInput = document.querySelector('input[name="nombrePlan"]');
    const numeroPagosInput = document.querySelector('input[name="numeroPagos"]');
    const registrarPlanButton = document.getElementById('btn_aplicar_cambios');

    // Función para habilitar o deshabilitar el botón según si los campos están vacíos
    function toggleButton() {
        if (nombrePlanInput.value.trim() !== '' && numeroPagosInput.value.trim() !== '') {
            registrarPlanButton.removeAttribute('disabled');
        } else {
            registrarPlanButton.setAttribute('disabled', 'disabled');
        }
    }

    // Verificar al cargar la página y cada vez que se cambie un campo
    toggleButton();
    nombrePlanInput.addEventListener('input', toggleButton);
    numeroPagosInput.addEventListener('input', toggleButton);
});
