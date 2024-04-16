document.getElementById('formDiplomado').addEventListener('input', validateForm);
document.getElementById('nombreDiplomado').addEventListener('blur', checkDiplomadoExists);

function validateForm() {
    var duracion = document.getElementById("Duracion").value;
    var precio = document.getElementById("precioDiplomado").value;
    var nombre = document.getElementById("nombreDiplomado").value;
    var formValid = true;
    var valor = document.getElementById('precioDiplomado').value;

    if (!duracion || !precio || !nombre) {
        displayError("Por favor rellena todos los datos.");
        formValid = false;
    } else if (parseFloat(precio) <= 0) {
        displayError("El precio debe ser mayor a 0.");
        formValid = false;
    } else if (valor.includes('e') || valor.includes('E')) {
        mensaje = 'El precio no puede tener exponentes';
        $('#alerta').text(mensaje).show();
        $('button[type="submit"]').prop('disabled', true).addClass('is-light');
    } else {
        clearError();
    }

    document.getElementById('btnSubmit').disabled = !formValid;
}

function checkDiplomadoExists() {
    var nombre = document.getElementById("nombreDiplomado").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var exists = JSON.parse(this.responseText).exists;
            if (exists) {
                displayError("Ese diplomado ya existe.");
                document.getElementById('btnSubmit').disabled = true;
            }
        }
    };
    xmlhttp.open("GET", "/diplomado/check_diplomado?nombre=" + encodeURIComponent(nombre), true);
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