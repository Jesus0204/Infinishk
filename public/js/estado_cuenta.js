function deuda() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_extras = document.querySelector('#nav_extras');

    tab_pagos.classList.remove('is-active');
    tab_extras.classList.remove('is-active');
    tab_deuda.classList.add('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de extras
    const tabla_extras = document.querySelector('#extras');
    tabla_extras.classList.add('is-hidden');

    // Poner la tabla de deuda
    const tabla_deuda = document.querySelector('#deuda');
    tabla_deuda.classList.remove('is-hidden');
}

function pagos() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_extras = document.querySelector('#nav_extras');

    tab_deuda.classList.remove('is-active');
    tab_extras.classList.remove('is-active');
    tab_pagos.classList.add('is-active');

    // Quitar la tabla con deudas
    const tabla_deuda = document.querySelector('#deuda');
    tabla_deuda.classList.add('is-hidden');

    // Quitar la tabla de extras
    const tabla_extras = document.querySelector('#extras');
    tabla_extras.classList.add('is-hidden');

    // Poner la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.remove('is-hidden');
}

function extras() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_extras = document.querySelector('#nav_extras');

    tab_deuda.classList.remove('is-active');
    tab_pagos.classList.remove('is-active');
    tab_extras.classList.add('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de deudas
    const tabla_deuda = document.querySelector('#deuda');
    tabla_deuda.classList.add('is-hidden');

    // Poner la tabla de extras
    const tabla_extras = document.querySelector('#extras');
    tabla_extras.classList.remove('is-hidden');
}

function pagoscol() {
    const tab_pagoscol = document.querySelector('#nav_pagoscol');
    const tab_pagosextra = document.querySelector('#nav_pagosextra');
   
    tab_pagosextra.classList.remove('is-active');
    tab_pagoscol.classList.add('is-active');

    // Quitar la tabla de extras
    const tabla_extras = document.querySelector('#pagosextra');
    tabla_extras.classList.add('is-hidden');

    // Poner la tabla de pagos colegiatura
    const tabla_pagoscol = document.querySelector('#pagoscol');
    tabla_pagoscol.classList.remove('is-hidden');
}

function pagosextra() {
    const tab_pagoscol = document.querySelector('#nav_pagoscol');
    const tab_pagosextra = document.querySelector('#nav_pagosextra');
   
    tab_pagosextra.classList.add('is-active');
    tab_pagoscol.classList.remove('is-active');

    // Quitar la tabla de pagos colegiatura
    const tabla_pagoscol = document.querySelector('#pagoscol');
    tabla_pagoscol.classList.add('is-hidden');

    // Poner la tabla de pagos extras
    const tabla_extras = document.querySelector('#pagosextra');
    tabla_extras.classList.remove('is-hidden');
}
