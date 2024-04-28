const db = require('../util/database');

module.exports = class rol {
    constructor(mi_monto) {
        this.nombreRol = nombreRol;
    }

    static fetchAll() {
        return db.execute(`SELECT nombreRol FROM Rol`);
    }

    static fetchNotAll() {
        return db.execute(`SELECT nombreRol FROM Rol WHERE IDRol!=3`);
    }
};