const db = require('../util/database');

module.exports = class Usuario{
    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_IDUsuario,mi_Contrasena,mi_UsuarioActivo){
        this.IDUsuario = mi_IDUsuario;
        this.Contrasena = mi_Contrasena;
        this.UsuarioActivo = mi_UsuarioActivo;
    }
    static fetchOne(IDUsuario, Contrasena) {
        return db.execute('SELECT * FROM Usuario WHERE IDUsuario = ?',
            [IDUsuario]);
    }
}

