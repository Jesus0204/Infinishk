const db = require('../util/database');

module.exports = class Diplomado{
    constructor(mi_IDDiplomado,mi_Duracion,mi_precioDiplomado,mi_nombreDiplomado){
        this.IDDiplomado = mi_IDDiplomado;
        this.Duracion = mi_Duracion;
        this.precioDiplomado = mi_precioDiplomado;
        this.nombreDiplomado = mi_nombreDiplomado;
    }


    static save(duracion,precio,nombre,status) {
        return db.execute(
            `INSERT INTO diplomado (Duracion, precioDiplomado, nombreDiplomado,diplomadoActivo) VALUES ( ?, ?, ?,?)`, 
                [duracion,precio,nombre,status]);
    }

    static fetchAll() {
        return db.execute('Select * from diplomado')
    }

    static fetchOne(nombre){
        return db.execute('Select * from diplomado WHERE nombreDiplomado = ?',[nombre]);
    }

    static update(id,duracion,precio,nombre,status){
        return db.execute('UPDATE diplomado SET Duracion=?, precioDiplomado=?, nombreDiplomado=?, diplomadoActivo=? WHERE IDDiplomado=?',
        [duracion,precio,nombre,status,id]);
    }

    static buscar(consulta) {
        return db.execute(
            'SELECT * FROM diplomado WHERE nombreDiplomado LIKE ? AND diplomadoActivo = 1',
            [`%${consulta}%`]
        );
    }

};

