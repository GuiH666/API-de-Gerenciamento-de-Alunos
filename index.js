require('dotenv').config();
const db = require('./db');
const { criarApp } = require('./src/app');

const PORT = process.env.PORT || 3000;
const app = criarApp(db, { origemPermitida: process.env.CORS_ORIGIN || 'http://localhost:5173' });

app.listen(PORT, () => {
    console.log('Servidor rodando na porta ' + PORT);
});
