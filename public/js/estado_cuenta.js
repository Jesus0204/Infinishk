function desactivarBotonPDF() {
    const checkboxes = document.querySelectorAll('.download-checkbox');
    const downloadButton = document.getElementById('downloadButton');
    const downloadLink = document.getElementById('downloadLink');
    
    // Verificar si al menos un checkbox está seleccionado
    const atLeastOneChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

    if (atLeastOneChecked) {
        downloadButton.classList.add('is-hidden');
        downloadButton.disabled = true;
        downloadLink.classList.remove('is-hidden');
    } else {
        downloadButton.classList.remove('is-hidden');
        downloadButton.disabled = true;
        downloadLink.classList.add('is-hidden');
    }
}

// Añadir event listeners a todos los checkboxes
document.querySelectorAll('.download-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', desactivarBotonPDF);
});

// Llamar a la función al cargar la página por si hay cambios iniciales
desactivarBotonPDF();

function deuda() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda){
        tab_deuda.classList.add('is-active');
    }

    tab_pagos.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_pagosExtra.classList.remove('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de extras
    const tabla_extras = document.querySelector('#solicitudes');
    tabla_extras.classList.add('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.add('is-hidden');

    // Poner la tabla de deuda
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda){
        tabla_deuda.classList.remove('is-hidden');
    }
}

function pagos() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda){
        tab_deuda.classList.remove('is-active');
    }

    tab_solicitudes.classList.remove('is-active');
    tab_pagos.classList.add('is-active');
    tab_pagosExtra.classList.remove('is-active');

    // Quitar la tabla con deudas
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda){
        tabla_deuda.classList.add('is-hidden');
    }

    // Quitar la tabla de extras
    const tabla_extras = document.querySelector('#solicitudes');
    tabla_extras.classList.add('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.add('is-hidden');

    // Poner la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.remove('is-hidden');
}

function extras() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda){
        tab_deuda.classList.remove('is-active');
    }

    tab_pagos.classList.remove('is-active');
    tab_solicitudes.classList.add('is-active');
    tab_pagosExtra.classList.remove('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de deudas
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda){
        tabla_deuda.classList.add('is-hidden');
    }

    // Poner la tabla de extras
    const tabla_extras = document.querySelector('#solicitudes');
    tabla_extras.classList.remove('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.add('is-hidden');
}

function pagosExtra() {
    // Cambias las bars que estan activas
    const tab_deuda = document.querySelector('#nav_deuda');
    const tab_pagos = document.querySelector('#nav_pagos');
    const tab_solicitudes = document.querySelector('#nav_solicitudes');
    const tab_pagosExtra = document.querySelector('#nav_pagosExtra');

    if (tab_deuda) {
        tab_deuda.classList.remove('is-active');
    }

    tab_pagos.classList.remove('is-active');
    tab_solicitudes.classList.remove('is-active');
    tab_pagosExtra.classList.add('is-active');

    // Quitar la tabla de pagos
    const tabla_pagos = document.querySelector('#pagos');
    tabla_pagos.classList.add('is-hidden');

    // Quitar la tabla de deudas
    const tabla_deuda = document.querySelector('#deuda');

    if (tabla_deuda) {
        tabla_deuda.classList.add('is-hidden');
    }

    // Poner la tabla de extras
    const tabla_extras = document.querySelector('#solicitudes');
    tabla_extras.classList.add('is-hidden');

    const pagosExtra = document.querySelector('#pagosExtra');
    pagosExtra.classList.remove('is-hidden');
}

function setText(activeContent, span) {
    if (activeContent == 'deuda') {
        span.textContent = 'Colegiatura';
    } else if (activeContent == 'solicitudes') {
        span.textContent = 'Solicitudes Pendientes';
    } else if (activeContent == 'pagosExtra') {
        span.textContent = 'Otros Pagos';
    } else if (activeContent == 'pagos') {
        span.textContent = 'Historial Pagos';
    }

    return span;
}

