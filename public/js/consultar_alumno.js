const bt_Modificar = document.querySelector('#Boton_modificar');
const ref = document.querySelector('#ref');
const beca = document.querySelector('#beca');

const ayuda_ref_vacia = document.querySelector('#ayuda_ref_vacia');
const ayuda_ref_negativa = document.querySelector('#ayuda_ref_negativa');
const ayuda_ref_exponente = document.querySelector('#ayuda_ref_exponente');

const ayuda_beca_negativa = document.querySelector('#ayuda_beca_negativa');
const ayuda_beca_exponente = document.querySelector('#ayuda_beca_exponente');
const ayuda_beca_rango = document.querySelector('#ayuda_beca_rango');

// Checar si hay contenido dentro del input, para desactivar el boton
function checar_contenido() {
    if (ref.value.length === 0) {
        bt_Modificar.disabled = true;
    } else {
        bt_Modificar.disabled = false;
    }
}

function mensaje_ref() {
    if (ref.value.length === 0) {
        ayuda_ref_vacia.classList.remove('is-hidden');
    } else {
        ayuda_ref_vacia.classList.add('is-hidden');
    }

    if (ref.value < 0 || ref.value === '-0') {
        bt_Modificar.disabled = true;
        ayuda_ref_negativa.classList.remove('is-hidden');
    } else {
        ayuda_ref_negativa.classList.add('is-hidden');
    }

    if (ref.value.trim().toLowerCase().includes('e')) {
        bt_Modificar.disabled = true;
        ayuda_ref_exponente.classList.remove('is-hidden');
    } else {
        ayuda_ref_exponente.classList.add('is-hidden');
    }
}

function mensaje_beca() {
    if (beca.value < 0 || beca.value === '-0') {
        bt_Modificar.disabled = true;
        ayuda_beca_negativa.classList.remove('is-hidden');
    } else {
        ayuda_beca_negativa.classList.add('is-hidden');
    }

    if (beca.value.trim().toLowerCase().includes('e')) {
        bt_Modificar.disabled = true;
        ayuda_beca_exponente.classList.remove('is-hidden');
    } else {
        ayuda_beca_exponente.classList.add('is-hidden');
    }

    if (beca.value > 100) {
        bt_Modificar.disabled = true;
        ayuda_beca_rango.classList.remove('is-hidden');
    } else {
        ayuda_beca_rango.classList.add('is-hidden');
    }
}

ref.addEventListener('input', checar_contenido);
ref.addEventListener('input', mensaje_ref);

if (beca) {
    beca.addEventListener('input', checar_contenido);
    beca.addEventListener('input', mensaje_beca);
}

function modificar() {
    // Desactivar el botón para evitar envíos duplicados
    document.getElementById('Boton_modificar').setAttribute('disabled', 'disabled');

    const csrf = document.getElementById('_csrf').value;
    const alumno = document.getElementById('alumno').value;
    const ref = document.getElementById('ref').value;
    const beca = document.getElementById('beca');

    let beca_alumno;
    if (beca) {
        beca_alumno = beca.value;
    }

    console.log('Data to be sent:', { ref, beca, alumno });

    // Mostrar la notificación de modificación
    const notificacion = document.getElementById('modificacion_datos');
    notificacion.classList.remove('is-hidden');

    fetch('/alumnos/datos_alumno/modify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            ref: ref,
            beca: beca_alumno,
            alumno: alumno,
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Response from server:', data);
            if (data.success) {

                // Desplazar la página hacia arriba
                window.scrollTo({ top: 0, behavior: 'smooth' });

                console.log('Modificación exitosa: ', data);
                // Recargar la página después de mostrar la notificación durante unos segundos
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // 3000 milisegundos = 3 segundos
            } else {
                console.error('Error en la modificación: ', data.message);
                // Reactivar el botón en caso de error para permitir nuevos intentos
                document.getElementById('Boton_modificar').removeAttribute('disabled');
            }
        })
        .catch(error => {
            console.log('Error en la petición fetch: ', error);
            // Reactivar el botón en caso de error para permitir nuevos intentos
            document.getElementById('Boton_modificar').removeAttribute('disabled');
        });
}


