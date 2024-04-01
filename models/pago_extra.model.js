const db = require('../util/database');

module.exports = class PagoExtras {

    constructor(mi_motivoPago, mi_montoPagar) {
        this.motivoPago = mi_motivoPago;
        this.montoPagar = mi_montoPagar;
    }

    save() {
        return db.execute(`INSERT INTO pagosExtras (motivoPago, montoPagar) 
        VALUES(? , ? )
        `, [this.motivoPago, this.montoPagar]);
    }

};