const express = require('express');
const { validarAluno, calcularResultado } = require('./validacao');

/**
 * Monta a aplicação Express. Recebe o `db` por parâmetro para que os testes
 * usem um banco falso, sem precisar de MySQL.
 */
function criarApp(db, { origemPermitida = 'http://localhost:5173' } = {}) {
    const app = express();
    app.use(express.json());

    // CORS: sem isto o navegador bloqueia as chamadas do front-end (que roda em outra porta).
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', origemPermitida);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        // O navegador faz uma "pergunta prévia" (OPTIONS) antes de um POST com JSON.
        if (req.method === 'OPTIONS') return res.sendStatus(204);
        next();
    });

    // Erro de banco: o detalhe vai para o console do servidor, nunca para quem chamou a API.
    function erroInterno(res, err) {
        console.error('Erro no banco:', err);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }

    app.get('/alunos', (req, res) => {
        db.query('SELECT * FROM alunos', (err, results) => {
            if (err) return erroInterno(res, err);
            res.status(200).json(results);
        });
    });

    app.get('/alunos/:id', (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: 'Id inválido' });
        }

        db.query('SELECT * FROM alunos WHERE id = ?', [id], (err, results) => {
            if (err) return erroInterno(res, err);
            if (results.length === 0) {
                return res.status(404).json({ erro: 'Aluno não encontrado' });
            }
            res.json(results[0]);
        });
    });

    app.post('/alunos', (req, res) => {
        const validacao = validarAluno(req.body);
        if (!validacao.ok) return res.status(400).json({ erro: validacao.erro });

        const { nome, email, nota1, nota2 } = validacao.dados;
        const { notaFinal, status } = calcularResultado(nota1, nota2);

        const sql = `
            INSERT INTO alunos (nome, email, nota1, nota2, notaFinal, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(sql, [nome, email, nota1, nota2, notaFinal, status], (err, result) => {
            if (err) return erroInterno(res, err);
            res.status(201).json({ id: result.insertId, nome, notaFinal, status });
        });
    });

    // JSON malformado no corpo da requisição vira 400 (e não um 500 com stack trace).
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        if (err.type === 'entity.parse.failed') {
            return res.status(400).json({ erro: 'JSON inválido' });
        }
        console.error(err);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    });

    return app;
}

module.exports = { criarApp };
