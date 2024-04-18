document.getElementById('formRegistrarPlanPago').addEventListener('input', validateForm);
document.getElementById('nombrePlan').addEventListener('blur', checkPlanExists);

function validateForm() {
    var numPagos = document.getElementById("numeroPagos").value;
    var nombre = document.getElementById("nombrePlan").value;
    var formValid = true;
    var valor = document.getElementById('numeroPagos').value;

    if ( !numPagos || !nombre) {
        displayError("Por favor rellena todos los datos.");
        formValid = false;
    } else if (parseFloat(numPagos) <= 0) {
        displayError("El numero de pagos debe ser mayor a 0.");
        formValid = false;
    } else if (valor.includes('e') || valor.includes('E')) {
        mensaje = 'El numero de pagos no puede tener exponentes';
        $('#alerta').text(mensaje).show();
        $('button[type="submit"]').prop('disabled', true).addClass('is-light');
    } else {
        clearError();
    }

    document.getElementById('btn_aplicar_cambios').disabled = !formValid;
}

function checkPlanExists() {
    var nombre = document.getElementById("nombrePlan").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var exists = JSON.parse(this.responseText).exists;
            if (exists) {
                displayError("Ese plan de pago ya existe.");
                document.getElementById('btn_aplicar_cambios').disabled = true;
                document.getElementById('numeroPagos').disabled = true;
            }
            else {
                document.getElementById('numeroPagos').disabled = false;
            }
        }
    };
    xmlhttp.open("GET", "/configuracion/check_planpago?nombre=" + encodeURIComponent(nombre), true);
    xmlhttp.send();
}

function displayError(message) {
    var errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function clearError() {
    var errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

