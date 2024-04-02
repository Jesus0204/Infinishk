const db = require('../util/database');

module.exports = class Liquida {

    constructor(mi_matricula, mi_IDPagoExtra) {
        this.matricula = mi_matricula;
        this.IDPagoExtra = mi_IDPagoExtra;
    }

    save() {
        return db.execute(`INSERT INTO Liquida
        (Matricula, IDPagosExtras, fechaPago, Pagado)
        VALUES (?, ?, Null, 0)`, [this.matricula, this.IDPagoExtra]);
    }

};