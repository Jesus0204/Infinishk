const tipo = document.getElementById("tipo");

const info_pago_normal = document.querySelector('#info_pago_normal');
const pago_extra = document.querySelector('#pago_extra');
const pago_colegiatura = document.querySelector('#pago_colegiatura');

const modal_title = document.querySelector('#modal_title');
const modal_title_2 = document.querySelector('#modal_title_2');
const modal_title_3 = document.querySelector('#modal_title_3');
const alumno = document.querySelector('#matricula');

const boton_pagar = document.getElementById('Boton_pagar_1');
const boton_pagar_2 = document.getElementById('Boton_pagar_2');
const boton_pagar_3 = document.getElementById('Boton_pagar_3');

function hideNormal() {
    if (tipo.value == 'Normal') {
        info_pago_normal.classList.remove('is-hidden');
    } else if (tipo.value == 'Otro') {
        info_pago_normal.classList.add('is-hidden');
    }
}

// Checar si hay contenido dentro del input, para desactivar el boton
function checar_contenido() {
    boton_pagar.disabled = monto.value.length === 0 || parseFloat(monto.value) <= 0;
    boton_pagar_2.disabled = monto.value.length === 0 || parseFloat(monto.value) <= 0;
    boton_pagar_3.disabled = monto.value.length === 0 || parseFloat(monto.value) <= 0;
}

function change_input() {
    if (tipo.value == 'Normal') {
        // Sacas los antiguos ids
        const motivo_old = document.querySelector('#motivo');
        const monto_old = document.querySelector('#monto');

        // Sacas los que van a ser nuevos ids
        const motivo_new = document.querySelector('#motivo_no_usar');
        const monto_new = document.querySelector('#monto_no_usar');

        pago_colegiatura.classList.remove('is-hidden');
        pago_extra.classList.add('is-hidden');

        // Cambias los old a los que no se van a usar
        motivo_old.id = 'motivo_no_usar';
        monto_old.id = 'monto_no_usar';

        // Cambias los new a los que se van a usar
        motivo_new.id = 'motivo';
        monto_new.id = 'monto';

        checar_contenido();

        if (alumno.value[0] == '1') {
            modal_title.innerHTML = '<strong>Pago de Colegiatura</strong>';
            modal_title_2.innerHTML = '<strong>Pago de Colegiatura</strong>';
            modal_title_3.innerHTML = '<strong>Pago de Colegiatura</strong>';
        } else if (alumno.value[0] == '8') {
            modal_title.innerHTML = '<strong>Pago de Diplomado</strong>';
            modal_title_2.innerHTML = '<strong>Pago de Diplomado</strong>';
            modal_title_3.innerHTML = '<strong>Pago de Diplomado</strong>';
        }
    } else if (tipo.value == 'Otro') {
        // Sacas los antiguos ids
        const motivo_old = document.querySelector('#motivo');
        const monto_old = document.querySelector('#monto');

        // Sacas los que van a ser nuevos ids
        const motivo_new = document.querySelector('#motivo_no_usar');
        const monto_new = document.querySelector('#monto_no_usar');

        pago_colegiatura.classList.add('is-hidden');
        pago_extra.classList.remove('is-hidden');

        // Cambias los old a los que no se van a usar
        motivo_old.id = 'motivo_no_usar';
        monto_old.id = 'monto_no_usar';

        // Cambias los new a los que se van a usar
        motivo_new.id = 'motivo';
        monto_new.id = 'monto';

        // Cambias el titulo del modal
        let motivo = $('.motivo_extra').find(':selected').val();
        modal_title.innerHTML = '<strong>Pago de ' + motivo + '</strong>';
        modal_title_2.innerHTML = '<strong>Pago de ' + motivo + '</strong>';
        modal_title_3.innerHTML = '<strong>Pago de ' + motivo + '</strong>';

        boton_pagar.disabled = false;
        boton_pagar_2.disabled = false;
        boton_pagar_3.disabled = false;
    }
}

tipo.addEventListener('change', hideNormal);
tipo.addEventListener('change', change_input);

// Haces que cambie el monto del dropdown
$('.motivo_extra').change(function () {
    // Sacas el monto de la opcion con data-monto
    let num_monto = $(this).find(':selected').data('monto');
    const monto = document.querySelector('#monto');
    monto.value = num_monto;

    const id_liquida = document.querySelector('#liquida');

    let id_liquida_seleccionado = $(this).find(':selected').data('idliquida');

    if (id_liquida) {
        id_liquida.value = id_liquida_seleccionado;
    }

    // Cambias el titulo del modal
    let motivo = $(this).find(':selected').val();
    modal_title.innerHTML = '<strong>Pago de ' + motivo + '</strong>';
    modal_title_2.innerHTML = '<strong>Pago de ' + motivo + '</strong>';
    modal_title_3.innerHTML = '<strong>Pago de ' + motivo + '</strong>';
});

