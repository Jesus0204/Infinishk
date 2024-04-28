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
