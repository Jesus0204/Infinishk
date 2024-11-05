const db = require('../util/database');

module.exports = class Reporte {
    constructor(mi_matricula, mi_IDPagoExtra) {
        this.matricula = mi_matricula;
        this.IDPagoExtra = mi_IDPagoExtra;
    }

    static fetchPeriodos() {
        return db.execute(`SELECT * FROM Periodo WHERE periodoActivo = 0 ORDER BY IDPeriodo DESC`);
    }

    static async fetchFechaInicio(id) {
        const [rows] = await db.execute(`SELECT fechaInicio from Periodo WHERE nombre= ?`, [id]);
        const fechaInicio = rows[0].fechaInicio;
        return fechaInicio;
    }

    static async fetchFechaFin(id) {
        const [rows] = await db.execute(`SELECT fechaFin from Periodo WHERE nombre= ?`, [id]);
        const fechaFin = rows[0].fechaFin;
        return fechaFin;
    }

    static async fetchMetodosPagoPeriodo(fechaInicio, fechaFin) {
        const [rows] = await db.execute(`
            SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
            FROM Pago 
            WHERE metodoPago = 'Tarjeta'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
            FROM pagaDiplomado 
            WHERE metodoPago = 'Tarjeta'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
            FROM Liquida 
            WHERE metodoPago = 'Tarjeta'
            AND Pagado = 1
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras
            ))) AS TotalGeneralTarjeta,

            (SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
            FROM Pago 
            WHERE metodoPago = 'Efectivo'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
            FROM pagaDiplomado 
            WHERE metodoPago = 'Efectivo'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
            FROM Liquida 
            WHERE metodoPago = 'Efectivo'
            AND Pagado = 1
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras
            ))) AS TotalGeneralEfectivo,

            (SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
            FROM Pago 
            WHERE metodoPago = 'Transferencia'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
            FROM pagaDiplomado 
            WHERE metodoPago = 'Transferencia'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
            FROM Liquida 
            WHERE metodoPago = 'Transferencia'
            AND Pagado = 1
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras
            )) AS TotalGeneralEfectivo`,
            [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin,
                fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin,
                fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin
            ]);
    }

    /* fetchMetodoPago para cada mes */

    static async fetchIngresosColegiatura(fechaInicio, fechaFin) {
        const [rows] = await db.execute(`SELECT ROUND(SUM(pago.montoPagado),2) AS totalColegiatura
        FROM Pago
        WHERE fechaPago >= ? AND fechaPago <= ?`, [fechaInicio, fechaFin]);
        const montoColegiatura = rows[0].montoColegiatura;
        return montoColegiatura;
    }

    static async fetchIngresosPeriodo(fechaInicio, fechaFin) {
        const [rows] = await db.execute(`
            SELECT
                (SELECT ROUND(SUM(montoPagado),2) FROM Pago WHERE fechaPago >= ? AND fechaPago <= ?) AS montoColegiatura,
                (SELECT ROUND(SUM(montoPagado),2) FROM pagaDiplomado WHERE fechaPago >= ? AND fechaPago <= ?) AS montoDiplomado,
                (SELECT ROUND(SUM(pagosExtras.montoPagar), 2)
                 FROM Liquida
                 JOIN pagosExtras ON Liquida.IDPagosExtras = pagosExtras.IDPagosExtras
                 WHERE Liquida.Pagado = 1
                 AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras;`,
            [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const montoColegiatura = rows[0].montoColegiatura;
        const montoDiplomado = rows[0].montoDiplomado;
        const montoPagosExtras = rows[0].montoPagosExtras;

        return {
            montoColegiatura,
            montoDiplomado,
            montoPagosExtras
        };
    }

    /* fetchIngresos para cada mes */

    static async fetchIngresosMes(mes, fechaInicio, fechaFin) {
        const [rows, fieldData] = await db.execute(`
            CALL fetchIngresosMes(?, ?, ?)`,
            [mes, fechaInicio, fechaFin]);
        const data = rows[0][0]
        const Colegiatura = data.totalColegiatura;
        const Diplomado = data.totalDiplomado;
        const PagosExtras = data.totalPagosExtras;
        return {
            Colegiatura,
            Diplomado,
            PagosExtras
        };
    }

    static async fetchMetodosPagoMes(mes, fechaInicio, fechaFin) {
        const [rows, fieldData] = await db.execute(`
            CALL fetchMetodosPagoMes(?, ?, ?)`,
            [mes, fechaInicio, fechaFin]);
        const data = rows[0][0]
        const Tarjeta_Terminal = data.Tarjeta_Terminal;
        const Web_Tarjeta = data.Web_Tarjeta
        const Efectivo = data.Efectivo;
        const Transferencia = data.Transferencia;
        return {
            Tarjeta_Terminal,
            Web_Tarjeta,
            Efectivo,
            Transferencia
        };
    }
}