/* Funciones para alternar entre pestañas */
function muestra_estado_de_cuenta() {
    const tab_estado = document.querySelector('#nav_estado');
    const tab_pagos_Otros = document.querySelector('#nav_pagos_Otros');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_horario = document.querySelector('#nav_horario');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');

    tab_pagos_Otros.classList.remove('is-active');
    tab_historial_pagos.classList.remove('is-active');
    tab_horario.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_estado.classList.add('is-active');

    const extras = document.querySelector('#extras');
    extras.classList.add('is-hidden');

    const solicitudes = document.querySelector('#solicitudes');
    solicitudes.classList.add('is-hidden');

    const historial = document.querySelector('#historial');
    historial.classList.add('is-hidden');

    const horario = document.querySelector('#horario');
    horario.classList.add('is-hidden');

    const estado_cuenta = document.querySelector('#estado_cuenta');
    estado_cuenta.classList.remove('is-hidden');
}

function muestra_otros_cargos() {
    const tab_pagos_Diplomado = document.querySelector('#nav_pagos_Diplomado');
    const tab_estado = document.querySelector('#nav_estado');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_pagos_Otros = document.querySelector('#nav_pagos_Otros');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_horario = document.querySelector('#nav_horario');

    tab_solicitudes.classList.remove('is-active');
     
    if (tab_historial_pagos) {
         tab_historial_pagos.classList.remove('is-active');
     }

    if (tab_horario) {
        tab_horario.classList.remove('is-active');
    }

    if (tab_estado) {
        tab_estado.classList.remove('is-active');
    }

    if (tab_pagos_Diplomado) {
        tab_pagos_Diplomado.classList.remove('is-active');
    }

    tab_pagos_Otros.classList.add('is-active');

    const historial = document.querySelector('#historial');
    if (historial) {
        historial.classList.add('is-hidden');
    }

    const horario = document.querySelector('#horario');
    if (horario) {
        horario.classList.add('is-hidden');
    }

    const estado_cuenta = document.querySelector('#estado_cuenta');
    if (estado_cuenta) {
        estado_cuenta.classList.add('is-hidden');
    }

    const pagosdipl = document.querySelector('#pagosdipl');
    if (pagosdipl) {
        pagosdipl.classList.add('is-hidden');
    }

    const solicitudes = document.querySelector('#solicitudes');
    solicitudes.classList.add('is-hidden');

    const extras = document.querySelector('#extras');
    extras.classList.remove('is-hidden');
}

function muestra_historial_de_pagos() {
    const tab_estado = document.querySelector('#nav_estado');
    const tab_pagos_Otros = document.querySelector('#nav_pagos_Otros');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_horario = document.querySelector('#nav_horario');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');

    tab_horario.classList.remove('is-active');
    tab_estado.classList.remove('is-active');
    tab_pagos_Otros.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_historial_pagos.classList.add('is-active');

    const horario = document.querySelector('#horario');
    horario.classList.add('is-hidden');

    const estado_cuenta = document.querySelector('#estado_cuenta');
    estado_cuenta.classList.add('is-hidden');

    const extras = document.querySelector('#extras');
    extras.classList.add('is-hidden');

    const solicitudes = document.querySelector('#solicitudes');
    solicitudes.classList.add('is-hidden');

    const historial = document.querySelector('#historial');
    historial.classList.remove('is-hidden');
}

