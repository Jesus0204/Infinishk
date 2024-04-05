const db = require('../util/database');

module.exports = class Cursa{
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_IDDiplomado,mi_fechaInicio,mi_fechaFin){
        this.Matricula = mi_Matricula;
        this.IDDiplomado = mi_IDDiplomado;
        this.fechaInicio = mi_fechaInicio;
        this.fechaFin = mi_fechaFin;
    }
}