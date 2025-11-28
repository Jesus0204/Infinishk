document.addEventListener('DOMContentLoaded', function () {
    const tabla = document.getElementById('tabla-alumnos').querySelector('tbody');
    const sortAscBtn = document.getElementById('sort-asc');
    const sortDescBtn = document.getElementById('sort-desc');
    const ordenarTabla = (ascendente = true) => {
        const filas = Array.from(tabla.querySelectorAll('tr'));
        filas.sort((a, b) => {
            const pagosA = Number(a.dataset.pagos);
            const pagosB = Number(b.dataset.pagos);
            return ascendente ? pagosA - pagosB : pagosB - pagosA;
        });
        filas.forEach(fila => tabla.appendChild(fila));
    };

    sortAscBtn.addEventListener('click', () => ordenarTabla(true));
    sortDescBtn.addEventListener('click', () => ordenarTabla(false));
    ordenarTabla(true);
});