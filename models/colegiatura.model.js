const db = require('../util/database');

module.exports = class Colegiatura{
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDColegiatura,mi_IDPrecioCredito,mi_IDPlanPago,mi_IDPeriodo,mi_montoPagadoTotal){
        this.IDColegiatura = mi_IDColegiatura;
        this.IDPrecioCredito = mi_IDPrecioCredito;
        this.IDPlanPago = mi_IDPlanPago;
        this.IDPeriodo = mi_IDPeriodo;
        this.montoPagadoTotal = mi_montoPagadoTotal;
    }

    static update_transferencia(monto,idcolegiatura){
        return db.execute('UPDATE Colegiatura SET montoPagadoTotal = montoPagadoTotal + ? \n WHERE IDColegiatura = ?',
        [monto, idcolegiatura]);
    }
}