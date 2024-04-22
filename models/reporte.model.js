const db = require('../util/database');

module.exports = class Reporte {
    constructor(mi_matricula, mi_IDPagoExtra) {
        this.matricula = mi_matricula;
        this.IDPagoExtra = mi_IDPagoExtra;
    }

    static fetchPeriodos() {
        return db.execute(`SELECT * FROM Periodo WHERE periodoActivo = 0 ORDER BY IDPeriodo DESC`);
    }

    static async fetchFechaInicio(id){
        const [rows] = await db.execute(`SELECT fechaInicio from Periodo WHERE nombre= ?`,[id]);
        const fechaInicio = rows[0].fechaInicio;
        return fechaInicio;
    }

    static async fetchFechaFin(id){
        const [rows] = await db.execute(`SELECT fechaFin from Periodo WHERE nombre= ?`,[id]);
        const fechaFin = rows[0].fechaFin;
        return fechaFin;
    }

    static async fetchIngresosColegiatura(fechaInicio,fechaFin){
        const [rows] = await db.execute(`SELECT SUM(pago.montoPagado) AS totalColegiatura
        FROM pago
        WHERE fechaPago >= ? AND fechaPago <= ?`,[fechaInicio,fechaFin]);
        const montoColegiatura = rows[0].montoColegiatura;
        return montoColegiatura;
    }
}