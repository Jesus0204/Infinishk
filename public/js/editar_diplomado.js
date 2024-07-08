const btnSubmit = document.querySelector('#btnSubmit');
const nombre = document.querySelector('#nombre');
const precio = document.querySelector('#precio');
const fecha = document.querySelector('#fecha');

// Obtén las fechas de inicio y fin del diplomado
var fechaInicio = document.getElementById('fechaInicio').value;
var fechaFin = document.getElementById('fechaFin').value;

const ayuda_nombre_vacio = document.querySelector('#ayuda_nombre_vacio');
const ayuda_precio_vacio = document.querySelector('#ayuda_precio_vacio');
const ayuda_precio_exponente = document.querySelector('#ayuda_precio_exponente');
const ayuda_precio_negativo = document.querySelector('#ayuda_precio_negativo');
const ayuda_fecha_vacia = document.querySelector('#ayuda_fecha_vacia');

//Initialize all input of date type
const calendars = bulmaCalendar.attach('#fecha', {
    startDate: fechaInicio,
    endDate: fechaFin,
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

if (nombre){
    // Detectar si el usuario maneja input y llamar las funciones anteriores
    nombre.addEventListener('input', checar_contenido);
    nombre.addEventListener('input', mensaje_nombre);
}

if (precio){
    // Detectar si el usuario maneja input y llamar las funciones anteriores
    precio.addEventListener('input', checar_contenido);
    precio.addEventListener('input', mensaje_precio);
}

if (fecha){
    fecha.addEventListener('input', checar_contenido);
}