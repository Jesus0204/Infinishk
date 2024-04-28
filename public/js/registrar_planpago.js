document.getElementById('numeroPagos').addEventListener('input', checkPlanExists);

const numPagos = document.getElementById("numeroPagos");
const nombre = document.getElementById("nombrePlan");
const btn_aplicar_cambios = document.getElementById('btn_aplicar_cambios');
const ayuda_nombre = document.querySelector('#ayuda_nombre');
const ayuda_num_vacio = document.querySelector('#ayuda_num_vacio');
const ayuda_num_negativo = document.querySelector('#ayuda_num_negativo');
const ayuda_num_exponente = document.querySelector('#ayuda_num_exponente');
const existente = document.querySelector('#existente');

// Checar si hay contenido dentro del input, pata desactivar el boton
function checar_contenido() {
    btn_aplicar_cambios.disabled = nombre.value.length === 0 || numPagos.value.length === 0 || numPagos.value < 0 ||
        parseFloat(numPagos.value) <= 0;
}

// Activar mensaje si el motivo no tiene input
function mensaje_nombre() {
    if (nombre.value.length === 0) {
        ayuda_nombre.classList.remove('is-hidden');
    } else {
        ayuda_nombre.classList.add('is-hidden');
    }
}

function mensaje_numPagos() {
    if (numPagos.value.length === 0) {
        ayuda_num_vacio.classList.remove('is-hidden');
    } else {
        ayuda_num_vacio.classList.add('is-hidden');
    }

    if (parseFloat(numPagos.value) <= 0) {
        ayuda_num_negativo.classList.remove('is-hidden');
    } else {
        ayuda_num_negativo.classList.add('is-hidden');
    }

    if (numPagos.value.includes('e') || numPagos.value.includes('E')) {
        btn_aplicar_cambios.disabled = true;
        ayuda_num_exponente.classList.remove('is-hidden');
    } else {
        ayuda_num_exponente.classList.add('is-hidden');
    }
}

// Detectar si el usuario maneja input y llamar las funciones anteriores
nombre.addEventListener('input', checar_contenido);
numPagos.addEventListener('input', checar_contenido);
nombre.addEventListener('input', mensaje_nombre);
numPagos.addEventListener('input', mensaje_numPagos);

function checkPlanExists() {
    let num = document.getElementById("numeroPagos").value;

    if (num){
        //función que manda la petición asíncrona
        fetch('/configuracion/check_planpago/' + num, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((result) => {
            return result.json(); //Regresa otra promesa
        }).then((data) => {
            if (data.exists == true){
                existente.classList.remove('is-hidden');
                document.getElementById('btn_aplicar_cambios').disabled = true;
            }
        });
    } else {
        existente.classList.add('is-hidden');
    }


}

