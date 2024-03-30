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

    static fetchActivos(){
        return db.execute('SELECT IDDeuda,montoAPagar FROM deuda WHERE Pagado=0 AND Now()>fechaLimitePago')
    }

    static update_transferencia(monto,id_deuda){
        return db.execute('UPDATE Deuda SET montoPagado = montoPagado + ? \n WHERE IDDeuda = ?',
        [monto, id_deuda]);
    }
    
}