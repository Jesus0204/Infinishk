const db = require('../util/database');

module.exports = class Deuda {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDDeuda,mi_IDColegiatura,mi_Matricula,mi_montoPagado,mi_montoAPagar,mi_fechaLimitePago,mi_Pagado){
        this.IDDeuda = mi_IDDeuda;
        this.IDColegiatura = mi_IDColegiatura;
        this.Matricula = mi_Matricula
        this.montoPagado = mi_montoPagado;
        this.montoAPagar =mi_montoAPagar;
        this.fechaLimitePago = mi_fechaLimitePago;
        this.Pagado = mi_Pagado;
    }

    static fetchDeuda(matricula){
        return db.execute('SELECT (montoAPagar-Descuento) AS "montoAPagar" FROM deuda WHERE Matricula = ? AND Pagado = 0',
        [matricula]);
    }

    static fetchDeudaPagada(matricula){
        return db.execute('SELECT (montoAPagar-Descuento) AS "montoAPagar" FROM deuda WHERE Matricula = ? AND Pagado = 1',
        [matricula]);
    }

    static fetchEstado(matricula){
        return db.execute('SELECT Pagado FROM deuda WHERE Matricula = ?',
        [matricula]);
    }

    static statusDeuda(id){
        return db.execute('SELECT Pagado FROM deuda WHERE IDDeuda = ?',
        [id]);
    }

    static update_transferencia(monto,id_deuda){
        return db.execute('UPDATE Deuda SET montoPagado = montoPagado + ? WHERE IDDeuda = ?',
        [monto, id_deuda]);
    }

    static fetchIDDeuda(matricula){
        return db.execute('SELECT IDDeuda FROM deuda WHERE Matricula = ? AND Pagado = 0',
        [matricula]);
    }
    
    static fetchIDColegiatura(matricula){
        return db.execute('SELECT IDColegiatura FROM deuda WHERE Matricula = ?',
        [matricula]);
    }
    
    static updateDescuento(diferencia,id){
        return db.execute('UPDATE Deuda SET Descuento = Descuento + ? WHERE IDDeuda = ?',
        [diferencia,id]);
    }
    
}