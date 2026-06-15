const mysql = require('mysql2');

const conn = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"0604",
    database:"escola"
});

conn.connect((err)=>{
    if(err){
        console.error("Erro ao conectar", err);
        return;
    }
console.log("Conectado ao MySQL");
});

module.exports = conn;
