function generateReport(){
    const periodo = document.getElementById('periodo').value;
    const csrf = document.getElementById('_csrf').value;

    fetch('/pagos/reporte_ingresos', {
        method: 'POST', 
        headers: {
        'Content-Type': 'application/json',
        'csrf-token': csrf
    }, 
    body: JSON.stringify({
        periodo})
    })
    .then(response => response.json())

    .then(ingresosData => {
        if (typeof ingresosData !== 'undefined') {    
            document.addEventListener('DOMContentLoaded', function () {
                var ingresosData = JSON.stringify(ingresosData);
    
                function prepareChartData(data) {
                    console.log('Preparing chart data:', data);
    
                    var labels = Object.keys(data);
                    var series = [];
    
                    Object.keys(data[labels[0]]).forEach(function (category) {
                        var categoryData = labels.map(function (month) {
                            return data[month][category] || 0;
                        });
                        series.push(categoryData);
                    });
    
                    console.log('Labels:', labels);
                    console.log('Series:', series); 
    
                    return {
                        labels: labels,
                        series: series
                    };
                }
    
                // Initial chart data based on data from controller
                var initialChartData = prepareChartData(ingresosData);
    
                console.log('Initial Chart Data:', initialChartData);
    
                // Options for the bar chart
                var options = {
                    seriesBarDistance: 10 // Distance between bars
                };
    
                console.log('Options:', options);
    
                // Render the initial chart with data from controller
                var chart = new Chartist.Bar('#bar-chart', initialChartData, options);
    
                console.log('Chart:', chart);
            });
    
        } else {
            console.log("javascript: ingresosData no está definido.");
        }
    });
}
