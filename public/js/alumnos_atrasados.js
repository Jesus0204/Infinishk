document.addEventListener('DOMContentLoaded', function () {

    const atrasados = document.getElementById('atrasados').innerHTML;
    const totales = document.getElementById('totales').innerHTML;

    let numAtrasados = atrasados;
    let numNormal = (totales - atrasados);

    // Configuración y renderizado del gráfico
    new Chartist.Pie('#bar-chart', {
        labels: ["Atrasados: " + numAtrasados, "A Tiempo: " + numNormal],
        series: [{
                value: atrasados
            },
            {
                value: (totales - atrasados)
            }
        ]
    }, {
        chartPadding: 50,
        labelOffset: 50,
        labelDirection: 'explode',
    });

});

const resultadoQuery = document.querySelector('#resultadoQuery');

// Función para manejar la búsqueda en la tabla de alumnos atrasados
$('#searchAlumnos').on('input', function () {
    const consulta = $(this).val().toLowerCase();

    $('.tablaAlumnos').each(function () {
        const table = $(this);
        let shouldShowTable = false;

        table.find('thead tr th').each(function () {
            const header = $(this);
            if (header.text().toLowerCase().indexOf(consulta) > -1) {
                shouldShowTable = true;
                return false; // Exit each loop early since we found a match
            }
        });

        if (shouldShowTable) {
            table.show();
        } else {
            table.hide();
        }
    });

    // Cuentas cuantos alumnos atrasados hay
    let table_length = 0;

    $('.tablaAlumnos').each(function () {
        table_length++;
    });

    let count = 0;

    $('.tablaAlumnos').each(function () {
        if (this.getAttribute("style")) {
            count++;
        }
    });

    if (count == table_length) {
        resultadoQuery.classList.remove('is-hidden');
    } else {
        resultadoQuery.classList.add('is-hidden');
    }
});