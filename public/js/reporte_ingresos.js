function generateReport() {
    const periodo = document.getElementById('periodo').value;
    const tipo = document.getElementById('tipo').value;
    const csrf = document.getElementById('_csrf').value;

    fetch('/pagos/reporte_ingresos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            periodo,
            tipo
        })
    })
    .then(response => response.json())
    .then(ingresosData => {
        if (typeof ingresosData !== 'undefined') {
            console.log(ingresosData);
            var initialChartData = prepareChartData(ingresosData, tipo);
            renderChart(initialChartData, tipo);
        } else {
            console.log("javascript: ingresosData no está definido.");
        }
    });
}

function prepareChartData(ingresosData, tipo) {
    let labels = Object.keys(ingresosData.ingresosData);
    let data = Object.values(ingresosData.ingresosData);

    let categories = ['Colegiatura', 'Diplomado', 'PagosExtras'];

    let series = [];

    data.forEach(month => {
        let monthData = [];

        categories.forEach(category => {
            let categoryKey = Object.keys(month).find(key => key.toLowerCase().includes(category.toLowerCase()));
            if (categoryKey && (!tipo || tipo === 'todos' || category.toLowerCase() === tipo.toLowerCase())) {
                monthData.push(month[categoryKey]);
            }
        });

        series.push({
            name: labels[data.indexOf(month)],
            data: monthData
        });
    });

    return {
        labels: labels,
        series: series
    };
}

function getColorByCategoria(categoria) {
    switch (categoria) {
        case 'Colegiatura':
            return '#95404c';
        case 'Diplomado':
            return '#5a6581';
        case 'PagosExtras':
            return '#7c7f80';
        default:
            return '#000000';
    }
}

var myChart;

function renderChart(chartData, tipo) {
    var categories = ['Colegiatura', 'Diplomado', 'PagosExtras'];
    var labels = chartData.labels;
    var datasets = [];

    console.log('ChartData:', chartData);

    if (tipo.toLowerCase() === 'todos') {
        categories.forEach((category, index) => {
            var data = chartData.series.map(series => series.data[index]);
            var color = getColorByCategoria(category);

            datasets.push({
                label: category,
                backgroundColor: color,
                data: data
            });
        });
    } else {
        var index = categories.findIndex(cat => cat.toLowerCase() === tipo.toLowerCase());
        if (index !== -1) {
            var data = labels.map(month => {
                var monthData = chartData.series.find(item => item.name === month);
                return monthData && monthData.data ? monthData.data : null;
            });
            var color = getColorByCategoria(categories[index]);
            
            datasets.push({
                label: categories[index],
                backgroundColor: color,
                data: data
            });
        }
    }

    var chartConfig = {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true
                }
            }
        }
    };

    var ctx = document.getElementById('bar-chart').getContext('2d');
    
    if (myChart) {
        myChart.data = chartConfig.data;
        myChart.options = chartConfig.options;
        myChart.update();
    } else {
        myChart = new Chart(ctx, chartConfig);
    }

    const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    chartData.series.forEach((serie, index) => {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = serie.name;
        const td2 = document.createElement('td');
        td2.textContent = serie.data.reduce((acc, value) => acc + value, 0).toFixed(2);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tabla.appendChild(tr);
    });

    document.getElementById('tabla').style.display = 'table';
    
    // probably also calculate and display the periodo total
}