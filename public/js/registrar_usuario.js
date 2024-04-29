const correoElectronico_NoAlumno = document.querySelector('#correoElectronico_NoAlumno');
const IDUsuario_NoAlumno = document.querySelector('#IDUsuario_NoAlumno');
const boton_no_Alumno = document.querySelector('#boton_no_Alumno');
const boton_Alumno = document.querySelector('#boton_Alumno');

$(document).ready(function() {
    $('#roles').change(function() {
        if ($(this).val() === 'Alumno') {
            $('#alumnoFields').show();
            $('#noAlumnoFields').hide();
            boton_no_Alumno.classList.add('is-hidden');
            boton_Alumno.classList.remove('is-hidden');
        } else {
            $('#alumnoFields').hide();
            $('#noAlumnoFields').show();

            boton_no_Alumno.classList.remove('is-hidden');
            boton_Alumno.classList.add('is-hidden');

            IDUsuario_NoAlumno.placeholder = `Matrícula del Nuevo ${$(this).val()}`;
            correoElectronico_NoAlumno.placeholder = `Correo del Nuevo ${$(this).val()}`;
        }
    });
});

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'dd/MM/yyyy',
    maxDate: new Date(),
    weekStart: 1,
    lang: 'es',
    showFooter: false, 
    isRange: false
});

// Crear constantes para acceder a HTML
const Boton_registrar = document.querySelector('#Boton_registrar');
const ayuda_matricula_noAlumno = document.querySelector('#ayuda_matricula_noAlumno');
const ayuda_correo_noAlumno = document.querySelector('#ayuda_correo_noAlumno');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido_NoAlumno() {
    Boton_registrar.disabled = IDUsuario_NoAlumno.value.length === 0 || correoElectronico_NoAlumno.value.length === 0;
}

// Activar mensaje si la matricula no tiene input
function mensaje_matricula() {
    if (IDUsuario_NoAlumno.value.length === 0) {
        ayuda_matricula_noAlumno.classList.remove('is-hidden');
    } else {
        ayuda_matricula_noAlumno.classList.add('is-hidden');
    }
};

function mensaje_correo() {
    if (correoElectronico_NoAlumno.value.length === 0) {
        ayuda_correo_noAlumno.classList.remove('is-hidden');
    } else {
        ayuda_correo_noAlumno.classList.add('is-hidden');
    }
};

IDUsuario_NoAlumno.addEventListener('input', checar_contenido_NoAlumno);
IDUsuario_NoAlumno.addEventListener('input', mensaje_matricula);
correoElectronico_NoAlumno.addEventListener('input', checar_contenido_NoAlumno);
correoElectronico_NoAlumno.addEventListener('input', mensaje_correo);

const Boton_registrar_alumno = document.querySelector('#Boton_registrar_alumno');
const correoElectronico = document.querySelector('#correoElectronico');
const IDUsuario_Alumno = document.querySelector('#IDUsuario');
const nombre = document.querySelector('#nombre');
const apellidos = document.querySelector('#apellidos');
const referenciaBancaria = document.querySelector('#referenciaBancaria');
const fechaInscripcion = document.querySelector('#fechaInscripcion');
const ayuda_matricula_Alumno = document.querySelector('#ayuda_matricula_Alumno');
const ayuda_correo_Alumno = document.querySelector('#ayuda_correo_Alumno');
const ayuda_nombre = document.querySelector('#ayuda_nombre');
const ayuda_apellidos = document.querySelector('#ayuda_apellidos');
const ayuda_referencia = document.querySelector('#ayuda_referencia');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido() {
    Boton_registrar_alumno.disabled = IDUsuario_Alumno.value.length === 0 || correoElectronico.value.length === 0 ||
    nombre.value.length === 0 || apellidos.value.length === 0 || referenciaBancaria.value.length === 0 || 
    fechaInscripcion.value.length === 0;
}

function mensaje_matriculaAlumno() {
    if (IDUsuario_Alumno.value.length === 0) {
        ayuda_matricula_Alumno.classList.remove('is-hidden');
    } else {
        ayuda_matricula_Alumno.classList.add('is-hidden');
    }
};

function mensaje_correoAlumno() {
    if (correoElectronico.value.length === 0) {
        ayuda_correo_Alumno.classList.remove('is-hidden');
    } else {
        ayuda_correo_Alumno.classList.add('is-hidden');
    }
};

function mensaje_nombre() {
    if (nombre.value.length === 0) {
        ayuda_nombre.classList.remove('is-hidden');
    } else {
        ayuda_nombre.classList.add('is-hidden');
    }
};

function mensaje_apellidos() {
    if (apellidos.value.length === 0) {
        ayuda_apellidos.classList.remove('is-hidden');
    } else {
        ayuda_apellidos.classList.add('is-hidden');
    }
};

function mensaje_referencia() {
    if (referenciaBancaria.value.length === 0) {
        ayuda_referencia.classList.remove('is-hidden');
    } else {
        ayuda_referencia.classList.add('is-hidden');
    }
};

IDUsuario_Alumno.addEventListener('input', mensaje_matriculaAlumno);
correoElectronico.addEventListener('input', mensaje_correoAlumno);
nombre.addEventListener('input', mensaje_nombre);
apellidos.addEventListener('input', mensaje_apellidos);
referenciaBancaria.addEventListener('input', mensaje_referencia);

IDUsuario_Alumno.addEventListener('input', checar_contenido);
correoElectronico.addEventListener('input', checar_contenido);
nombre.addEventListener('input', checar_contenido);
apellidos.addEventListener('input', checar_contenido);
referenciaBancaria.addEventListener('input', checar_contenido);

const ayuda_fecha = document.querySelector('#ayuda_fecha');

function clear_button() {
    ayuda_fecha.classList.remove('is-hidden');
    checar_contenido();
}

function activate_clear_button() {
    ayuda_fecha.classList.add('is-hidden');
    checar_contenido();
}

// Validación de tacha de fecha
const clear = document.querySelector('.datetimepicker-clear-button');
clear.addEventListener('click', clear_button);

calendars.forEach((calendar) => {
    calendar.on('hide', activate_clear_button);
});
