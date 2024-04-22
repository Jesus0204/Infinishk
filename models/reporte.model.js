const db = require('../util/database');

module.exports = class Reporte {
    constructor(mi_matricula, mi_IDPagoExtra) {
        this.matricula = mi_matricula;
        this.IDPagoExtra = mi_IDPagoExtra;
    }

    static fetchPeriodos() {
        return db.execute(`SELECT * FROM Periodo WHERE periodoActivo = 0 ORDER BY IDPeriodo DESC`);
    }

    static fetchIngresosPeriodo() {
        return db.execute(`SELECT * FROM Periodo WHERE periodoActivo = 0 ORDER BY IDPeriodo DESC`);
    }
}