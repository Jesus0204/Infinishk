
function updateLabel() {
    var archivo = document.getElementById('archivo');
    var label = document.getElementById('labelArchivo');
    label.innerHTML = '<i class="fas fa-upload"></i>' + archivo.files[0].name;
}
function validateFile() {
    var archivo = document.getElementById('archivo');
    var error = document.getElementById('error');
    if (archivo.files.length === 0) {
        error.textContent = 'Por favor ingresa un archivo';
        return false;
    }
    var file = archivo.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var content = e.target.result;
        // Aquí deberías agregar la lógica para validar el contenido del CSV
        // Por ejemplo, verificar que las columnas necesarias estén presentes
        if (csvContentIsValid(content)) {
            // Si el contenido es válido, permitir la carga del archivo
            document.forms[0].submit(); // Esto enviará el formulario
        } else {
            error.textContent = 'Por favor ingresa un CSV válido';
        }
    };
    reader.onerror = function () {
        error.textContent = 'Hubo un error al leer el archivo';
    };
    reader.readAsText(file);
    return false; // Esto detiene la carga hasta que la validación sea exitosa
}

function csvContentIsValid(csvContent) {
    // Implementa la lógica para validar el contenido del CSV aquí
    // Esta es solo una estructura básica, necesitarás adaptarla a tus necesidades
    var lines = csvContent.split('\n');
    if (lines.length > 1) {
        var headers = lines[0].split(',').map(header => header.trim()); // Eliminar espacios en blanco alrededor de las cabeceras
        // Verifica que todas las cabeceras necesarias estén presentes
        if (
            headers.includes('Fecha') &&
            headers.includes('Hora') &&
            headers.includes('Concepto') &&
            headers.includes('Importe')
        ) {
            // Añade más validaciones según sea necesario
            return true;
        }
    }
    return false;
}

const tablaNoCompleta = document.getElementById('tablaNoCompleta');
// Inicialmente ocultar la tabla de Pagos No Completos
if (tablaNoCompleta){
    tablaNoCompleta.style.display = 'none';
}

const toggleButton = document.getElementById('toggleButtonCompleto');

if (toggleButton) {
    // Agregar un evento de click al botón
    toggleButton.addEventListener('click', function () {
        // Comprobar si la tabla de Pago Completo está visible
        var isTablaCompletaVisible = document.getElementById('tablaCompleta').style.display !== 'none';
        // Cambiar la visibilidad de las tablas
        document.getElementById('tablaCompleta').style.display = isTablaCompletaVisible ? 'none' : 'block';
        document.getElementById('tablaNoCompleta').style.display = isTablaCompletaVisible ? 'block' : 'none';
    });
}

const toggleButtonActivo = document.getElementById('toggleButtonActivo');

if (toggleButtonActivo){
    toggleButtonActivo.addEventListener('click', function () {
        // Comprobar si la tabla de Pago Completo está visible
        var isTablaCompletaVisible = document.getElementById('tablaCompleta').style.display !== 'none';
        // Cambiar la visibilidad de las tablas
        document.getElementById('tablaCompleta').style.display = isTablaCompletaVisible ? 'none' : 'block';
        document.getElementById('tablaNoCompleta').style.display = isTablaCompletaVisible ? 'block' : 'none';
    });
}

document.querySelectorAll('.form-enviar-datos select[name="tipoPago"]').forEach((select) => {
    select.addEventListener('change', (event) => {
        // Obtener el elemento tr ancestro más cercano del select
        const fila = select.closest('tr');
        // Asegurarse de que se encontró una fila
        if (fila) {
            // Actualizar la clase de la fila basada en el valor seleccionado
            fila.className = event.target.value.replace(/\s/g, '-');
        } else {
            console.error('No se encontró la fila correspondiente al select.');
        }
    });
});

document.querySelectorAll('.form-enviar-datos').forEach((form, index) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Crear FormData
        const formData = new FormData(form);

        fetch('/pagos/resultadoTransferencia', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            let mensajeAlerta = '';
            if (!data.success) {
                mensajeAlerta = data.message || 'Por favor verifica tu tipo de pago';
                alert(mensajeAlerta);
            } else {
                const filaId = form.parentElement.parentElement.id;
                const fila = document.getElementById(filaId);
                if (fila) {
                    fila.remove();
                } else {
                    console.error(`No se encontró la fila ${filaId}.`);
                }
            }
        })
        .catch(error => {
            console.error('Error en la petición fetch:', error);
            alert('Hubo un error al procesar la solicitud. Por favor inténtalo de nuevo más tarde.');
        });
    });
});



document.querySelectorAll('.form-enviar-datos select[name="tipoPago"]').forEach((select) => {
    select.addEventListener('change', (event) => {
        // Obtener el elemento tr ancestro más cercano del select
        const fila = select.closest('tr');
        // Asegurarse de que se encontró una fila
        if (fila) {
            // Actualizar la clase de la fila basada en el valor seleccionado
            fila.className = event.target.value.replace(/\s/g, '-');
            
            // Obtener el botón dentro de la fila
            const boton = fila.querySelector('button[type="submit"]');
            // Asegurarse de que se encontró el botón
            if (boton) {
                // Cambiar el texto del botón según el tipo de pago seleccionado
                if (event.target.value === 'Pago a Registrar') {
                    boton.innerHTML = `<span>POSPONER</span>
                    <span class="icon is-small">
                    <i class="fa-solid fa-circle-chevron-right" style="color: #ffffff;"></i>
                    </span>`;
                } else {
                    boton.innerHTML = `<span>REGISTRAR</span>
                    <span class="icon is-small">
                    <i class="fa-solid fa-circle-chevron-right" style="color: #ffffff;"></i>
                    </span>`;
                }
            } else {
                console.error('No se encontró el botón correspondiente a la fila.');
            }
        } else {
            console.error('No se encontró la fila correspondiente al select.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const closeNotificationButton = document.getElementById('closeNotification');

    if (closeNotificationButton) {
        closeNotificationButton.addEventListener('click', () => {
            document.getElementById('errorNotification').classList.add('is-hidden');
        })
    };

});

function formatFecha(fecha) {
    const partes = fecha.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Al cargar la página, convierte el valor del input si ya existe
document.addEventListener("DOMContentLoaded", function () {
    const inputFecha = document.getElementById("fecha");
    const valorActual = inputFecha.value;

    if (valorActual) {
        inputFecha.value = formatFecha(valorActual);
    }

    // Si el usuario selecciona una fecha con el datepicker (si lo usas), puedes formatearla aquí también
    inputFecha.addEventListener("change", function (e) {
        const fechaSeleccionada = e.target.value;
        if (fechaSeleccionada) {
            e.target.value = formatFecha(fechaSeleccionada);
        }
    });
});


