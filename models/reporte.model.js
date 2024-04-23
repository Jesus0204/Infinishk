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

    static async fetchIngresosPeriodo(fechaInicio, fechaFin) {
        const [rows] = await db.execute(`
            SELECT
                (SELECT SUM(montoPagado) FROM pago WHERE fechaPago >= ? AND fechaPago <= ?) AS montoColegiatura,
                (SELECT SUM(montoPagado) FROM pagadiplomado WHERE fechaPago >= ? AND fechaPago <= ?) AS montoDiplomado,
                (SELECT SUM(pagosextras.montoPagar)
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

    static async fetchIngresosEnero(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 1 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaEnero,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 1 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoEnero,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 1
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasEnero;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaEnero = rows[0].totalColegiaturaEnero;
        const totalDiplomadoEnero = rows[0].totalDiplomadoEnero;
        const totalPagosExtrasEnero = rows[0].totalPagosExtrasEnero;
        
        return { totalColegiaturaEnero, totalDiplomadoEnero, totalPagosExtrasEnero };
    }

    static async fetchIngresosFeb(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 2 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaFeb,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 2 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoFeb,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 2
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasFeb;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaFeb = rows[0].totalColegiaturaFeb;
        const totalDiplomadoFeb = rows[0].totalDiplomadoFeb;
        const totalPagosExtrasFeb = rows[0].totalPagosExtrasFeb;
        
        return { totalColegiaturaFeb, totalDiplomadoFeb, totalPagosExtrasFeb };
    }

    static async fetchIngresosMarzo(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 3 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaMarzo,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 3 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoMarzo,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 3
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasMarzo;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaMarzo = rows[0].totalColegiaturaMarzo;
        const totalDiplomadoMarzo = rows[0].totalDiplomadoMarzo;
        const totalPagosExtrasMarzo = rows[0].totalPagosExtrasMarzo;
        
        return { totalColegiaturaMarzo, totalDiplomadoMarzo, totalPagosExtrasMarzo };
    }

    static async fetchIngresosAbril(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 4
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaAbril,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 4
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoAbril,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 4
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasAbril;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaAbril = rows[0].totalColegiaturaAbril;
        const totalDiplomadoAbril = rows[0].totalDiplomadoAbril;
        const totalPagosExtrasAbril = rows[0].totalPagosExtrasAbril;
        
        return { totalColegiaturaAbril, totalDiplomadoAbril, totalPagosExtrasAbril };
    }

    static async fetchIngresosMayo(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 5 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaMayo,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 5 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoMayo,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 5
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasMayo;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaMayo = rows[0].totalColegiaturaMayo;
        const totalDiplomadoMayo = rows[0].totalDiplomadoMayo;
        const totalPagosExtrasMayo = rows[0].totalPagosExtrasMayo;
        
        return { totalColegiaturaMayo, totalDiplomadoMayo, totalPagosExtrasMayo };
    }

    static async fetchIngresosJun(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 6 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaJun,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 6 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoJun,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 6
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasJun;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaJun = rows[0].totalColegiaturaJun;
        const totalDiplomadoJun = rows[0].totalDiplomadoJun;
        const totalPagosExtrasJun = rows[0].totalPagosExtrasJun;
        
        return { totalColegiaturaJun, totalDiplomadoJun, totalPagosExtrasJun };
    }

    static async fetchIngresosJul(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 7 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaJul,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 7 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoJul,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 7
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasJul;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaJul = rows[0].totalColegiaturaJul;
        const totalDiplomadoJul = rows[0].totalDiplomadoJul;
        const totalPagosExtrasJul = rows[0].totalPagosExtrasJul;
        
        return { totalColegiaturaJul, totalDiplomadoJul, totalPagosExtrasJul };
    }

    static async fetchIngresosAgo(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 8 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaAgo,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 8 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoAgo,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 8
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasAgo;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaAgo = rows[0].totalColegiaturaAgo;
        const totalDiplomadoAgo = rows[0].totalDiplomadoAgo;
        const totalPagosExtrasAgo = rows[0].totalPagosExtrasAgo;
        
        return { totalColegiaturaAgo, totalDiplomadoAgo, totalPagosExtrasAgo };
    }

    static async fetchIngresosSept(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 9 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaSept,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 9 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoSept,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 9
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasSept;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaSept = rows[0].totalColegiaturaSept;
        const totalDiplomadoSept = rows[0].totalDiplomadoSept;
        const totalPagosExtrasSept = rows[0].totalPagosExtrasSept;
        
        return { totalColegiaturaSept, totalDiplomadoSept, totalPagosExtrasSept };
    }

    static async fetchIngresosOct(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 10 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaOct,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 10 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoOct,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 10
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasOct;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaOct = rows[0].totalColegiaturaOct;
        const totalDiplomadoOct = rows[0].totalDiplomadoOct;
        const totalPagosExtrasOct = rows[0].totalPagosExtrasOct;
        
        return { totalColegiaturaOct, totalDiplomadoOct, totalPagosExtrasOct };
    }

    static async fetchIngresosNov(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 11 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaNov,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 11 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoNov,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 11
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasNov;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaNov = rows[0].totalColegiaturaNov;
        const totalDiplomadoNov = rows[0].totalDiplomadoNov;
        const totalPagosExtrasNov = rows[0].totalPagosExtrasNov;
        
        return { totalColegiaturaNov, totalDiplomadoNov, totalPagosExtrasNov };
    }

    static async fetchIngresosDic(fechaInicio, fechaFin){
        const [rows] = await db.execute(`
        SELECT 
            (SELECT SUM(montoPagado) 
            FROM pago 
            WHERE MONTH(fechaPago) = 12 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalColegiaturaDic,
            
            (SELECT SUM(montoPagado) 
            FROM pagadiplomado 
            WHERE MONTH(fechaPago) = 12 
                AND fechaPago >= ? 
                AND fechaPago <= ?) AS totalDiplomadoDic,

            (SELECT SUM(pagosextras.montoPagar) 
            FROM liquida 
            JOIN pagosextras ON liquida.IDPagosExtras = pagosextras.IDPagosExtras 
            WHERE liquida.Pagado = 1 
                AND MONTH(fechaPago) = 12
                AND (fechaPago >= ? AND fechaPago <= ?)) AS totalPagosExtrasDic;`, 
               [fechaInicio, fechaFin, fechaInicio, fechaFin, fechaInicio, fechaFin]);

        const totalColegiaturaDic = rows[0].totalColegiaturaDic;
        const totalDiplomadoDic = rows[0].totalDiplomadoDic;
        const totalPagosExtrasDic = rows[0].totalPagosExtrasDic;
        
        return { totalColegiaturaDic, totalDiplomadoDic, totalPagosExtrasDic };
    }
}