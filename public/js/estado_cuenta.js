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
        span.textContent = 'Otros pagos';
    } else if (activeContent == 'pagos') {
        span.textContent = 'Historial Pagos';
    }

    return span;
}

function downloadPDF(matricula) {
    const {
        jsPDF
    } = window.jspdf;
    const pdf = new jsPDF();
    const margin = 10; // Define a margin for the content

    setTimeout(() => {
        const activeTab = document.querySelector('.tabs .is-active');
        const activeContentId = activeTab.id.replace('nav_', '');
        const activeContent = document.getElementById(activeContentId);
        const boxContent = document.getElementById('boxContent');

        if (!boxContent || !activeContent) {
            console.error("Unable to find elements to clone.");
            return;
        }

        const edoCuenta = document.createElement('p');
        edoCuenta.classList.add('card-header-title', 'is-centered', 'has-background-danger', 'has-text-white', 'is-size-3');
        edoCuenta.textContent = 'Estado de Cuenta';

        const title = document.createElement('p');
        title.classList.add('card-header-title', 'is-centered', 'is-size-5', 'has-background-link', 'has-text-white');
        setText(activeContentId, title);

        // Create a temporary container for the combined content
        const combinedContent = document.createElement('div');
        combinedContent.style.padding = `${margin}px`; // Add padding for margin
        combinedContent.style.background = 'white'; // Ensure background is white
        combinedContent.appendChild(edoCuenta);
        combinedContent.appendChild(boxContent.cloneNode(true));
        combinedContent.appendChild(title);
        combinedContent.appendChild(activeContent.cloneNode(true));
        combinedContent.style.display = 'block';
        combinedContent.style.position = 'absolute';
        combinedContent.style.top = '-9999px';
        document.body.appendChild(combinedContent);

        html2canvas(combinedContent, {
            scale: 2
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth() - margin * 2;
            const pdfHeight = pdf.internal.pageSize.getHeight() - margin * 2;

            const imgWidth = imgProps.width / 2; // Since we scaled canvas by 2
            const imgHeight = imgProps.height / 2; // Since we scaled canvas by 2

            let scaleFactor = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            let scaledWidth = imgWidth * scaleFactor;
            let scaledHeight = imgHeight * scaleFactor;

            pdf.addImage(imgData, 'PNG', margin, margin, scaledWidth, scaledHeight);
            pdf.save(`${matricula}_EstadoCuenta.pdf`);
            document.body.removeChild(combinedContent);
        }).catch(error => {
            console.error("Error generating PDF: ", error);
            document.body.removeChild(combinedContent);
        });
    }, 1000); // Delay to ensure elements are fully loaded
}
