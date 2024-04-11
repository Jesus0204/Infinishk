const db = require('../util/database');

module.exports = class Alumno {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_Matricula,mi_Nombre,mi_Apellidos,mi_referenciaBancaria){
        this.Matricula = mi_Matricula;
        this.Nombre = mi_Nombre;
        this.Apellidos = mi_Apellidos;
        this.referenciaBancaria = mi_referenciaBancaria;
    }

    static fetchNombre(matricula){
        return db.execute('SELECT Nombre,Apellidos FROM alumno WHERE Matricula = ?',
        [matricula]);
    }
}