const db = require('../util/database');

module.exports = class PlanPago{
    constructor(mi_IDPlanPago,mi_nombrePlan,mi_numeroPagos,mi_planPagoActivo){
        this.IDPlanPago = mi_IDPlanPago;
        this.nombrePlan = mi_nombrePlan;
        this.numeroPagos= mi_numeroPagos;
        this.planPagoActivo = mi_planPagoActivo
    }

    static update(nombre, activo, IDPlanPago){
        return db.execute('UPDATE planPago SET nombrePlan=?, planPagoActivo=? WHERE IDPlanPago=?',
        [nombre, activo, IDPlanPago]);
    }

    static fetchAll() {
        return db.execute('Select * from planpago')
    }

    static save(nombrePlan,numeroPagos,planPagoActivo) {
        return db.execute(`INSERT INTO planpago (nombrePlan, numeroPagos, planPagoActivo) 
        VALUES(?, ?, ?)        
        `, [nombrePlan, numeroPagos, planPagoActivo]);
    }
}
