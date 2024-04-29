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

    static async fetchMetodosPagoPeriodo(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
            SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
            FROM pago 
            WHERE metodoPago = 'Tarjeta'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
            FROM pagadiplomado 
            WHERE metodoPago = 'Tarjeta'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
            FROM liquida 
            WHERE metodoPago = 'Tarjeta'
            AND Pagado = 1
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras
            ))) AS TotalGeneralTarjeta,

            (SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
            FROM pago 
            WHERE metodoPago = 'Efectivo'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
            FROM pagadiplomado 
            WHERE metodoPago = 'Efectivo'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
            FROM liquida 
            WHERE metodoPago = 'Efectivo'
            AND Pagado = 1
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras
            ))) AS TotalGeneralEfectivo,

            (SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
            FROM pago 
            WHERE metodoPago = 'Transferencia'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
            FROM pagadiplomado 
            WHERE metodoPago = 'Transferencia'
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras)+
            (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
            FROM liquida 
            WHERE metodoPago = 'Transferencia'
            AND Pagado = 1
            AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras
            )) AS TotalGeneralEfectivo`, 
            [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin,
            fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin,
            fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);
    }
    
    /* fetchMetodoPago para cada mes */

    static async fetchMetodoPagoEnero(fechaInicio, fechaFin){
        const [rows] = await db.execute(` 
        SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
        FROM pago 
        WHERE metodoPago = 'Tarjeta'
        AND MONTH(fechaPago) = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS colegiaturaTarjeta)+
        (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
        FROM pagadiplomado 
        WHERE metodoPago = 'Tarjeta'
        AND MONTH(fechaPago) = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS diplomadoTarjeta)+
        (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
        FROM liquida 
        WHERE metodoPago = 'Tarjeta'
        AND MONTH(fechaPago) = 1
        AND Pagado = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS pagosExtrasTarjeta
        )) AS totalTarjetaEnero,
            
        SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
        FROM pago 
        WHERE metodoPago = 'Efectivo'
        AND MONTH(fechaPago) = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS colegiaturaEfectivo)+
        (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
        FROM pagadiplomado 
        WHERE metodoPago = 'Efectivo'
        AND MONTH(fechaPago) = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS diplomadoEfectivo)+
        (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
        FROM liquida 
        WHERE metodoPago = 'Efectivo'
        AND MONTH(fechaPago) = 1
        AND Pagado = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS pagosExtrasEfectivo
        )) AS totalEfectivoEnero,

        SELECT ((SELECT COUNT(DISTINCT IDPago) AS Colegiatura
        FROM pago 
        WHERE metodoPago = 'Transferencia'
        AND MONTH(fechaPago) = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS colegiaturaTransferencia)+
        (SELECT COUNT(DISTINCT Matricula, IDDiplomado) AS TotalPagos
        FROM pagadiplomado 
        WHERE metodoPago = 'Transferencia'
        AND MONTH(fechaPago) = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS diplomadoTransferencia)+
        (SELECT COUNT(DISTINCT IDLiquida) AS TotalPagos
        FROM liquida 
        WHERE metodoPago = 'Transferencia'
        AND MONTH(fechaPago) = 1
        AND Pagado = 1
        AND (fechaPago >= ? AND fechaPago <= ?)) AS pagosExtraTransferencia
        )) AS totalTransferenciaEnero`, 
        [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin,
            fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin,
            fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalTarjetaEnero = rows[0].totalTarjetaEnero;
        const totalEfectivoEnero = rows[0].totalEfectivoEnero;
        const totalTransferenciaEnero = rows[0].totalTransferenciaEnero;
        
        return { totalTarjetaEnero, totalEfectivoEnero, totalTransferenciaEnero};
    }


    static async fetchIngresosColegiatura(fechaInicio,fechaFin){
        const [rows] = await db.execute(`SELECT ROUND(SUM(pago.montoPagado),2) AS totalColegiatura
        FROM pago
        WHERE fechaPago >= ? AND fechaPago <= ?`,[fechaInicio,fechaFin]);
        const montoColegiatura = rows[0].montoColegiatura;
        return montoColegiatura;
    }

    static async fetchIngresosPeriodo(fechaInicio, fechaFin) {
        const [rows] = await db.execute(`
            SELECT
                (SELECT ROUND(SUM(montoPagado),2) FROM pago WHERE fechaPago >= ? AND fechaPago <= ?) AS montoColegiatura,
                (SELECT ROUND(SUM(montoPagado),2) FROM pagadiplomado WHERE fechaPago >= ? AND fechaPago <= ?) AS montoDiplomado,
                (SELECT ROUND(SUM(pagosextras.montoPagar),2)
                 FROM liquida
                 JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras
                 WHERE liquida.Pagado = 1
                 AND (fechaPago >= ? AND fechaPago <= ?)) AS montoPagosExtras;`, 
                 [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);
    
        const montoColegiatura = rows[0].montoColegiatura;
        const montoDiplomado = rows[0].montoDiplomado;
        const montoPagosExtras = rows[0].montoPagosExtras;
    
        return { montoColegiatura, montoDiplomado, montoPagosExtras };
    }

    /* fetchIngresos para cada mes */

    static async fetchIngresosMes(mes, fechaInicio, fechaFin){
        const [rows, fieldData] = await db.execute(`
            CALL fetchIngresosMes(?, ?, ?)`, 
               [mes, fechaInicio, fechaFin]);
        console.log('MES: '+mes+': \n')
        console.log(rows)
        const data = rows[0][0]
        const Colegiatura = data.totalColegiatura;
        console.log(Colegiatura)
        const Diplomado = data.totalDiplomado;
        console.log(Diplomado)
        const PagosExtras = data.totalPagosExtras;
        console.log(PagosExtras)
        
        return { Colegiatura, Diplomado, PagosExtras };
    }
}