const db = require('../util/database');

module.exports = class PrecioCredito {
    constructor(mi_monto) {
        this.monto = mi_monto;
    }

    static fetchPrecioActual() {
        return db.execute(`SELECT precioPesos, fechaModificacion FROM precioCredito WHERE precioActivo = 1`);
    }

    static fetchCreditoActivo(){
        return db.execute(`SELECT precioPesos FROM preciocredito WHERE precioActivo = 1`);
    }

    static fetchAnios() {
        return db.execute(`SELECT DISTINCT year(fechaModificacion) FROM precioCredito ORDER BY year(fechaModificacion) ASC`);
    }

    static fetchPrecioAnio(anio) {
        return db.execute(`SELECT precioPesos, fechaModificacion FROM precioCredito WHERE year(fechaModificacion) = ?`, [anio]);
    }

    static update(monto) {
        return db.execute(`CALL InsertarPrecioCredito(?)`, [monto]);
    }

    static fetchIDActual(){
        return db.execute(`SELECT IDPrecioCredito FROM precioCredito WHERE precioActivo = 1`);
    }
};