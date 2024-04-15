const db = require('../util/database');

module.exports = class PrecioCredito {
    constructor(mi_monto) {
        this.monto = mi_monto;
    }

    static fetchPrecioActual() {
        return db.execute(`SELECT precioPesos, fechaModificacion FROM precioCredito WHERE precioActivo = 1`);
    }

    save() {
        return db.execute(`INSERT INTO precioCredito (precioPesos, fechaModificacion, precioActivo) 
        VALUES(?, NOW(), 1)`, [this.monto]);
    }

    static update() {
        return db.execute(`UPDATE precioCredito SET precioActivo = 0 WHERE precioActivo = 1`);
    }
};