function downloadPDF(matricula) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const margin = 10; // Define a margin for the content

    // Obtener las selecciones de checkboxes
    const selectedTabs = [];

    if(matricula[0] == '1'){
        if (document.getElementById('checkbox_deuda').checked) {
            selectedTabs.push('deuda');
        }
    }
    if(matricula[0] == '1'){
        if (document.getElementById('checkbox_pagos').checked) {
            selectedTabs.push('pagos');
        }
    } else if(matricula[0] == '8'){
        if (document.getElementById('checkbox_pagos').checked) {
            selectedTabs.push('pagosdipl');
        }
    }
    if (document.getElementById('checkbox_solicitudes').checked) {
        selectedTabs.push('solicitudes');
    }
    if (document.getElementById('checkbox_pagosExtra').checked) {
        selectedTabs.push('pagosExtra');
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
    combinedContent.style.color = 'black'; // Asegurar que el texto sea negro para contraste

    // Mapear los IDs de las tabs a los títulos deseados para el PDF
    const tabTitles = {
        'deuda': 'Colegiatura',
        'pagos': 'Historial de Colegiatura',
        'pagosdipl': 'Historial de Diplomado',
        'solicitudes': 'Solicitudes',
        'pagosExtra': 'Historial Solicitudes'
    };

    // Array para almacenar los estilos originales que se modificaron
    const originalStyles = [];

    selectedTabs.forEach((tabId, index) => {
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            // Almacenar estilos originales que se van a modificar
            const modifiedStyles = [];

            // Modificar estilos necesarios para la generación del PDF
            const tags = tabContent.querySelectorAll('.tag');
            tags.forEach(tag => {
                const originalStyle = {
                    element: tag,
                    backgroundColor: tag.style.backgroundColor,
                    color: tag.style.color
                };
                originalStyles.push(originalStyle);

                tag.style.backgroundColor = 'transparent'; // Quitar el fondo
                tag.style.color = 'black'; // Asegurar el color del texto para contraste
                modifiedStyles.push(originalStyle);
            });

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

        // Restaurar los estilos originales modificados después de generar el PDF
        originalStyles.forEach(style => {
            style.element.style.backgroundColor = style.backgroundColor;
            style.element.style.color = style.color;
        });

        // Restaurar la visibilidad original de las pestañas ocultas después de generar el PDF
        hiddenTabs.forEach(tabId => {
            const tabContent = document.getElementById(tabId);
            if (tabContent && !tabContent.classList.contains('is-hidden')) {
                tabContent.classList.add('is-hidden');
            }
        });

        // Restaurar la visibilidad de la sección de "Modificar Fichas" y elementos ocultos
        restorePageState();
    }).catch(error => {
        console.error("Error al generar el PDF: ", error);
        document.body.removeChild(combinedContent);

        // En caso de error, restaurar los estilos originales modificados
        originalStyles.forEach(style => {
            style.element.style.backgroundColor = style.backgroundColor;
            style.element.style.color = style.color;
        });

        // Restaurar la visibilidad original de las pestañas ocultas
        hiddenTabs.forEach(tabId => {
            const tabContent = document.getElementById(tabId);
            if (tabContent && !tabContent.classList.contains('is-hidden')) {
                tabContent.classList.add('is-hidden');
            }
        });

        // Restaurar la visibilidad de la sección de "Modificar Fichas" y elementos ocultos
        restorePageState();
    });

    // Función para restaurar el estado original de la página
    function restorePageState() {

        // Ocultar los elementos modificados durante la generación del PDF
        hiddenTabs.forEach(tabId => {
            const tabContent = document.getElementById(tabId);
            if (tabContent && !tabContent.classList.contains('is-hidden')) {
                tabContent.classList.add('is-hidden');
            }
        });
    }

    // Restaurar la visibilidad original de las pestañas ocultas inmediatamente después de iniciar el proceso
    hiddenTabs.forEach(tabId => {
        const tabContent = document.getElementById(tabId);
        if (tabContent && !tabContent.classList.contains('is-hidden')) {
            tabContent.classList.add('is-hidden');
        }
    });

    originalStyles.forEach(style => {
        style.element.style.backgroundColor = style.backgroundColor;
        style.element.style.color = style.color;
    });
}
