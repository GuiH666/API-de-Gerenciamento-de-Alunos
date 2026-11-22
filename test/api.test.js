const test = require('node:test');
const assert = require('node:assert/strict');
const { criarApp } = require('../src/app');

// Banco falso (o SQL do app começa com quebra de linha, por isso o trim): guarda os alunos em memória e imita a interface db.query(sql, params, callback).
function bancoFalso({ falhar = false } = {}) {
    const alunos = [];
    return {
        alunos,
        query(sql, params, callback) {
            if (typeof params === 'function') { callback = params; params = []; }
            if (falhar) return callback(new Error('segredo: senha do banco'));
            if (sql.trim().startsWith('INSERT')) {
                const [nome, email, nota1, nota2, notaFinal, status] = params;
                alunos.push({ id: alunos.length + 1, nome, email, nota1, nota2, notaFinal, status });
                return callback(null, { insertId: alunos.length });
            }
            if (sql.includes('WHERE id')) {
                return callback(null, alunos.filter((a) => a.id === params[0]));
            }
            return callback(null, alunos);
        },
    };
}

// Sobe a API numa porta livre, roda o teste e derruba o servidor.
async function comServidor(db, teste) {
    const servidor = criarApp(db).listen(0);
    const base = `http://127.0.0.1:${servidor.address().port}`;
    try {
        await teste(base);
    } finally {
        servidor.close();
        servidor.closeAllConnections();
    }
}

const enviar = (base, corpo) => fetch(`${base}/alunos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof corpo === 'string' ? corpo : JSON.stringify(corpo),
});

test('POST /alunos cadastra, calcula o resultado e responde 201', async () => {
    const db = bancoFalso();
    await comServidor(db, async (base) => {
        const r = await enviar(base, { nome: 'Maria', email: 'm@e.com', nota1: 4, nota2: 5 });
        assert.equal(r.status, 201);
        assert.deepEqual(await r.json(), { id: 1, nome: 'Maria', notaFinal: 9, status: 'Aprovado' });
        assert.equal(db.alunos.length, 1);
    });
});

test('POST /alunos com dado inválido responde 400 e não grava', async () => {
    const db = bancoFalso();
    await comServidor(db, async (base) => {
        const r = await enviar(base, { nome: 'Maria', email: 'm@e.com', nota1: 11, nota2: 5 });
        assert.equal(r.status, 400);
        assert.equal((await r.json()).erro, 'Notas devem estar entre 0 e 10');
        assert.equal(db.alunos.length, 0);
    });
});

test('POST /alunos com JSON quebrado responde 400', async () => {
    await comServidor(bancoFalso(), async (base) => {
        const r = await enviar(base, '{nome: sem aspas');
        assert.equal(r.status, 400);
        assert.equal((await r.json()).erro, 'JSON inválido');
    });
});

test('GET /alunos lista e GET /alunos/:id acha ou responde 404', async () => {
    const db = bancoFalso();
    await comServidor(db, async (base) => {
        await enviar(base, { nome: 'Ana', email: 'a@e.com', nota1: 1, nota2: 1 });
        assert.equal((await (await fetch(`${base}/alunos`)).json()).length, 1);
        assert.equal((await (await fetch(`${base}/alunos/1`)).json()).nome, 'Ana');
        assert.equal((await fetch(`${base}/alunos/99`)).status, 404);
    });
});

test('GET /alunos/:id com id que não é número responde 400', async () => {
    await comServidor(bancoFalso(), async (base) => {
        assert.equal((await fetch(`${base}/alunos/abc`)).status, 400);
    });
});

test('erro do banco responde 500 sem vazar a mensagem interna', async () => {
    const silencio = console.error;
    console.error = () => {};
    try {
        await comServidor(bancoFalso({ falhar: true }), async (base) => {
            const r = await fetch(`${base}/alunos`);
            assert.equal(r.status, 500);
            const texto = JSON.stringify(await r.json());
            assert.ok(!texto.includes('segredo'));
        });
    } finally {
        console.error = silencio;
    }
});

test('OPTIONS responde 204 com cabeçalhos de CORS', async () => {
    await comServidor(bancoFalso(), async (base) => {
        const r = await fetch(`${base}/alunos`, { method: 'OPTIONS' });
        assert.equal(r.status, 204);
        assert.ok(r.headers.get('access-control-allow-origin'));
    });
});
