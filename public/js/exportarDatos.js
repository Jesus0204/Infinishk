// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'yyyy/MM/dd',
    maxDate: new Date(),
    weekStart: 1,
    lang: 'es',
    showFooter: false
});

const btn_exportar = document.querySelector('#btn_exportar');

function clear_button_1() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_1');
    ayuda_fecha.classList.remove('is-hidden');
    btn_exportar.disabled = true;
}

function clear_button_2() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_2');
    ayuda_fecha.classList.remove('is-hidden');
    btn_exportar.disabled = true;
}

function activate_clear_button_1() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_1');
    ayuda_fecha.classList.add('is-hidden');
}

function activate_clear_button_2() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_2');
    ayuda_fecha.classList.add('is-hidden');
}

const fecha_fin = document.querySelector('#fecha_fin');
const fecha_inicio = document.querySelector('#fecha_inicio');

function activate_button(){
    if (fecha_fin.value.length != 0 && fecha_inicio.value.length != 0) {
        btn_exportar.disabled = false;
    }
}

// Sacar los botones de clear para agregar validaciones
const clear = document.querySelectorAll('.datetimepicker-clear-button');
let count = 0;
clear.forEach((button) => {
    if (count == 0) {
        button.addEventListener('click', clear_button_1)
    } else if (count == 1) {
        button.addEventListener('click', clear_button_2)
    }
    count++;
})

let count_activate = 0;
calendars.forEach((calendar) => {
    if (count_activate == 0) {
        calendar.on('select', activate_clear_button_1);
        calendar.on('hide', activate_button);
    } else if (count_activate == 1) {
        calendar.on('select', activate_clear_button_2);
        calendar.on('hide', activate_button);
    }
    count_activate++;
})

const check_colegiatura = document.querySelector('#colegiatura');
const check_diplomado = document.querySelector('#pag_dipl');
const check_extra = document.querySelector('#extra');

function check_checkbox(){
    if ($('#colegiatura').is(":checked") == true ||
        $('#pag_dipl').is(":checked") == true ||
        $('#extra').is(":checked") == true) {
        btn_exportar.disabled = false;
    } else {
        btn_exportar.disabled = true;
    }
}

check_colegiatura.addEventListener('click', check_checkbox);
check_diplomado.addEventListener('click', check_checkbox);
check_extra.addEventListener('click', check_checkbox);

document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('closeNotification');
    const errorNotification = document.getElementById('errorNotification');

    if (closeBtn){
        closeBtn.addEventListener('click', () => {
            errorNotification.style.display = 'none';
        });
    }
});