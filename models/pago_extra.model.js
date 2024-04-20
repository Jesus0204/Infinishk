const db = require('../util/database');

module.exports = class PagoExtra {

    constructor(mi_motivoPago, mi_montoPagar, mi_fecha) {
        this.motivoPago = mi_motivoPago;
        this.montoPagar = mi_montoPagar;
        this.fecha = mi_fecha;
    }

    static fetchAll() {
        return db.execute(`SELECT * FROM pagosExtras 
        WHERE IDPagosExtras IN (SELECT IDPagosExtras FROM Liquida)
        ORDER BY pagoExtraActivo DESC, createdAT DESC`);
    }

    static fetchActivos() {
        return db.execute('SELECT * FROM pagosExtras WHERE pagoExtraActivo = 1');
    }

    static fetchNoAsignados() {
        return db.execute('SELECT * FROM pagosExtras WHERE IDPagosExtras NOT IN (SELECT IDPagosExtras FROM Liquida)');
    }

    static fetchOne(id){
        return db.execute('SELECT * FROM pagosExtras WHERE IDPagosExtras = ?', [id]);
    }

    save() {
        return db.execute(`INSERT INTO pagosExtras (motivoPago, montoPagar, pagoExtraActivo, createdAt) 
        VALUES(?, ?, 1, ?)
        `, [this.motivoPago, this.montoPagar, this.fecha]);
    }

    static update(id, motivo, monto) {
        return db.execute(`UPDATE pagosExtras SET motivoPago = ?, montoPagar = ?, createdAT = NOW()
        WHERE IDPagosExtras = ?`, [motivo, monto, id]);
    }

    static update_estatus(id, estatus) {
        return db.execute(`UPDATE pagosExtras SET pagoExtraActivo = ?
        WHERE IDPagosExtras = ?`, [estatus, id])
    }

    static delete(id) {
        return db.execute(`DELETE FROM pagosExtras WHERE IDPagosExtras = ?`, [id]);
    }

    static fetchID(importe){
        return db.execute('Select IDPagosExtras from pagosExtras WHERE montoPagar = ?',[importe]);
    }

};