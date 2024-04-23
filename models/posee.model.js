const db = require('../util/database');

module.exports = class Posee {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDUsuario, mi_IDRol) {
        this.IDUsuario = mi_IDUsuario;
        this.IDRol = mi_IDRol;
    }

    static savePosee(id,rol){
        return db.execute('INSERT INTO `posee`(`IDUsuario`, `IDRol`) VALUES (?,?)',[id,rol])
    }

}