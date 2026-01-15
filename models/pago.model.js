const db = require('../util/database');

module.exports = class Pago {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDPago,mi_IDDeuda,mi_Motivo,mi_montoPagado,mi_Nota,mi_tipoPago,mi_fechaPago){
        this.IDPago = mi_IDPago;
        this.IDDeuda = mi_IDDeuda;
        this.Motivo = mi_Motivo;
        this.montoPagado = mi_montoPagado;
        this.Nota = mi_Nota;
        this.tipoPago = mi_tipoPago;
        this.fechaPago = mi_fechaPago;
    }

    static fetch_fecha_pago(fecha, importe,nota, matricula) {
        return db.execute(
            `SELECT Pago.Nota, Pago.fechaPago, Pago.montoPagado, Deuda.matricula
             FROM Pago
             JOIN Deuda ON Pago.IDDeuda = Deuda.IDDeuda
             WHERE Pago.fechaPago = ? AND Pago.estadoPago = 1
             AND Pago.Nota = ?
             AND ROUND(Pago.montoPagado, 2) = ROUND(?, 2) AND Deuda.matricula = ?;`,
            [fecha,nota, importe, matricula]
        );
    }

    static save_transferencia(id,monto,nota,fecha) {
        return db.execute(`CALL insertar_Pago(?, '', ?, ?, 'Transferencia', ?);`, 
                [id, monto, nota,fecha]);
    }

    static save_pago_manual(idDeuda, motivo, monto, nota, metodo, fecha) {
        return db.execute(`CALL insertar_Pago(?, ?, ?, ?, ?, ?);`,
            [idDeuda, motivo, monto, nota, metodo, fecha]);
    }

    static save_pago_tarjeta_web(idDeuda, motivo, montoPagado, nota, metodoPago, fechaPago, referenciaPago) {
        return db.execute(`INSERT INTO Pago (IDDeuda, Motivo, montoPagado, Nota, metodoPago, fechaPago, estadoPago, referenciaPago)
            VALUES(?, ?, ?, ?, ?, ?, 0, ?);`,
            [idDeuda, motivo, montoPagado, nota, metodoPago, fechaPago, referenciaPago]);
    };

    static update_estado_pago(fechaPago, montoPagado, referenciaPago) {
        return db.execute(`UPDATE Pago SET estadoPago = 1, fechaPago = ?, montoPagado = ? WHERE referenciaPago = ?`, [fechaPago, montoPagado, referenciaPago]);
    }
    
    static update_pago_rechazado(referenciaPago) {
        return db.execute(`UPDATE Pago SET Nota = 'PAGO RECHAZADO' WHERE referenciaPago = ?`, [referenciaPago]);
    }

    static fetchPago_referencia(referencia) {
        return db.execute(`SELECT * FROM Pago WHERE referenciaPago = ?`, [referencia]);
    }

    static fetchOne(matricula){
        return db.execute(`SELECT P.IDPago, P.motivo, P.montoPagado, P.nota, P.metodoPago, P.fechaPago
        FROM Deuda AS D, Pago AS P, Colegiatura AS C, Periodo AS Pe
        WHERE D.IDDeuda = P.IDDeuda AND D.IDColegiatura = C.IDColegiatura AND
        C.IDPeriodo = Pe.IDPeriodo AND periodoActivo = 1
        AND D.matricula = ? AND P.estadoPago = 1
        ORDER BY P.fechaPago ASC
        LIMIT 0, 1000`, 
        [matricula]);
    }
    
    static save_tarjeta(id,motivo,monto,nota,fecha) {
        return db.execute(
            `CALL insertar_Pago(?, ?, ?, ?, 'Tarjeta', ?);`, 
                [id,motivo, monto, nota,fecha]);
    }

    static delete_col(id, usuario){
        return db.execute(`CALL eliminar_pago_col(?, ?);`, [id, usuario]);
    }

    static async eliminarPagosPeriodoActivo() {
        const [rows] = await db.execute(`
            SELECT d.IDDeuda
            FROM Deuda d
            JOIN Colegiatura c ON d.IDColegiatura = c.IDColegiatura
            JOIN Periodo per ON c.IDPeriodo = per.IDPeriodo
            WHERE per.periodoActivo = 1
        `);

        if (rows.length === 0) return;
        const ids = rows.map(r => r.IDDeuda);
        const placeholders = ids.map(() => '?').join(',');
        await db.execute(`DELETE FROM Pago WHERE IDDeuda IN (${placeholders})`, ids);
    }



}