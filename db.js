require('dotenv').config();
const mysql = require('mysql2');

// Pool em vez de uma conexão única: o MySQL fecha conexões ociosas e a API
// continuaria falhando até ser reiniciada. O pool reabre conexões sozinho.
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'escola',
    connectionLimit: 10,
});

// Teste de conexão ao subir: avisa cedo se o .env estiver errado.
pool.getConnection((err, conn) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.message);
        return;
    }
    console.log('Conectado ao MySQL');
    conn.release();
});

module.exports = pool;
