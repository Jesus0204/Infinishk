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

function renderChart(chartData) {
    var options = {
        seriesBarDistance: 10
    };

    var chart = new Chartist.Bar('#bar-chart', chartData, options);
}