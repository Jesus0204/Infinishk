const mysql = require('mysql2');

const connection = mysql.createConnection(process.env.JAWSDB_URL);

module.exports = connection;