const db = require('../util/database');

module.exports = class Liquida {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_matricula, mi_IDPagoExtra) {
        this.matricula = mi_matricula;
        this.IDPagoExtra = mi_IDPagoExtra;
    }

    save() {
        return db.execute(`INSERT INTO Liquida
        (Matricula, IDPagosExtras, fechaPago, Pagado)
        VALUES (?, ?, Null, 0)`, [this.matricula, this.IDPagoExtra]);
    }

    static fetchID(matricula){
        return db.execute('Select IDLiquida from liquida WHERE Matricula = ?',[matricula]);
    }
}