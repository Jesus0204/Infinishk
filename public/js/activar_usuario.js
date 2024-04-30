const correo = document.querySelector('#correo');
const matricula = document.querySelector('#matricula');

$(document).ready(function() {
    $('#roles').change(function() {
        if ($(this).val() === 'Alumno') {
            $('#alumnoFields').show();
            $('#noAlumnoFields').hide();
        } else {
            $('#alumnoFields').hide();
            $('#noAlumnoFields').show();

            matricula.placeholder = `Matrícula del Nuevo ${$(this).val()}`;
            correo.placeholder = `Correo del Nuevo ${$(this).val()}`;
        }
    });
});

// Crear constantes para acceder a HTML
const Boton_registrar = document.querySelector('#Boton_registrar');
const ayuda_matricula_noAlumno = document.querySelector('#ayuda_matricula_noAlumno');
const ayuda_correo_noAlumno = document.querySelector('#ayuda_correo_noAlumno');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido() {
    Boton_registrar.disabled = matricula.value.length === 0 || correo.value.length === 0;
}

// Activar mensaje si el motivo no tiene input
function mensaje_matricula() {
    if (matricula.value.length === 0) {
        ayuda_matricula_noAlumno.classList.remove('is-hidden');
    } else {
        ayuda_matricula_noAlumno.classList.add('is-hidden');
    }
};

function mensaje_correo() {
    if (correo.value.length === 0) {
        ayuda_correo_noAlumno.classList.remove('is-hidden');
    } else {
        ayuda_correo_noAlumno.classList.add('is-hidden');
    }
};

matricula.addEventListener('input', checar_contenido);
matricula.addEventListener('input', mensaje_matricula);
correo.addEventListener('input', checar_contenido);
correo.addEventListener('input', mensaje_correo);