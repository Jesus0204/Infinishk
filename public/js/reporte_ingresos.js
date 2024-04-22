document.addEventListener('DOMContentLoaded', function () {
    // Datos para el gráfico de barras
    var data = {
        labels: ['A', 'B', 'C', 'D'],
        series: [
            [10, 15, 8, 12] // Valores de las barras
        ]
    };

    // Opciones del gráfico de barras
    var options = {
        seriesBarDistance: 10 // Distancia entre las barras
    };

    // Configuración y renderizado del gráfico
    var chart = new Chartist.Bar('#bar-chart', data, options);

    // Animación al cargar el gráfico
    chart.on('draw', function(data) {
        if (data.type === 'bar') {
            data.element.animate({
                y2: {
                    dur: '0.5s',
                    from: data.y1,
                    to: data.y2
                }
            });
        }
    });
});