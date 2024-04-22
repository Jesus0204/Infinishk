const db = require('../util/database');

module.exports = class Fichas {
    constructor(mi_montoAPagar,mi_montoPagado,mi_Descuento,mi_notaModificacion,mi_modificadoAt,mi_fechaLimitePago){
        this.montoAPagar = mi_montoAPagar;
        this.montoPagado = mi_montoPagado;
        this.Descuento = mi_Descuento;
        this.notaModificacion = mi_notaModificacion;
        this.modificadoAt = mi_modificadoAt;
        this.fechaLimitePago = mi_fechaLimitePago;
    }

    static fetch(valor_busqueda){
        return db.execute(`SELECT IDDeuda, Pagado, montoAPagar, montoPagado, Descuento, notaModificacion, modificado_At,
        fechaLimitePago FROM Deuda
        JOIN Colegiatura on Deuda.IDColegiatura = Colegiatura.IDColegiatura
        JOIN Periodo ON Colegiatura.IDPeriodo = Periodo.IDPeriodo
        WHERE Deuda.Matricula = ? AND Periodo.periodoActivo = 1;`, [valor_busqueda]);
    }

    static update(id, descuento, fechaLimitePago, notaModificacion) {
        return db.execute(`UPDATE Deuda SET Descuento = ?, fechaLimitePago = ?, notaModificacion = ?, modificado_At = NOW()
        WHERE IDDeuda = ?`, [descuento, fechaLimitePago, notaModificacion, id]);
    }
}