function con_solicitudes() {
    // Cambias las bars que estan activas
    const tab_sin_solicitudes = document.querySelector('#nav_sin_solicitudes');
    const tab_con_solicitudes = document.querySelector('#nav_con_solicitudes');

    tab_sin_solicitudes.classList.remove('is-active');
    tab_con_solicitudes.classList.add('is-active');

    // Quitar la tabla sin solicitudes
    const tabla_sin_solicitudes = document.querySelector('#sin_solicitudes');
    tabla_sin_solicitudes.classList.add('is-hidden');

    // Poner la tabla con solicitudes
    const tabla_con_solicitudes = document.querySelector('#con_solicitudes');
    tabla_con_solicitudes.classList.remove('is-hidden');
}

function sin_solicitudes() {
    // Cambias las bars que estan activas
    const tab_sin_solicitudes = document.querySelector('#nav_sin_solicitudes');
    const tab_con_solicitudes = document.querySelector('#nav_con_solicitudes');

    tab_sin_solicitudes.classList.add('is-active');
    tab_con_solicitudes.classList.remove('is-active');

    // Activar la tabla sin solicitudes
    const tabla_sin_solicitudes = document.querySelector('#sin_solicitudes');
    tabla_sin_solicitudes.classList.remove('is-hidden');

    // Quitar la tabla con solicitudes
    const tabla_con_solicitudes = document.querySelector('#con_solicitudes');
    tabla_con_solicitudes.classList.add('is-hidden');
}

const pagosNoAsignados_length = document.getElementById('pagosNoAsignados_length');

for (let count = 0; count < pagosNoAsignados_length.innerHTML; count++) {
    // Crear constantes para acceder a HTML
    const bt_Modificar = document.querySelector('#Boton_modificar' + count);
    const motivo = document.querySelector('#motivo' + count);
    const monto = document.querySelector('#monto' + count);
    const ayuda_motivo = document.querySelector('#ayuda_motivo' + count);
    const ayuda_monto_vacio = document.querySelector('#ayuda_monto_vacio' + count);
    const ayuda_monto_negativo = document.querySelector('#ayuda_monto_negativo' + count);
    const ayuda_monto_exponente = document.querySelector('#ayuda_monto_exponente' + count);

    // Checar si hay contenido dentro del input, pata desactivar el boton
    function checar_contenido() {
        bt_Modificar.disabled = motivo.value.length === 0 || monto.value.length === 0 || parseFloat(monto.value) <= 0;
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
        ayuda_monto_negativo.style.marginBottom = '-2em';
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
            bt_Modificar.disabled = true;
            ayuda_monto_exponente.classList.remove('is-hidden');

            if (monto.value < 0) {
                ayuda_monto_negativo.style.marginBottom = '-1em';
            }
        } else {
            ayuda_monto_exponente.classList.add('is-hidden');
        }
    }

    const pago = document.querySelector('#pago' + count)

    const boton_eliminar = document.querySelector('#Boton_eliminar' + count);

    // Detectar si el usuario maneja input y llamar las funciones anteriores
    motivo.addEventListener('input', checar_contenido);
    monto.addEventListener('input', checar_contenido);
    motivo.addEventListener('input', mensaje_motivo);
    monto.addEventListener('input', mensaje_monto);

}

const modify_status = (id, estatus) => {
    //El token de protección CSRF
    const csrf = document.getElementById('_csrf').value;

    fetch('/pagos/pagos_extra/modify_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'csrf-token': csrf
            },
            body: JSON.stringify({
                id: id,
                estatus: estatus
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            document.getElementById('modificacion_estatus').classList.remove('is-hidden');
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
        })
        .catch(error => {
            console.error('Error en la petición fetch:', error);
        });
};

const eliminar = (id) => {
    //El token de protección CSRF
    const csrf = document.getElementById('_csrf').value;

    // Enviar los datos al servidor
    fetch('/pagos/pagos_extra/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'csrf-token': csrf
            },
            body: JSON.stringify({
                id: id
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const table = document.getElementById(id);

            if (table) {
                table.remove();
            } else {
                console.error(`No se encontró la fila ${id}.`);
            }

            document.getElementById('eliminacion').classList.remove('is-hidden');
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
        })
        .catch(error => {
            console.error('Error en la petición fetch:', error);
        });
};

const notificacion_eliminacion = document.querySelector('#btn_eliminar_notificacion');

if (notificacion_eliminacion) {
    notificacion_eliminacion.addEventListener('click', () => {
        document.getElementById('eliminacion').classList.add('is-hidden');
    })
};

const notificacion_estatus = document.querySelector('#btn_eliminar_estatus');

if (notificacion_estatus) {
    notificacion_estatus.addEventListener('click', () => {
        document.getElementById('modificacion_estatus').classList.add('is-hidden');
    })
};

const mensaje = document.querySelector('#btn_eliminar_mensaje');

if (mensaje) {
    mensaje.addEventListener('click', () => {
        document.getElementById('inexistente').classList.add('is-hidden');
    })
};