function muestra_horario() {
    const tab_estado = document.querySelector('#nav_estado');
    const nav_pagos_Otros = document.querySelector('#nav_pagos_Otros');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_horario = document.querySelector('#nav_horario');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');

    tab_estado.classList.remove('is-active');
    nav_pagos_Otros.classList.remove('is-active');
    tab_historial_pagos.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_horario.classList.add('is-active');

    const estado_cuenta = document.querySelector('#estado_cuenta');
    estado_cuenta.classList.add('is-hidden');

    const extras = document.querySelector('#extras');
    extras.classList.add('is-hidden');

    const solicitudes = document.querySelector('#solicitudes');
    solicitudes.classList.add('is-hidden');

    const historial = document.querySelector('#historial');
    historial.classList.add('is-hidden');

    const horario = document.querySelector('#horario');
    horario.classList.remove('is-hidden');
}

function muestra_solicitudes() {
    const tab_estado = document.querySelector('#nav_estado');
    const tab_horario = document.querySelector('#nav_horario');
    const tab_pagos_Diplomado = document.querySelector('#nav_pagos_Diplomado');
    const tab_historial_pagos = document.querySelector('#nav_historial_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagos_Otros = document.querySelector('#nav_pagos_Otros');
    
    tab_pagos_Otros.classList.remove('is-active');

    if (tab_historial_pagos) {
        tab_historial_pagos.classList.remove('is-active');
    }

    if (tab_horario) {
        tab_horario.classList.remove('is-active');
    }

    if (tab_estado) {
        tab_estado.classList.remove('is-active');
    }

    if (tab_pagos_Diplomado) {
        tab_pagos_Diplomado.classList.remove('is-active');
    }

    tab_solicitudes.classList.add('is-active');

    const historial = document.querySelector('#historial');
    if (historial) {
        historial.classList.add('is-hidden');
    }

    const horario = document.querySelector('#horario');
    if (horario) {
        horario.classList.add('is-hidden');
    }

    const estado_cuenta = document.querySelector('#estado_cuenta');
    if (estado_cuenta) {
        estado_cuenta.classList.add('is-hidden');
    }

    const pagosdipl = document.querySelector('#pagosdipl');
    if (pagosdipl) {
        pagosdipl.classList.add('is-hidden');
    }

    const extras = document.querySelector('#extras');
    extras.classList.add('is-hidden');

    const solicitudes = document.querySelector('#solicitudes');
    solicitudes.classList.remove('is-hidden');
}

function muestra_pagos_diplomado() {
    const tab_pagos_Otros = document.querySelector('#nav_pagos_Otros');
    const tab_pagos_Diplomado = document.querySelector('#nav_pagos_Diplomado');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');

    tab_pagos_Otros.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_pagos_Diplomado.classList.add('is-active');

    const extras = document.querySelector('#extras');
    extras.classList.add('is-hidden');

    const solicitudes = document.querySelector('#solicitudes');
    solicitudes.classList.add('is-hidden');

    const pagosdipl = document.querySelector('#pagosdipl');
    pagosdipl.classList.remove('is-hidden');
}

function darDeBajaGrupo(IDGrupo, matricula) {
    //El token de protección CSRF
    const csrf = document.getElementById('_csrf').value;

    // Enviar los datos al servidor
    fetch('/alumnos/datos_alumno/dar_baja_grupo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            IDGrupo: IDGrupo,
            matricula: matricula
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

            // Mostrar la notificación de eliminación
            document.getElementById('eliminacion').classList.remove('is-hidden');
            
            // Desplazar la página hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Recargar la página después de mostrar la notificación durante unos segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2000 milisegundos = 2 segundos
        })
        .catch(error => {
            console.error('Error en la petición fetch:', error);
        });
};

document.addEventListener('DOMContentLoaded', () => {
    const topinfo = document.getElementById('topinfo');

    const updateTopInfoClasses = () => {
        if (window.innerWidth >= 1128) {
            topinfo.classList.add("is-flex");
            topinfo.classList.add("is-align-items-stretch");
        } else {
            topinfo.classList.remove("is-flex");
            topinfo.classList.remove("is-align-items-stretch");
        }
    };

    updateTopInfoClasses();
    window.addEventListener('resize', updateTopInfoClasses);
});
