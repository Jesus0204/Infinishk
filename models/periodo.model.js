const db = require('../util/database');

module.exports = class Periodo {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDPeriodo, mi_fechaInicio, mi_fechaFin, mi_Nombre, mi_periodoActivo) {
        this.IDPeriodo = mi_IDPeriodo;
        this.fechaInicio = mi_fechaInicio;
        this.fechaFin = mi_fechaFin;
        this.Nombre = mi_Nombre;
        this.periodoActivo = mi_periodoActivo;
    }
    
}