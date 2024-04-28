const correoElectronico_NoAlumno = document.querySelector('#correoElectronico_NoAlumno');
const IDUsuario_NoAlumno = document.querySelector('#IDUsuario_NoAlumno');

$(document).ready(function() {
    $('#roles').change(function() {
        if ($(this).val() === 'Alumno') {
            $('#alumnoFields').show();
            $('#noAlumnoFields').hide();
        } else {
            $('#alumnoFields').hide();
            $('#noAlumnoFields').show();

            IDUsuario_NoAlumno.placeholder = `Matrícula del Nuevo ${$(this).val()}`;
            correoElectronico_NoAlumno.placeholder = `Correo del Nuevo ${$(this).val()}`;
        }
    });
});

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'yyyy/MM/dd',
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
function checar_contenido() {
    Boton_registrar.disabled = IDUsuario_NoAlumno.value.length === 0 || correoElectronico_NoAlumno.value.length === 0;
}

// Activar mensaje si el motivo no tiene input
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

IDUsuario_NoAlumno.addEventListener('input', checar_contenido);
IDUsuario_NoAlumno.addEventListener('input', mensaje_matricula);
correoElectronico_NoAlumno.addEventListener('input', checar_contenido);
correoElectronico_NoAlumno.addEventListener('input', mensaje_correo);

