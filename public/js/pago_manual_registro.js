function pago_extra() {
    // Cambias las bars que estan activas
    const tab_pago_normal = document.querySelector('#nav_pago_normal');
    const tab_pagos_extras = document.querySelector('#nav_pago_extra');

    tab_pago_normal.classList.remove('is-active');
    tab_pagos_extras.classList.add('is-active');

    // Quitar la tabla sin solicitudes
    const pago_normal = document.querySelector('#pago_normal');
    pago_normal.classList.add('is-hidden');

    // Poner la tabla con solicitudes
    const pago_extra = document.querySelector('#pago_extra');
    pago_extra.classList.remove('is-hidden');

    // Mover la info que se enseña
    const info_pago_normal = document.querySelector('#info_pago_normal');
    info_pago_normal.classList.add('is-hidden');

    const info_pago_extra = document.querySelector('#info_pago_extra');
    info_pago_extra.classList.remove('is-hidden');
}

function pago_normal() {
    // Cambias las bars que estan activas
    const tab_pago_normal = document.querySelector('#nav_pago_normal');
    const tab_pagos_extras = document.querySelector('#nav_pago_extra');

    tab_pago_normal.classList.add('is-active');
    tab_pagos_extras.classList.remove('is-active');

    // Activar la tabla sin solicitudes
    const pago_normal = document.querySelector('#pago_normal');
    pago_normal.classList.remove('is-hidden');

    // Quitar la tabla con solicitudes
    const pago_extra = document.querySelector('#pago_extra');
    pago_extra.classList.add('is-hidden');

    // Mover la info que se enseña
    const info_pago_normal = document.querySelector('#info_pago_normal');
    info_pago_normal.classList.remove('is-hidden');

    const info_pago_extra = document.querySelector('#info_pago_extra');
    info_pago_extra.classList.add('is-hidden');
}

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'dd/MM/yyyy',
    maxDate: new Date(),
    weekStart: 1,
    lang: 'es',
    showFooter: false
});

$('#pago').change(function () {
    // Saca la opción seleccionada
    let opcion = $(this).find(':selected');
    // Sacas el monto de la opcion con data-monto
    let num_monto = $(this).find(':selected').data('monto');
    let motivo = $(this).find(':selected').text();
    // Cambias el DOM para mostrar el precio correcto
    const monto = document.querySelector('#monto');

    // Sacar los inputs personalizados
    const motivoCustom = document.getElementById("motivo-custom");
    const montoCustom = document.getElementById("monto-custom-total");
    const montoAuto = document.getElementById("monto-total");

    if (opcion.val() === 'custom') {
        motivoCustom.style.display = 'block';
        montoCustom.style.display = 'block';
        montoAuto.style.display = 'none';
        monto.value = '';
    } else {
        motivoCustom.style.display = 'none';
        montoCustom.style.display = 'none';
        montoAuto.style.display = 'block';

        monto.value = num_monto.toLocaleString('mx', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
    });
    // Cambias el DOM dentro del modal
    document.querySelector('#monto_modal').innerHTML = '<strong>Monto Pagado: </strong> $' + num_monto
        .toLocaleString('mx', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    document.querySelector('#motivo_modal').innerHTML = '<strong>Motivo: </strong>' + motivo;
    }
});

$('#metodo').change(function () {
    // Sacas el metodo de la opcion seleccionada
    let metodo_seleccionado = $(this).find(':selected').text();
    // Cambias el DOM para mostrar el precio correcto
    const metodo = document.querySelector('#metodo_modal');
    metodo.innerHTML = metodo_seleccionado;
});

$('#metodo_col').change(function () {
    // Sacas el metodo de la opcion seleccionada
    let metodo_seleccionado = $(this).find(':selected').text();
    // Cambias el DOM para mostrar el precio correcto
    const metodo = document.querySelector('#metodo_modal_col');
    metodo.innerHTML = metodo_seleccionado;
});

// Para modificar la nota en el modal haces lo siguiente:
const nota = document.querySelector('#nota');
const nota_col = document.querySelector('#nota_col');

function cambiar_nota_modal() {
    document.querySelector('#nota_modal').innerHTML = nota.value;
};

function cambiar_nota_modal_col() {
    document.querySelector('#nota_modal_col').innerHTML = nota_col.value;
};

// Agregas el event listener de la nota para ponerlo en el modal
nota.addEventListener('input', cambiar_nota_modal);
if (nota_col) {
    nota_col.addEventListener('input', cambiar_nota_modal_col);
}


// Para modificar la fecha en el modal haces lo siguiente:
const fecha = document.querySelector('#fechapago');
const fecha_col = document.querySelector('#fechapago_col');

function cambiar_fecha_modal() {
    document.querySelector('#fecha_modal').innerHTML = fecha.value;
};

function cambiar_fecha_modal_col() {
    document.querySelector('#fecha_modal_col').innerHTML = fecha_col.value;
};

