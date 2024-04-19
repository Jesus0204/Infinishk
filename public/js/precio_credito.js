document.addEventListener('DOMContentLoaded', () => {
    $('#anio').change(function () {
        let anioSelect = $(this).val();
        updatePrecioCredito(anioSelect);
    });
});

const updatePrecioCredito = (anio) => {
    const csrf = document.getElementById('_csrf').value;

    fetch('/configuracion/precio_credito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'csrf-token': csrf
            },
            body: JSON.stringify({
                anio: anio
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then((data) => {
            const precioCreditoRows = document.getElementById('precioCreditoRows');
            precioCreditoRows.innerHTML = '';
            data.precio_anio.forEach((precio) => {
                const tr = document.createElement('tr');
                const td1 = document.createElement('td');
                td1.innerHTML = `$ ${precio.precioPesos.toLocaleString('mx', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                const td2 = document.createElement('td');
                const fechaModificacion = precio.fechaModificacion;
                td2.innerHTML = fechaModificacion;
                tr.appendChild(td1);
                tr.appendChild(td2);
                precioCreditoRows.appendChild(tr);
            });
            const precioCreditoContainer = document.getElementById('precioCreditoContainer');
            precioCreditoContainer.style.display = 'table';
        })
        .catch(error => {
            console.error('Error en la petición fetch');
        });
}