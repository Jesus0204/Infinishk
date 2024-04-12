const db = require('../util/database');

module.exports = class PagoExtra {

    constructor(mi_IDPagoExtra, mi_motivo_pago, mi_montoPagar) {
        this.IDPagoExtra = mi_IDPagoExtra;
        this.motivo_pago = mi_motivo_pago;
        this.montoPagar = mi_montoPagar;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM pagosExtras WHERE pagoExtraActivo = 1');
    }

    static fetchID(importe){
        return db.execute('Select IDPagosExtras from pagosextras WHERE montoPagar = ?',[importe]);
    }

};