function pagar() {
    const monto = document.getElementById('monto').value;
    const motivo = document.getElementById('motivo').value;
    const csrf = document.getElementById('_csrf').value;
    const matricula = document.getElementById('matricula').value;
    const deuda = document.getElementById('deuda');  

    let deuda_mandar = '';
    if (deuda && tipo.value == 'Normal'){
        deuda_mandar = deuda.value;
    }

    let liquida_seleccionado = '';
    const liquida = document.getElementById('liquida')
    if (liquida && tipo.value == 'Otro') {
        liquida_seleccionado = liquida.value;
    }
    const nota = document.getElementById('nota').value;

    const id_diplomado = document.getElementById('diplomado');
    let id_diplomado_cursando = '';
    if (matricula[0] == '8' && id_diplomado) {
        id_diplomado_cursando = id_diplomado.value;
    }

    fetch('/estado_cuenta/mandar_pago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            monto: monto,
            matricula: matricula,
            tipo_pago: tipo.value, 
            motivo: motivo,
            nota: nota,
            id_deuda: deuda_mandar,
            id_liquida: liquida_seleccionado,
            id_diplomado: id_diplomado_cursando,
        })
    }).then((result) => {
        return result.json();
    }).then((data) => {
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(data.respuestaXML, "text/xml");

        let liga_pago = (xmlDoc.getElementsByTagName("nb_url")[0].childNodes[0].nodeValue);

        window.location.href = liga_pago;
    }).catch(err => {
        console.log(err);
    });
}

if (boton_pagar) {
    boton_pagar.addEventListener('click', function () {
        pagar();
    });
}


const boton_tarjeta = document.querySelector('#boton_tarjeta');
const boton_efectivo = document.querySelector('#boton_efectivo');
const boton_transferencia = document.querySelector('#boton_transferencia');

const mensaje_tarjeta = document.querySelector('#mensaje_tarjeta');
const notaSection = document.getElementById('nota').parentElement.parentElement;

function change_modal() {
    if (metodo.value == 'Web Tarjeta') {
        mensaje_tarjeta.classList.remove('is-hidden');
        boton_tarjeta.classList.remove('is-hidden');
        boton_efectivo.classList.add('is-hidden');
        boton_transferencia.classList.add('is-hidden');
        notaSection.style.display = 'block';
    } else if (metodo.value == 'Efectivo') {
        mensaje_tarjeta.classList.add('is-hidden');
        boton_tarjeta.classList.add('is-hidden');
        boton_efectivo.classList.remove('is-hidden');
        boton_transferencia.classList.add('is-hidden');
        notaSection.style.display = 'none';
    } else if (metodo.value == 'Transferencia') {
        mensaje_tarjeta.classList.add('is-hidden');
        boton_tarjeta.classList.add('is-hidden');
        boton_efectivo.classList.add('is-hidden');
        boton_transferencia.classList.remove('is-hidden');
        notaSection.style.display = 'none';
    }
}

const metodo = document.getElementById("metodo");
metodo.addEventListener('change', change_modal);

const motivo = document.querySelector('#motivo');
const monto = document.querySelector('#monto');

const ayuda_motivo = document.querySelector('#ayuda_motivo');
const ayuda_monto_vacio = document.querySelector('#ayuda_monto_vacio');
const ayuda_monto_negativo = document.querySelector('#ayuda_monto_negativo');
const ayuda_monto_exponente = document.querySelector('#ayuda_monto_exponente');

function mensaje_monto() {
    ayuda_monto_negativo.style.marginBottom = '0em';
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
        boton_pagar.disabled = true;
        boton_pagar_2.disabled = true;
        boton_pagar_3.disabled = true;
        ayuda_monto_exponente.classList.remove('is-hidden');

        if (monto.value < 0) {
            ayuda_monto_negativo.style.marginBottom = '-1em';
        }
    } else {
        ayuda_monto_exponente.classList.add('is-hidden');
    }
};



// Detectar si el usuario maneja input y llamar las funciones anteriores
motivo.addEventListener('input', checar_contenido);
monto.addEventListener('input', checar_contenido);
monto.addEventListener('input', mensaje_monto);