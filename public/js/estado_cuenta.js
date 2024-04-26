function deuda() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');

    tab_pagos.classList.remove('is-active');
    tab_deuda.classList.add('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Poner la tabla de deuda
    const tabla_deuda = document.querySelector('#deuda');
    tabla_deuda.classList.remove('is-hidden');
}

function pagos() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');

    tab_deuda.classList.remove('is-active');
    tab_pagos.classList.add('is-active');

    // Activar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.remove('is-hidden');

    // Quitar la tabla con deudas
    const tabla_deuda = document.querySelector('#deuda');
    tabla_deuda.classList.add('is-hidden');
}