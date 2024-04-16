const db = require('../util/database');

module.exports = class PrecioCredito {
    constructor(mi_monto) {
        this.monto = mi_monto;
    }

    static fetchPrecioActual() {
        return db.execute(`SELECT precioPesos, fechaModificacion FROM precioCredito WHERE precioActivo = 1`);
    }

    static update(monto) {
        return db.execute(`CALL InsertarPrecioCredito(?)`, [monto]);
    }
};