// Para modificar la fecha en el modal haces lo siguiente:
const boton_pago_extra = document.querySelector('#Boton_registrar_pago_extra');
const boton_pago_col = document.querySelector('#boton_pago_col');

// Crear constantes para acceder a HTML
const motivo = document.querySelector('#motivo_col');
const monto = document.querySelector('#monto_col');
const ayuda_motivo = document.querySelector('#ayuda_motivo');
const ayuda_monto_vacio = document.querySelector('#ayuda_monto_vacio');
const ayuda_monto_negativo = document.querySelector('#ayuda_monto_negativo');
const ayuda_monto_exponente = document.querySelector('#ayuda_monto_exponente');
const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_col');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido() {
    boton_pago_col.disabled = motivo.value.length === 0 || monto.value.length === 0 ||
        parseFloat(monto.value) <= 0 || monto.value.includes('e') || monto.value.includes('E') || 
        fecha_col.value.length === 0;
}

window.addEventListener('load', cambiar_fecha_modal);
boton_pago_extra.addEventListener('click', cambiar_fecha_modal);

if (fecha_col) {
    window.addEventListener('load', cambiar_fecha_modal_col);
    boton_pago_col.addEventListener('click', cambiar_fecha_modal_col);
}

function clear_button() {
    ayuda_fecha.classList.remove('is-hidden');
    checar_contenido();
}

function clear_button_pago_extra() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_extra');
    ayuda_fecha.classList.remove('is-hidden');
    boton_pago_extra.disabled = true;
}

// Sacar los botones de clear para agregar validaciones
const clear = document.querySelectorAll('.datetimepicker-clear-button');
let count = 0;
clear.forEach((button) => {
    if (clear.length == 2) {
        if (count == 0) {
            button.addEventListener('click', clear_button)
        } else if (count == 1) {
            button.addEventListener('click', clear_button_pago_extra)
        }
        count++;
    } else if (clear.length == 1) {
        button.addEventListener('click', clear_button_pago_extra)
    }
})

function activate_clear_button() {
    ayuda_fecha.classList.add('is-hidden');
    checar_contenido();
}

function activate_clear_button_pago_extra() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_extra');
    ayuda_fecha.classList.add('is-hidden');
    boton_pago_extra.disabled = false;
}

let count_activate = 0;
calendars.forEach((calendar) => {
    if (clear.length == 2) {
        if (count_activate == 0) {
            calendar.on('hide', activate_clear_button);
        } else if (count_activate == 1) {
            calendar.on('hide', activate_clear_button_pago_extra);
        }
        count_activate++;
    } else if (clear.length == 1) {
        calendar.on('hide', activate_clear_button_pago_extra);
    }
})

function cambiar_motivo_monto_modal() {
    document.querySelector('#motivo_modal_col').innerHTML = '<strong>Motivo: </strong>' + motivo.value;
    document.querySelector('#monto_modal_col').innerHTML = '<strong>Monto Pagado: </strong> $' +
        monto.value.toLocaleString('mx', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
};

window.addEventListener('load', cambiar_motivo_monto_modal);

// Activar mensaje si el motivo no tiene input
function mensaje_motivo() {
    if (motivo.value.length === 0) {
        ayuda_motivo.classList.remove('is-hidden');
    } else {
        ayuda_motivo.classList.add('is-hidden');
    }
}

function mensaje_monto() {
    if (monto.value.length === 0) {
        ayuda_monto_vacio.classList.remove('is-hidden');
    } else {
        ayuda_monto_vacio.classList.add('is-hidden');
    }

    if (parseFloat(monto.value) <= 0) {
        ayuda_monto_negativo.classList.remove('is-hidden');
    } else {
        ayuda_monto_negativo.classList.add('is-hidden');
    }

    if (monto.value.includes('e') || monto.value.includes('E')) {
        ayuda_monto_exponente.classList.remove('is-hidden');
    } else {
        ayuda_monto_exponente.classList.add('is-hidden');
    }
}

// Detectar si el usuario maneja input y llamar las funciones anteriores
// Agregar event listener solo si existe el elemento
if (monto) {
    monto.addEventListener('input', cambiar_motivo_monto_modal);
    monto.addEventListener('input', mensaje_monto);
    monto.addEventListener('input', checar_contenido);
}

if (motivo) {
    motivo.addEventListener('input', cambiar_motivo_monto_modal);
    motivo.addEventListener('input', checar_contenido);
    motivo.addEventListener('input', mensaje_motivo);
}

const notificacion_no_colegiatura = document.querySelector('#btn_no_colegiatura');

if (notificacion_no_colegiatura) {
    notificacion_no_colegiatura.addEventListener('click', () => {
        document.getElementById('no_colegiatura').classList.add('is-hidden');
    });
};

const notificacion_no_diplomado = document.querySelector('#btn_cursa_diplomado');

if (notificacion_no_diplomado) {
    notificacion_no_diplomado.addEventListener('click', () => {
        document.getElementById('no_cursa_diplomado').classList.add('is-hidden');
    });
};