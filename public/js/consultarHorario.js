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
        let table_1;
        let table_2;

        if (numPagos == 1) {
            table_1 = `<tr><td>Pago #1</td><td>${precioFinal.toFixed(2)}</td><td>20 de Septiembre</td></tr>`;
            table_2 = '';
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else {
            let half = numPagos / 2;
            table_1 = '<tr><td>Pago #1</td><td>${precioFinal}</td><td>20 de Septiembre</td></tr>';
            table_2 = '<tr><td>Pago #1</td><td>${precioFinal}</td><td>20 de Septiembre</td></tr>';
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

        if (numPagos != 1){
            let table_1;
            let table_2;
            
            let pago1 = precioFinal * 0.23;
            let precioRestante = precioFinal * 0.77;
            let pagoMensual = precioRestante / (numPagos - 1);
    
            table_1 = `<tr><td>Pago #1</td><td>$${pago1.toFixed(2)}</td><td>20 de Septiembre</td></tr>`;
            table_2 = '';
    
            for (let pago = 1; pago < numPagos; pago++) {
                table_1 += `<tr><td>Pago #${pago + 1}</td><td>$${pagoMensual.toFixed(2)}</td><td>20 de Septiembre</td></tr>`;
            }
            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        } else {
            let table_1;
            let table_2;

            table_1 = `<tr><td>Pago #1</td><td>$${precioFinal.toFixed(2)}</td><td>20 de Septiembre</td></tr>`;
            table_2 = '';

            plans.push({
                numPagos: numPagos,
                table_1: table_1,
                table_2: table_2
            });
        }
    }

    return plans;
}

$(document).ready(function () {
    $('#IDPlanPago').change(function () {
        let numPagos = $(this).find(':selected').data('num');
        
        if (window.innerWidth >= 940) {
            let plans = plans_desktop();

            // Iteras sobre los planes para relevar las tablas
            for (let plan of plans) {
                if (numPagos == 1 || numPagos == 2 || numPagos == 3) {
                    table1_body.innerHTML = plan.table_1;
                    table1.classList.remove('is-hidden');
                    table2.classList.add('is-hidden');
                } else if (numPagos == plan.numPagos) {
                    table1_body.innerHTML = plan.table_1;
                    table2_body.innerHTML = plan.table_2;
                    table1.classList.remove('is-hidden');
                    table2.classList.remove('is-hidden');
                }
            }
        } else {
            let plans = plans_mobile();
            let numPagos = $(this).find(':selected').data('num');

            // Iteras sobre los planes para relevar las tablas
            for (let plan of plans) {
                if (numPagos == plan.numPagos) {
                    table1_body.innerHTML = plan.table_1;
                    table1.classList.remove('is-hidden');
                    table2.classList.add('is-hidden');
                }
            }
        }
    });

    window.addEventListener('resize', () => {
        let numPagos = $('#IDPlanPago').find(':selected').data('num');
        if (window.innerWidth >= 940) {
            let plans = plans_desktop();

            // Iteras sobre los planes para relevar las tablas
            for (let plan of plans) {
                if (numPagos == 1 || numPagos == 2 || numPagos == 3) {
                    table1_body.innerHTML = plan.table_1;
                    table1.classList.remove('is-hidden');
                    table2.classList.add('is-hidden');
                    column_table1.classList.remove('is-9');
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
            let numPagos = $(this).find(':selected').data('num');

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
    });
})
