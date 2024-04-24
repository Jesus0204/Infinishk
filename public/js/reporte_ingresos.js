function generateReport() {
    const periodo = document.getElementById('periodo').value;
    const csrf = document.getElementById('_csrf').value;

    fetch('/pagos/reporte_ingresos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        },
        body: JSON.stringify({
            periodo
        })
    })
    .then(response => response.json())
    .then(ingresosData => {
        if (typeof ingresosData !== 'undefined') {
            console.log(ingresosData);
            var initialChartData = prepareChartData(ingresosData);
            renderChart(initialChartData);
        } else {
            console.log("javascript: ingresosData no está definido.");
        }
    });
}

function prepareChartData(ingresosData) {
    let labels = Object.keys(ingresosData.ingresosData);
    let data = Object.values(ingresosData.ingresosData);
    
    let series = [];

    data.forEach((month, index) => {
        let monthData = [];

        Object.keys(month).forEach(category => {
            monthData.push(month[category]);
        });

        let monthSeries = {
            name: labels[index],
            data: monthData
        };

        series.push(monthSeries);
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

function renderChart(chartData) {
    var categories = ['Colegiatura', 'Diplomado', 'PagosExtras'];
    var labels = chartData.labels;
    var datasets = [];

    categories.forEach((category, index) => {
        var data = chartData.series.map(series => series.data[index]);
        var color = getColorByCategoria(category);

        datasets.push({
            label: category,
            backgroundColor: color,
            data: data
        });
    });

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
}