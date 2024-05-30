document.getElementById('formDiplomado').addEventListener('input', validateForm);
document.getElementById('nombreDiplomado').addEventListener('blur', checkDiplomadoExists);

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(),
    endDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'dd/MM/yyyy',
    weekStart: 1,
    lang: 'es',
    showFooter: false, 
    isRange: true
});

function validateForm() {
    var precio = document.getElementById("precioDiplomado").value;
    var nombre = document.getElementById("nombreDiplomado").value;
    var valor = document.getElementById('precioDiplomado').value;
    var formValid = true;

    if (!precio || !nombre) {
        displayError("Por favor rellena todos los datos.", 'form');
        formValid = false;
    } else if (parseFloat(precio) <= 0) {
        displayError("El precio debe ser mayor a 0.", 'precio');
        formValid = false;
    } else if (valor.match(/[eE]/)) { // Verificar si hay caracteres de exponente
        displayError("El precio no puede tener exponentes.", 'precio');
        formValid = false; // Marcar el formulario como no válido
    } else {
        clearError('form');
    }

    return formValid;
}

function checkDiplomadoExists(callback) {
    var nombre = document.getElementById("nombreDiplomado").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var exists = JSON.parse(this.responseText).exists;
            if (exists) {
                displayError("Ese diplomado ya existe.", 'nombre');
            } else {
                clearError('nombre');
            }
            if (typeof callback === 'function') {
                callback(!exists); // Llama al callback con true si el diplomado no existe
            }
        }
    };
    xmlhttp.open("GET", "/diplomado/check_diplomado?nombre=" + encodeURIComponent(nombre), true);
    xmlhttp.send();
}

function validateAll() {
    var formValid = validateForm();
    checkDiplomadoExists(function (diplomadoNoExiste) {
        formValid = formValid && diplomadoNoExiste; // Solo si ambas validaciones son true, el formulario es válido
        document.getElementById('btnSubmit').disabled = !formValid;
    });
}

function displayError(message, type) {
    var errorElement;
    if (type === 'form') {
        errorElement = document.getElementById('errorForm');
    } else if (type === 'precio') {
        errorElement = document.getElementById('errorPrecio');
    } else if (type === 'nombre') {
        errorElement = document.getElementById('errorNombre');
    }

    if (errorElement) {
        errorElement.textContent = message; // Mostrar el mensaje de error
    }
}

function clearError(type) {
    var errorElement;
    if (type === 'form') {
        errorElement = document.getElementById('errorForm');
    } else if (type === 'precio') {
        errorElement = document.getElementById('errorPrecio');
    } else if (type === 'nombre') {
        errorElement = document.getElementById('errorNombre');
    }

    if (errorElement) {
        errorElement.textContent = ''; // Limpiar el mensaje de error
    }
}

function validateAll() {
    var formValid = validateForm();
    checkDiplomadoExists(function (diplomadoNoExiste) {
        formValid = formValid && diplomadoNoExiste; // Solo si ambas validaciones son true, el formulario es válido
        document.getElementById('btnSubmit').disabled = !formValid;
    });
}


function validateAll() {
    var formValid = validateForm();
    checkDiplomadoExists(function (diplomadoNoExiste) {
        formValid = formValid && diplomadoNoExiste; // Solo si ambas validaciones son true, el formulario es válido
        document.getElementById('btnSubmit').disabled = !formValid;
    });
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