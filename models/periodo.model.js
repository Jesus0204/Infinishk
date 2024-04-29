const db = require('../util/database');

module.exports = class Periodo {
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor() {

    }

    static fetchActivo() {
        return db.execute(`SELECT IDPeriodo From Periodo WHERE periodoActivo = 1`);
    }

}