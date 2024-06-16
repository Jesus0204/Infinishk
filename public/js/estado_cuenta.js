function deuda() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda){
        tab_deuda.classList.add('is-active');
    }

    tab_pagos.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_pagosExtra.classList.remove('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de extras
    const tabla_extras = document.querySelector('#extras');
    tabla_extras.classList.add('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.add('is-hidden');

    // Poner la tabla de deuda
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda){
        tabla_deuda.classList.remove('is-hidden');
    }
}

function pagos() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda){
        tab_deuda.classList.remove('is-active');
    }

    tab_solicitudes.classList.remove('is-active');
    tab_pagos.classList.add('is-active');
    tab_pagosExtra.classList.remove('is-active');

    // Quitar la tabla con deudas
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda){
        tabla_deuda.classList.add('is-hidden');
    }

    // Quitar la tabla de extras
    const tabla_extras = document.querySelector('#extras');
    tabla_extras.classList.add('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.add('is-hidden');

    // Poner la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.remove('is-hidden');
}

function extras() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda){
        tab_deuda.classList.remove('is-active');
    }

    tab_pagos.classList.remove('is-active');
    tab_solicitudes.classList.add('is-active');
    tab_pagosExtra.classList.remove('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de deudas
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda){
        tabla_deuda.classList.add('is-hidden');
    }

    // Poner la tabla de extras
    const tabla_extras = document.querySelector('#extras');
    tabla_extras.classList.remove('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.add('is-hidden');
}

function pagosExtra() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda) {
        tab_deuda.classList.remove('is-active');
    }

    tab_pagos.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_pagosExtra.classList.add('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de deudas
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda) {
        tabla_deuda.classList.add('is-hidden');
    }

    // Poner la tabla de extras
    const tabla_extras = document.querySelector('#extras');
    tabla_extras.classList.add('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.remove('is-hidden');
}
