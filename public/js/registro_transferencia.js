
function updateLabel() {
    var archivo = document.getElementById('archivo');
    var label = document.getElementById('labelArchivo');
    label.innerHTML = '<i class="fas fa-upload"></i>' + archivo.files[0].name;
}

function validateFile() {
    const archivo = document.getElementById('archivo');
    const error = document.getElementById('error');

    if (archivo.files.length === 0) {
        error.textContent = 'Por favor ingresa un archivo.';
        return false;
    }

    const file = archivo.files[0];
    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'csv') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            if (csvContentIsValid(content)) {
                document.forms[0].submit();
            } else {
                error.textContent = 'El archivo CSV no tiene el formato esperado.';
            }
        };
        reader.onerror = function () {
            error.textContent = 'Hubo un error al leer el archivo CSV.';
        };
        reader.readAsText(file);
    } else if (extension === 'xlsx') {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 6 });

            if (xlsxContentIsValid(json)) {
                document.forms[0].submit();
            } else {
                error.textContent = 'El archivo XLSX no tiene el formato esperado.';
            }
        };
        reader.onerror = function () {
            error.textContent = 'Hubo un error al leer el archivo XLSX.';
        };
        reader.readAsArrayBuffer(file);
    } else {
        error.textContent = 'Formato de archivo no válido. Solo se aceptan .csv o .xlsx';
    }

    return false;
}

function csvContentIsValid(csvContent) {
    const lines = csvContent.split('\n');
    if (lines.length < 2) return false;

    const headers = lines[0].split(',').map(h => h.trim());
    return requiredHeadersPresent(headers);
}

function xlsxContentIsValid(json) {
    if (json.length === 0) return false;
    const headers = json[0].map(h => h.toString().trim());
    return requiredHeadersPresent(headers);
}

function requiredHeadersPresent(headers) {
    const required = ['Fecha', 'Hora', 'Monto', 'Referencia', 'Metodo', 'Nota'];
    return required.every(h => headers.includes(h));
}

const tablaNoCompleta = document.getElementById('tablaNoCompleta');
// Inicialmente ocultar la tabla de Pagos No Completos
if (tablaNoCompleta) {
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

if (toggleButtonActivo) {
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

        const index = form.getAttribute('data-index');
        if (!index) {
            console.error('No se encontró el atributo data-index en el formulario.');
            return;
        }

        // Usar el index para acceder al campo de fecha con el ID generado en el servidor
        const fechaInput = document.getElementById(`fecha${index}`);
        if (!fechaInput) {
            console.error(`No se encontró el campo de fecha con id: fecha${index}`);
        } else {
            const fechaValue = fechaInput.value;
            formData.append('fecha', formatFecha(fechaValue));
        }

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
    const [day, month, year] = fecha.split('/');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate
}

// Al cargar la página, convierte el valor del input si ya existe
document.addEventListener("DOMContentLoaded", function () {
    // Selecciona todos los inputs de tipo date
    const inputsFecha = document.querySelectorAll('input[type="date"]');

    inputsFecha.forEach((inputFecha) => {
        let fechaUsar;

        // Verifica si el input tiene valor
        if (inputFecha) {
            fechaUsar = inputFecha.value;
        } else {
            fechaUsar = new Date(); // Usa la fecha actual si no hay valor
        }

        const index = inputFecha.getAttribute('data-index');
        console.log(index)

        // Inicializa Bulma Calendar
        const calendars = bulmaCalendar.attach(`#fecha${index}`, { // Usa el ID único
            startDate: fechaUsar,
            displayMode: 'dialog',
            dateFormat: 'dd/MM/yyyy',
            maxDate: new Date(),
            weekStart: 1,
            lang: 'es',
            showFooter: false
        });

        const submitButton = document.querySelector(`.my-button[data-index="${index}"]`);

        // Actualiza el valor del input al seleccionar una fecha
        calendars.forEach(calendar => {
            calendar.on('change', function (date) {
                inputFecha.value = date; // Actualiza el valor del input
            });

            calendar.on('clear', function () {
                // Si existe el botón (o sea no sale que la referencia no existe en la base)
                if (submitButton) {
                    checarContenido(submitButton, inputFecha)
                }
            });

            calendar.on('hide', function () {
                checarContenido(submitButton, inputFecha)
            })
        });

    });
});

function checarContenido(button, inputFecha) {
    button.disabled = inputFecha.value.length === 0;
}

