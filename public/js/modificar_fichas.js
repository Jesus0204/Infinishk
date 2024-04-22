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

for (count = 0; count < '<%= fichas.length %>'; count++) {
    // Crear constantes para acceder a HTML
    const bt_Modificar = document.querySelector('#Boton_modificar' + count);
    const fecha_lim = document.querySelector('#fecha_lim' + count);
    const fecha_mod = document.querySelector('#fecha_mod' + count);
    const descuento = document.querySelector('#descuento' + count);
    const nota = document.querySelector('#nota' + count);
    const ayuda_fecha_lim = document.querySelector('#ayuda_fecha_lim' + count);
    const ayuda_fecha_mod = document.querySelector('#ayuda_fecha_mod' + count);
    const ayuda_descuento_vacio = document.querySelector('#ayuda_descuento_vacio' + count);
    const ayuda_descuento_negativo = document.querySelector('#ayuda_descuento_negativo' + count);
    const ayuda_descuento_exponente = document.querySelector('#ayuda_descuento_exponente' + count);
    const ayuda_nota = document.querySelector('#ayuda_nota' + count);

    // Checar si hay contenido dentro del input, para desactivar el boton
    function checar_contenido() {
        bt_Modificar.disabled = fecha_lim.value.length === 0 || fecha_mod.value.length === 0 || descuento.value.length === 0 || nota.value.length === 0;
    }

    // Activar mensaje si el motivo no tiene input
    function mensaje_fecha_lim() {
        if (fecha_lim.value.length === 0) {
            ayuda_fecha_lim.classList.remove('is-hidden');
        } else {
            ayuda_fecha_mod.classList.add('is-hidden');
        }
    }

    function mensaje_fecha_mod() {
        if (fecha_mod.value.length === 0) {
            ayuda_fecha_lim.classList.remove('is-hidden');
        } else {
            ayuda_fecha_mod.classList.add('is-hidden');
        }
    }

    function mensaje_descuento() {
        if (descuento.value.length === 0) {
            ayuda_descuento_vacio.classList.remove('is-hidden');
        } else {
            ayuda_descuento_vacio.classList.add('is-hidden');
        }

        if (descuento.value < 0 || descuento.value === '-0') {
            bt_Modificar.disabled = true;
            ayuda_descuento_negativo.classList.remove('is-hidden');
        } else {
            ayuda_descuento_negativo.classList.add('is-hidden');
        }

        if (descuento.value.trim().toLowerCase().includes('e')) {
            bt_Modificar.disabled = true;
            ayuda_descuento_exponente.classList.remove('is-hidden');
        } else {
            ayuda_descuento_exponente.classList.add('is-hidden');
        }
    }

    function mensaje_nota() {
        if (nota.value.length === 0) {
            ayuda_nota.classList.remove('is-hidden');
        } else {
            ayuda_nota.classList.add('is-hidden');
        }
    }

    const ficha = document.querySelector('#ficha' + count);

    const boton_modificar = document.querySelector('#Boton_modificar' + count);

    // Detectar si el usuario maneja input y llamar las funciones anteriores
    document.addEventListener('DOMContentLoaded', function() {
        fecha_lim.addEventListener('input', checar_contenido);
        fecha_mod.addEventListener('input', checar_contenido);
        descuento.addEventListener('input', checar_contenido);
        nota.addEventListener('input', checar_contenido);
        fecha_lim.addEventListener('input', mensaje_fecha_lim);
        fecha_mod.addEventListener('input', mensaje_fecha_mod);
        descuento.addEventListener('input', mensaje_descuento);
        nota.addEventListener('input', mensaje_nota);
    });
};