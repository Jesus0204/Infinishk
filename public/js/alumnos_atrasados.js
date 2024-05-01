document.addEventListener('DOMContentLoaded', function () {

    const atrasados = document.getElementById('atrasados').innerHTML;
    const totales = document.getElementById('totales').innerHTML;

    let porcAtrasados = ((atrasados/totales) * 100).toFixed(2);
    let porcNormal = (((totales - atrasados)/ totales) * 100).toFixed(2);

    // Configuración y renderizado del gráfico
    new Chartist.Pie('#bar-chart', {
        labels: ["Atrasados: " + porcAtrasados + "%", "A Tiempo " + porcNormal + "%"],
        series: [{
                value: atrasados
            },
            {
                value: (totales - atrasados)
            }]
    }, {
        chartPadding: 50,
        labelOffset: 50,
        labelDirection: 'explode',
    });

});