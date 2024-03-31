const db = require('../util/database');

module.exports = class PagoExtra {

    constructor(mi_motivoPago, mi_montoPagar) {
        this.motivoPago = mi_motivoPago;
        this.montoPagar = mi_montoPagar;
    }

    save() {
        return db.execute(`INSERT INTO pagosExtra (motivoPago, montoPagar) 
        VALUES( ? , ? )
        `, [this.motivoPago, this.montoPagar]);
    }

};