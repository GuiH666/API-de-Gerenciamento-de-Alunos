let express = require('express');
let app = express();
app.use(express.json());

const PORT = 3000;
const db = require('./db');


app.get('/alunos', (req, res) => {
    db.query("SELECT * FROM alunos", (err, results) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        res.status(200).json(results);
    });
});


app.get('/alunos/:id', (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM alunos WHERE id = ?", [id], (err, results) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ erro: "Aluno não encontrado" });
        }

        res.json(results[0]);
    });
});


app.post('/alunos', (req, res) => {
    const { nome, email, nota1, nota2 } = req.body;
    
    if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
    if (!email) return res.status(400).json({ erro: 'Email é obrigatório' });
    if (nota1 === undefined) return res.status(400).json({ erro: 'Nota1 é obrigatória' });
    if (nota2 === undefined) return res.status(400).json({ erro: 'Nota2 é obrigatória' });

    if (typeof nota1 !== 'number' || typeof nota2 !== 'number') {
        return res.status(400).json({ erro: 'Notas devem ser números' });
    }

    if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10) {
        return res.status(400).json({ erro: 'Notas devem estar entre 0 e 10' });
    }

    const notaFinal = nota1 + nota2;
    const status = notaFinal >= 7 ? 'Aprovado' : 'Reprovado';

    const sql = `
        INSERT INTO alunos (nome, email, nota1, nota2, notaFinal, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [nome, email, nota1, nota2, notaFinal, status], (err, result) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        res.status(201).json({
            id: result.insertId,
            nome,
            notaFinal,
            status
        });
    });
});



app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});