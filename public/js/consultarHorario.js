const select_plan = document.querySelector('#IDPlanPago');
const precioFinal = parseFloat(document.querySelector('#precioFinal').innerHTML);
const table1 = document.querySelector('#table_1');
const table2 = document.querySelector('#table_2');
const table1_body = document.querySelector('#table_1_body');
const table2_body = document.querySelector('#table_2_body');
const column_table1 = document.querySelector('#column_table1');
const column_table2 = document.querySelector('#column_table2');

function plans_desktop() {
    let plans = [];
    for (let plan of select_plan) {
        let numPagos = plan.getAttribute('data-num');
        let table_1 = '';
        let table_2 = '';

        if (numPagos == 1) {
            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${precioFinal.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else if (numPagos == 2) {
            let pago1 = precioFinal * 0.6;
            let precioRestante = precioFinal * 0.4;
            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${pago1.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>
                       <tr><td class="has-text-weight-semibold">Pago #2</td><td>$${precioRestante.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
            table_2 = '';
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else if (numPagos == 3) {
            let pago1 = precioFinal * 0.4;
            let precioRestante = (precioFinal * 0.6) / 2;
            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${pago1.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>
                       <tr><td class="has-text-weight-semibold">Pago #2</td><td>$${precioRestante.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>
                       <tr><td class="has-text-weight-semibold">Pago #3</td><td>$${precioRestante.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else {
            let half_up = Math.ceil(numPagos / 2);
            let pago1 = precioFinal * 0.23;
            let precioRestante = precioFinal * 0.77;
            let pagoMensual = precioRestante / (numPagos - 1);

            let totalCalculated = pago1 + pagoMensual.toFixed(2) * (numPagos - 1);
            let adjustment = precioFinal - totalCalculated;

            // La primera tabla se llena
            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${pago1.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
            for (let table1_pago = 1; table1_pago < half_up; table1_pago++) {
                if (table1_pago + 1 == numPagos) {
                    // Último pago ajustado
                    let pagoFinal = pagoMensual + adjustment;
                    table_1 += `<tr><td class="has-text-weight-semibold">Pago #${table1_pago + 1}</td><td>$${pagoFinal.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
                } else {
                    table_1 += `<tr><td class="has-text-weight-semibold">Pago #${table1_pago + 1}</td><td>$${pagoMensual.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
                }
            }

            // Ahora la segunda tabla
            for (let table2_pago = half_up; table2_pago < numPagos; table2_pago++) {
                if (table2_pago + 1 == numPagos) {
                    // Último pago ajustado
                    let pagoFinal = pagoMensual + adjustment;
                    table_2 += `<tr><td class="has-text-weight-semibold">Pago #${table2_pago + 1}</td><td>$${pagoFinal.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
                } else {
                    table_2 += `<tr><td class="has-text-weight-semibold">Pago #${table2_pago + 1}</td><td>$${pagoMensual.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
                }
            }

            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        }
    }

    return plans;
}

function plans_mobile(){
    let plans = [];

    for (let plan of select_plan) {
        let numPagos = plan.getAttribute('data-num');
        let table_1 = '';
        let table_2 = '';

        if (numPagos == 1){
            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${precioFinal.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;

            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else if (numPagos == 2) {
            let pago1 = precioFinal * 0.6;
            let precioRestante = precioFinal * 0.4;
            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${pago1.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>
                       <tr><td class="has-text-weight-semibold">Pago #2</td><td>$${precioRestante.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
            table_2 = '';
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else if (numPagos == 3) {
            let pago1 = precioFinal * 0.4;
            let precioRestante = (precioFinal * 0.6) / 2;
            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${pago1.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>
                       <tr><td class="has-text-weight-semibold">Pago #2</td><td>$${precioRestante.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>
                       <tr><td class="has-text-weight-semibold">Pago #3</td><td>$${precioRestante.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else {
            let pago1 = precioFinal * 0.23;
            let precioRestante = precioFinal * 0.77;
            let pagoMensual = precioRestante / (numPagos - 1);

            let totalCalculated = pago1 + pagoMensual.toFixed(2) * (numPagos - 1);
            let adjustment = precioFinal - totalCalculated;

            table_1 = `<tr><td class="has-text-weight-semibold">Pago #1</td><td>$${pago1.toLocaleString('mx', {minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;

            for (let pago = 1; pago < numPagos; pago++) {
                if (pago + 1 == numPagos) {
                    // Último pago ajustado
                    let pagoFinal = pagoMensual + adjustment;
                    table_1 += `<tr><td class="has-text-weight-semibold">Pago #${pago + 1}</td><td>$${pagoFinal.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
                } else {
                    table_1 += `<tr><td class="has-text-weight-semibold">Pago #${pago + 1}</td><td>$${pagoMensual.toLocaleString('mx', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td><td>20 de Septiembre</td></tr>`;
                }
            }
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        }
    }

    return plans;
}

function setTable() {
    let numPagos = $('#IDPlanPago').find(':selected').data('num');

    if (window.innerWidth >= 940) {
        let plans = plans_desktop();

        // Iteras sobre los planes para relevar las tablas
        for (let plan of plans) {
            if (numPagos == 1 && plan.numPagos == 1 || numPagos == 2 && plan.numPagos == 2 || numPagos == 3 && plan.numPagos == 3) {
                table1_body.innerHTML = plan.table_1;
                table1.classList.remove('is-hidden');
                table2.classList.add('is-hidden');
                column_table1.classList.add('is-9');
            } else if (numPagos == plan.numPagos) {
                table1_body.innerHTML = plan.table_1;
                table2_body.innerHTML = plan.table_2;
                table1.classList.remove('is-hidden');
                table2.classList.remove('is-hidden');
                column_table1.classList.remove('is-9');
            }
        }
    } else {
        let plans = plans_mobile();

        // Iteras sobre los planes para relevar las tablas
        for (let plan of plans) {
            if (numPagos == plan.numPagos) {
                table1_body.innerHTML = plan.table_1;
                table1.classList.remove('is-hidden');
                table2.classList.add('is-hidden');
                column_table1.classList.add('is-9');
            }
        }
    }
}

$(document).ready(function () {
    $('#IDPlanPago').change(function () {
        setTable();
    });

    window.addEventListener('resize', () => {
        setTable();
    });

    // Llamas la función para mostrar tabla al inicio
    setTable();
})

function eliminar(materiaRow) {
    // Agarrar todos los datos de la materia de la tabla
    const idMateria = document.querySelector('#id' + materiaRow).value;
    const materia = document.querySelector('#materia' + materiaRow).value;
    const creditos = document.querySelector('#creditos' + materiaRow).value;
    const profesor = document.querySelector('#profesor' + materiaRow).value;
    const salon = document.querySelector('#salon' + materiaRow).value;
    const fechaInicio = document.querySelector('#fechaInicio' + materiaRow).value;
    const fechaFin = document.querySelector('#fechaFin' + materiaRow).value;
    const horario = document.querySelector('#horario' + materiaRow).value;
    const precio = document.querySelector('#precio' + materiaRow).value;

    // Sacar la tabla donde se va a agregar datos y el container
    const table_eliminados = document.querySelector('#table_eliminados');
    const container = document.querySelector('#materiasEliminadasContainer');

    // Create a new table row with data
    const newRow = document.createElement('tr');

    // Create and append cells to the new row
    const materiaData = document.createElement('td');
    const strongMateria = document.createElement('strong');
    strongMateria.textContent = materia;
    materiaData.appendChild(strongMateria);
    newRow.appendChild(materiaData);

    const profesorData = document.createElement('td');
    profesorData.textContent = profesor;
    newRow.appendChild(profesorData);

    const creditoData = document.createElement('td');
    const creditSpan = document.createElement('span');
    creditSpan.classList.add('tag', 'is-size-6');
    creditSpan.style.backgroundColor = '#ddf5e5';
    const creditText = document.createElement('span');
    creditText.style.color = '#21c85b';
    creditText.textContent = creditos;
    creditSpan.appendChild(creditText);
    creditoData.appendChild(creditSpan);
    newRow.appendChild(creditoData);

    
    const costoData = document.createElement('td');
    costoData.textContent = '$'+ precio;
    newRow.appendChild(costoData);
    
    const agregarData = document.createElement('td');
    agregarData.style.textAlign = 'center';
    const agregarButton = document.createElement('button');
    agregarButton.type = 'button';
    agregarButton.classList.add('tag', 'is-size-6');
    agregarButton.style.backgroundColor = '#eef2fb'; // lighter color
    agregarButton.style.color = '#5a6581';
    const agregarIcon = document.createElement('span');
    agregarIcon.classList.add('icon', 'is-small');
    agregarButton.appendChild(agregarIcon);
    const agregarIconLogo = document.createElement('i');
    agregarIconLogo.classList.add('fa-solid', 'fa-plus');
    agregarIcon.appendChild(agregarIconLogo);
    agregarData.appendChild(agregarButton);
    newRow.appendChild(agregarData);

    // Append the new row to the table body
    table_eliminados.appendChild(newRow);

    // Quitar la tabla para que ahora sea visible
    container.classList.remove('is-hidden');

    // Creas los hidden inputs para enviarlos al backend
    createHiddenInput(newRow, 'idMateriaEliminado[]', idMateria, `idEliminado${materiaRow}`);
    createHiddenInput(newRow, '', materia, `materiaEliminado${materiaRow}`);
    createHiddenInput(newRow, '', creditos, `creditosEliminado${materiaRow}`);
    createHiddenInput(newRow, '', precio, `precioEliminado${materiaRow}`);
    createHiddenInput(newRow, 'nombreProfesorCompletoEliminado[]', profesor, `profesorEliminado${materiaRow}`);
    createHiddenInput(newRow, 'salonEliminado[]', salon, `salonEliminado${materiaRow}`);
    createHiddenInput(newRow, 'fechaInicioEliminado[]', fechaInicio, `fechaInicioEliminado${materiaRow}`);
    createHiddenInput(newRow, 'fechaFinEliminado[]', fechaFin, `fechaFinEliminado${materiaRow}`);
    createHiddenInput(newRow, 'grupoHorarioEliminado[]', horario, `horarioEliminado${materiaRow}`);

    // Borrar la tabla del front end
    document.querySelector('#tablaMaterias' + materiaRow).remove();
}

function createHiddenInput(parent, name, value, id) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    input.id = id;
    parent.appendChild(input);
}