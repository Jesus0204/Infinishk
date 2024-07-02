const btnSubmit = document.querySelector('#btnSubmit');
const nombre = document.querySelector('#nombre');
const precio = document.querySelector('#precio');
const fecha = document.querySelector('#fecha');

const ayuda_nombre_vacio = document.querySelector('#ayuda_nombre_vacio');
const ayuda_nombre_duplicado = document.querySelector('#ayuda_nombre_duplicado');
const ayuda_precio_vacio = document.querySelector('#ayuda_precio_vacio');
const ayuda_precio_exponente = document.querySelector('#ayuda_precio_exponente');
const ayuda_precio_negativo = document.querySelector('#ayuda_precio_negativo');
const ayuda_fecha_vacia = document.querySelector('#ayuda_fecha_vacia');

//Initialize all input of date type
const calendars = bulmaCalendar.attach('#fecha', {
    startDate: new Date(),
    endDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'dd/MM/yyyy',
    weekStart: 1,
    lang: 'es',
    showFooter: false, 
    isRange: true
});

function message_clear_button(){
    ayuda_fecha_vacia.classList.add('is-hidden');
    checar_contenido();
}

calendars.forEach((calendar) => {
    calendar.on('hide', message_clear_button)
});

function clear_button() {
    ayuda_fecha_vacia.classList.remove('is-hidden');
    btnSubmit.disabled = true;
}

const clear_fecha = document.querySelector('.datetimepicker-clear-button');
    if (clear_fecha) {
        clear_fecha.addEventListener('click', clear_button);
    }

// Checar si hay contenido dentro del input, para desactivar el boton
function checar_contenido() {
    btnSubmit.disabled = nombre.value.length === 0 || precio.value.length === 0 || fecha.value.length === 0;
}

function mensaje_nombre() {
    if (nombre.value.length === 0) {
        ayuda_nombre_vacio.classList.remove('is-hidden');
    } else {
        ayuda_nombre_vacio.classList.add('is-hidden');
    }
}

function mensaje_precio() {
    if (precio.value.length === 0) {
        ayuda_precio_vacio.classList.remove('is-hidden');
    } else {
        ayuda_precio_vacio.classList.add('is-hidden');
    }

    if (precio.value.match(/[eE]/)) {
        ayuda_precio_exponente.classList.remove('is-hidden');
        btnSubmit.disabled = true;
    } else {
        ayuda_precio_exponente.classList.add('is-hidden');
    }

    if (parseFloat(precio.value) <= 0) {
        ayuda_precio_negativo.classList.remove('is-hidden');
        btnSubmit.disabled = true;
    } else {
        ayuda_precio_negativo.classList.add('is-hidden');
    }
}

function checkDiplomadoExists(callback) {
    var nombreCheck = document.getElementById('nombre').value;
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var exists = JSON.parse(this.responseText).exists;
            if (exists) {
                ayuda_nombre_duplicado.classList.remove('is-hidden');
                btnSubmit.disabled = true;
            } else {
                ayuda_nombre_duplicado.classList.add('is-hidden');
            }
            if (typeof callback === 'function') {
                callback(!exists); // Llama al callback con true si el diplomado no existe
            }
        }
    };
    xmlhttp.open("GET", "/diplomado/check_diplomado?nombre=" + encodeURIComponent(nombreCheck), true);
    xmlhttp.send();
}

if (nombre){
    // Detectar si el usuario maneja input y llamar las funciones anteriores
    nombre.addEventListener('input', checar_contenido);
    nombre.addEventListener('input', mensaje_nombre);
    nombre.addEventListener('blur', checkDiplomadoExists);
}

if (precio){
    // Detectar si el usuario maneja input y llamar las funciones anteriores
    precio.addEventListener('input', checar_contenido);
    precio.addEventListener('input', mensaje_precio);
}

if (fecha){
    fecha.addEventListener('input', checar_contenido);
}