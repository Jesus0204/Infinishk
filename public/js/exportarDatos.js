let twoMonthsAgo = moment().subtract(2, 'months');

// Initialize all input of date type.
const calendars = bulmaCalendar.attach('[type="date"]', {
    startDate: new Date(twoMonthsAgo.format()),
    endDate: new Date(),
    displayMode: 'dialog',
    dateFormat: 'dd/MM/yyyy',
    maxDate: new Date(),
    weekStart: 1,
    lang: 'es',
    showFooter: false, 
    isRange: true
});

const btn_exportar = document.querySelector('#btn_exportar');

function activate_button(){
    btn_exportar.disabled = false;
}

function deactivate_button(){
    btn_exportar.disabled = true;
}

function clear_message() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_1');
    ayuda_fecha.classList.remove('is-hidden');
    deactivate_button();
}

function activate_message() {
    const ayuda_fecha = document.getElementById('ayuda_fecha_vacia_1');
    ayuda_fecha.classList.add('is-hidden');

     if ($('#colegiatura').is(":checked") == true ||
         $('#pag_dipl').is(":checked") == true ||
         $('#extra').is(":checked") == true) {
             activate_button();
         }
}

const fecha = document.querySelector('#fecha');

// Sacar los botones de clear para agregar validaciones
const clear = document.querySelectorAll('.datetimepicker-clear-button');
clear.forEach((button) => {
    button.addEventListener('click', clear_message)
})

calendars.forEach((calendar) => {
    calendar.on('select', activate_message);
})

const check_colegiatura = document.querySelector('#colegiatura');
const check_diplomado = document.querySelector('#pag_dipl');
const check_extra = document.querySelector('#extra');

function check_checkbox(){
    if ($('#colegiatura').is(":checked") == true ||
        $('#pag_dipl').is(":checked") == true ||
        $('#extra').is(":checked") == true) {
        
        if (fecha.value.length > 0){
            activate_button();
        }
    } else {
        deactivate_button();
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