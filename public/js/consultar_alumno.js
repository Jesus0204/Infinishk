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
    // El token de protección CSRF
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

        return response.json();
    })
    .then((data) => {
        if (data.success) {
            // Supongamos que tienes una fila en la tabla con un id correspondiente al IDGrupo
            const rowId = `grupo-${IDGrupo}`; // Ajusta esto según tu lógica
            const tableRow = document.getElementById(rowId);

            if (tableRow) {
                tableRow.remove();
            } else {
                console.error(`No se encontró la fila con el id ${rowId}.`);
            }

            // Mostrar la notificación de eliminación
            const notification = document.getElementById('eliminacion');
            if (notification) {
                notification.classList.remove('is-hidden');
            }

            // Desplazar la página hacia arriba
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Recargar la página después de mostrar la notificación durante unos segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2000 milisegundos = 2 segundos
        } else {
            console.error('Error en el servidor:', data.message);
        }
    })
    .catch(error => {
        console.error('Error en la petición fetch:', error);
    });
}

function downloadPDF(matricula) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const margin = 10; // Define a margin for the content

    // Obtener las selecciones de checkboxes
    const selectedTabs = [];
    if (document.getElementById('checkbox_deuda').checked) {
        selectedTabs.push('estado_cuenta');
    }
    if (document.getElementById('checkbox_pagos').checked) {
        selectedTabs.push('historial');
    }
    if (document.getElementById('checkbox_solicitudes').checked) {
        selectedTabs.push('solicitudes');
    }
    if (document.getElementById('checkbox_pagosExtra').checked) {
        selectedTabs.push('extras');
    }
    if (document.getElementById('checkbox_materias').checked) {
        selectedTabs.push('horario');
    }

    // Guardar el ID de la pestaña activa
    const activeTab = document.querySelector('.tabs .is-active');
    const activeTabId = activeTab ? activeTab.id.replace('nav_', '') : null;

    // Crear una copia oculta temporal de las pestañas para el PDF
    const hiddenTabs = [];
    selectedTabs.forEach(tabId => {
        if (tabId !== activeTabId) {
            const tabContent = document.getElementById(tabId);
            if (tabContent && tabContent.classList.contains('is-hidden')) {
                tabContent.classList.remove('is-hidden');
                hiddenTabs.push(tabId);
            }
        }
    });

    // Crear el contenido combinado para el PDF
    const combinedContent = document.createElement('div');
    combinedContent.style.padding = `${margin}px`; // Agregar padding para el margen
    combinedContent.style.background = 'white'; // Asegurar que el fondo sea blanco

    // Mapear los IDs de las tabs a los títulos deseados para el PDF
    const tabTitles = {
        'deuda': 'Colegiatura',
        'pagos': 'Historial de Colegiatura',
        'solicitudes': 'Solicitudes',
        'pagosExtra': 'Historial Solicitudes'
    };

    selectedTabs.forEach((tabId, index) => {
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            const title = document.createElement('p');
            title.classList.add('card-header-title', 'is-centered', 'is-size-5', 'has-background-link', 'has-text-white');
            title.textContent = tabTitles[tabId]; // Usar el título correspondiente al ID de la tab
            combinedContent.appendChild(title);
            combinedContent.appendChild(tabContent.cloneNode(true));

            if (index < selectedTabs.length - 1) {
                const br = document.createElement('br');
                combinedContent.appendChild(br); // Agregar un salto de línea entre los contenidos de las tabs
            }
        }
    });

    combinedContent.style.display = 'block';
    combinedContent.style.position = 'absolute';
    combinedContent.style.top = '-9999px';
    document.body.appendChild(combinedContent);

    html2canvas(combinedContent, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2;

        const imgWidth = imgProps.width / 2; // Dado que escalamos el lienzo por 2
        const imgHeight = imgProps.height / 2; // Dado que escalamos el lienzo por 2

        let scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        let scaledWidth = imgWidth * scaleFactor;
        let scaledHeight = imgHeight * scaleFactor;

        pdf.addImage(imgData, 'PNG', margin, margin, scaledWidth, scaledHeight);
        pdf.save(`${matricula}_EstadoCuenta.pdf`);
        document.body.removeChild(combinedContent);

        // Restaurar la visibilidad original de las pestañas ocultas después de generar el PDF
        hiddenTabs.forEach(tabId => {
            const tabContent = document.getElementById(tabId);
            if (tabContent && !tabContent.classList.contains('is-hidden')) {
                tabContent.classList.add('is-hidden');
            }
        });
    }).catch(error => {
        console.error("Error al generar el PDF: ", error);
        document.body.removeChild(combinedContent);

        // En caso de error, restaurar la visibilidad original de las pestañas ocultas
        hiddenTabs.forEach(tabId => {
            const tabContent = document.getElementById(tabId);
            if (tabContent && !tabContent.classList.contains('is-hidden')) {
                tabContent.classList.add('is-hidden');
            }
        });
    });

    // Restaurar la visibilidad original de las pestañas ocultas inmediatamente después de iniciar el proceso
    hiddenTabs.forEach(tabId => {
        const tabContent = document.getElementById(tabId);
        if (tabContent && !tabContent.classList.contains('is-hidden')) {
            tabContent.classList.add('is-hidden');
        }
    });
}



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
