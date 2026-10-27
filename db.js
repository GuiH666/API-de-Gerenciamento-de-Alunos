require('dotenv').config();
const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'escola'
});

conn.connect((err) => {
    if (err) {
        console.error("Erro ao conectar", err);
        return;
    }
    console.log("Conectado ao MySQL");
});

module.exports = conn;
