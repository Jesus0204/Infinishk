const db = require('../util/database');

module.exports = class PagoExtra {

    constructor(mi_IDPagoExtra, mi_motivo_pago, mi_montoPagar) {
        this.IDPagoExtra = mi_IDPagoExtra;
        this.motivo_pago = mi_motivo_pago;
        this.montoPagar = mi_montoPagar;
    }

    static fetchAll() {
        return db.execute('SELECT * FROM pagosExtras');
    }

    static fetchID(importe){
        return db.execute('SELECT IDPagosExtras FROM pagosextras WHERE CAST(montoPagar AS DECIMAL(10,2)) = CAST(? AS DECIMAL(10,2)) AND pagoExtraActivo = 1',[importe]);
    }

};