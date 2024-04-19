// Crear constantes para acceder a HTML
const bt_Registrar = document.querySelector('#Boton_registrar');
const motivo = document.querySelector('#motivo');
const monto = document.querySelector('#monto');
const ayuda_motivo = document.querySelector('#ayuda_motivo');
const ayuda_monto_vacio = document.querySelector('#ayuda_monto_vacio');
const ayuda_monto_negativo = document.querySelector('#ayuda_monto_negativo');
const ayuda_monto_exponente = document.querySelector('#ayuda_monto_exponente');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido() {
    bt_Registrar.disabled = motivo.value.length === 0 || monto.value.length === 0 || monto.value < 0 ||
        parseFloat(monto.value) <= 0;
}

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
        bt_Registrar.disabled = true;
        ayuda_monto_exponente.classList.remove('is-hidden');
    } else {
        ayuda_monto_exponente.classList.add('is-hidden');
    }
}
// Detectar si el usuario maneja input y llamar las funciones anteriores
motivo.addEventListener('input', checar_contenido);
monto.addEventListener('input', checar_contenido);
motivo.addEventListener('input', mensaje_motivo);
monto.addEventListener('input', mensaje_monto);