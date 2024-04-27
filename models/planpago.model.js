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
        return db.execute('Select * from planPago')
    }

    static save(nombrePlan,numeroPagos) {
        return db.execute(`INSERT INTO planPago (nombrePlan, numeroPagos, planPagoActivo) 
        VALUES(?, ?, 1)        
        `, [nombrePlan, numeroPagos]);
    }

    static fetchOne(nombre){
        return db.execute('Select * from planPago WHERE nombrePlan = ?',[nombre]);
    }

    static fetchAllActivePlans(){
        return db.execute('SELECT nombrePlan, IDPlanPago FROM Planpago WHERE planPagoActivo = 1');
    }
}
