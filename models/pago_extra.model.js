const db = require('../util/database');

module.exports = class PagoExtra {

    constructor(mi_motivoPago, mi_montoPagar) {
        this.motivoPago = mi_motivoPago;
        this.montoPagar = mi_montoPagar;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM pagosExtras');
    }

    static fetchOne(id){
        return db.execute('SELECT * FROM pagosExtras WHERE IDPagosExtras = ?', [id]);
    }

    save() {
        return db.execute(`INSERT INTO pagosExtras (motivoPago, montoPagar) 
        VALUES(? , ? )
        `, [this.motivoPago, this.montoPagar]);
    }

    static update(id, motivo, monto) {
        return db.execute(`UPDATE pagosExtras SET motivoPago = ?, montoPagar = ?
        WHERE IDPagosExtras = ?`, [motivo, monto, id]);
    }

};