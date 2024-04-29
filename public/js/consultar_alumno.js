/* Funciones para alternar entre usuarios activos y no activos */
function muestra_estado_de_cuenta() {
    const tab_estado = document.querySelector('#nav_estado');
    const tab_otros_cargos = document.querySelector('#nav_otros_cargos');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_horario = document.querySelector('#nav_horario');

    tab_otros_cargos.classList.remove('is-active');
    tab_historial_pagos.classList.remove('is-active');
    tab_horario.classList.remove('is-active');
    tab_estado.classList.add('is-active');

    const otros_cargos = document.querySelector('#otros_cargos');
    otros_cargos.classList.add('is-hidden');

    const historial = document.querySelector('#historial');
    historial.classList.add('is-hidden');

    const horario = document.querySelector('#horario');
    horario.classList.add('is-hidden');

    const estado_cuenta = document.querySelector('#estado_cuenta');
    estado_cuenta.classList.remove('is-hidden');
}

function muestra_otros_cargos() {
    const tab_estado = document.querySelector('#nav_estado');
    const tab_otros_cargos = document.querySelector('#nav_otros_cargos');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_horario = document.querySelector('#nav_horario');

    tab_historial_pagos.classList.remove('is-active');
    tab_horario.classList.remove('is-active');
    tab_estado.classList.remove('is-active');
    tab_otros_cargos.classList.add('is-active');

    const historial = document.querySelector('#historial');
    historial.classList.add('is-hidden');

    const horario = document.querySelector('#horario');
    horario.classList.add('is-hidden');

    const estado_cuenta = document.querySelector('#estado_cuenta');
    estado_cuenta.classList.add('is-hidden');

    const otros_cargos = document.querySelector('#otros_cargos');
    otros_cargos.classList.remove('is-hidden');
}

function muestra_historial_de_pagos() {
    const tab_estado = document.querySelector('#nav_estado');
    const tab_otros_cargos = document.querySelector('#nav_otros_cargos');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_horario = document.querySelector('#nav_horario');

    tab_horario.classList.remove('is-active');
    tab_estado.classList.remove('is-active');
    tab_otros_cargos.classList.remove('is-active');
    tab_historial_pagos.classList.add('is-active');

    const horario = document.querySelector('#horario');
    horario.classList.add('is-hidden');

    const estado_cuenta = document.querySelector('#estado_cuenta');
    estado_cuenta.classList.add('is-hidden');

    const otros_cargos = document.querySelector('#otros_cargos');
    otros_cargos.classList.add('is-hidden');

    const historial = document.querySelector('#historial');
    historial.classList.remove('is-hidden');
}

function muestra_historial_de_pagos() {
    const tab_estado = document.querySelector('#nav_estado');
    const tab_otros_cargos = document.querySelector('#nav_otros_cargos');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_horario = document.querySelector('#nav_horario');

    tab_estado.classList.remove('is-active');
    tab_otros_cargos.classList.remove('is-active');
    tab_historial_pagos.classList.remove('is-active');
    tab_horario.classList.add('is-active');

    const estado_cuenta = document.querySelector('#estado_cuenta');
    estado_cuenta.classList.add('is-hidden');

    const otros_cargos = document.querySelector('#otros_cargos');
    otros_cargos.classList.add('is-hidden');

    const historial = document.querySelector('#historial');
    historial.classList.add('is-hidden');

    const horario = document.querySelector('#horario');
    horario.classList.remove('is-hidden');
}