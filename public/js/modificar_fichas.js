// Obtener la longitud de fichas para el bucle
const fichas_length = document.getElementById('fichas_length');

let count_clear = 0;

// Iterar sobre los elementos de la tabla
for (count = 1; count <= fichas_length.innerHTML; count++) {

    // Crear constantes para acceder a HTML
    const bt_Modificar = document.querySelector('#Boton_modificar' + count);
    const descuento = document.querySelector('#descuento' + count);
    const nota = document.querySelector('#nota' + count);
    const ayuda_descuento_vacio = document.querySelector('#ayuda_descuento_vacio' + count);
    const ayuda_descuento_negativo = document.querySelector('#ayuda_descuento_negativo' + count);
    const ayuda_descuento_exponente = document.querySelector('#ayuda_descuento_exponente' + count);
    const ayuda_nota = document.querySelector('#ayuda_nota' + count);
    const ayuda_descuento_deuda = document.querySelector('#ayuda_descuento_deuda' + count);
    const fecha_lim = document.querySelector('#fecha_lim' + count);

    const montoPagar = document.getElementById('montoPagar' + count);
    const deuda = montoPagar.innerHTML;
    const deuda_no_comma = deuda.replace(',', '')

    function deudaDescuento(){
        if (descuento.value > Number(deuda_no_comma)) {
            ayuda_descuento_deuda.classList.remove('is-hidden');
        } else {
            ayuda_descuento_deuda.classList.add('is-hidden');
        }
    }

    // Checar si hay contenido dentro del input, para desactivar el boton
    function checar_contenido() {
        bt_Modificar.disabled = descuento.value.length === 0 || nota.value.length === 0 ||
            parseFloat(descuento.value) < 0 || descuento.value.trim().toLowerCase().includes('e') ||
                fecha_lim.value.length === 0 || descuento.value > Number(deuda_no_comma);
    }

    const ayuda_fecha = document.querySelector('#ayuda_fecha_vacia' + count);
    
    const placeholderDate_check = document.getElementById('fecha_lim' + count)

    if (placeholderDate_check){
        const startDate = placeholderDate_check.getAttribute('placeholder');

        console.log(startDate);

        const calendars = bulmaCalendar.attach('[id=fecha_lim' + count + ']', {
            startDate: startDate,
            minDate: startDate,
            displayMode: 'dialog',
            dateFormat: 'dd/MM/yyyy',
            weekStart: 1,
            lang: 'es',
            showFooter: false
        });

        function message_clear_button() {
            ayuda_fecha.classList.add('is-hidden');
            checar_contenido();
        }

        calendars.forEach((calendar) => {
            calendar.on('hide', message_clear_button);
        })

        function clear_button() {
            ayuda_fecha.classList.remove('is-hidden');
            bt_Modificar.disabled = true;
        }

        const clear_fecha_lim = document.querySelectorAll('.datetimepicker-clear-button');
        clear_fecha_lim[count_clear].addEventListener('click', clear_button);
        count_clear++;
    }

    function mensaje_descuento() {
        if (descuento.value.length === 0) {
            ayuda_descuento_vacio.classList.remove('is-hidden');
        } else {
            ayuda_descuento_vacio.classList.add('is-hidden');
        }

        if (parseFloat(descuento.value) < 0) {
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

    if (nota){
        // Detectar si el usuario maneja input y llamar las funciones anteriores
        nota.addEventListener('input', checar_contenido);
        nota.addEventListener('input', mensaje_nota);
    }
    
    if (descuento){
        descuento.addEventListener('input', mensaje_descuento);
        descuento.addEventListener('input', checar_contenido);
        descuento.addEventListener('input', deudaDescuento);
    }

}

function modificar(descuento, fecha_lim, nota, id, count) {
    const csrf = document.getElementById('_csrf').value;
    const alumno = document.getElementById('alumno').value;
    
    // Obtener dato de la ficha específica
    const descuentoNum = document.getElementById('descuento' + count).value;
    const fechaNum = document.getElementById('fecha_lim' + count).value; 
    const notaNum = document.getElementById('nota' + count).value;

    // formato de fecha de DD/MM/YYYY -> YYYY-MM-DD para SQL
    const parts = fechaNum.split('/');
    const fechaFormat = `${parts[2]}-${parts[1]}-${parts[0]}`;

    // Desactivar el botón después de hacer clic en él para evitar múltiples envíos
    document.getElementById('Boton_modificar' + count).setAttribute('disabled', 'disabled');

    // Mostrar la notificación de modificación
    const notificacion = document.getElementById('modificacion_ficha');
    notificacion.classList.remove('is-hidden');

    // Desplazar la página hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch('/alumnos/fichas/modify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            descuentoNum : descuentoNum,
            fechaFormat : fechaFormat,
            notaNum : notaNum,
            id : id
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log('Modificación exitosa: ', data);
            // Recargar la página después de mostrar la notificación durante unos segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000); // 2000 milisegundos = 2 segundos
        } else {
            console.error('Error en la modificación: ', data.message);
            // Reactivar el botón en caso de error para permitir nuevos intentos
            document.getElementById('Boton_modificar' + count).removeAttribute('disabled');
        }
    })
    .catch(error => {
        console.log('Error en la petición fetch: ', error);
        // Reactivar el botón en caso de error para permitir nuevos intentos
        document.getElementById('Boton_modificar' + count).removeAttribute('disabled');
    });
}
