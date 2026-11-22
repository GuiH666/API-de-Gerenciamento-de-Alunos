const test = require('node:test');
const assert = require('node:assert/strict');
const { validarAluno, calcularResultado } = require('../src/validacao');

const valido = { nome: 'Maria Silva', email: 'maria@escola.com', nota1: 5, nota2: 6 };

test('aceita um aluno válido e remove espaços das pontas', () => {
    const r = validarAluno({ ...valido, nome: '  Maria Silva  ' });
    assert.equal(r.ok, true);
    assert.equal(r.dados.nome, 'Maria Silva');
});

test('recusa nome ausente ou só com espaços', () => {
    assert.equal(validarAluno({ ...valido, nome: undefined }).erro, 'Nome é obrigatório');
    assert.equal(validarAluno({ ...valido, nome: '   ' }).erro, 'Nome é obrigatório');
});

test('recusa e-mail ausente ou sem formato de e-mail', () => {
    assert.equal(validarAluno({ ...valido, email: undefined }).erro, 'Email é obrigatório');
    assert.equal(validarAluno({ ...valido, email: 'maria.escola.com' }).erro, 'Email inválido');
});

test('recusa nota ausente', () => {
    assert.equal(validarAluno({ ...valido, nota1: undefined }).erro, 'Nota1 é obrigatória');
    assert.equal(validarAluno({ ...valido, nota2: null }).erro, 'Nota2 é obrigatória');
});

test('recusa nota que não é número (inclusive NaN e texto)', () => {
    assert.equal(validarAluno({ ...valido, nota1: '8' }).erro, 'Notas devem ser números');
    assert.equal(validarAluno({ ...valido, nota2: NaN }).erro, 'Notas devem ser números');
});

test('recusa nota fora de 0 a 10 e aceita os limites', () => {
    assert.equal(validarAluno({ ...valido, nota1: -1 }).erro, 'Notas devem estar entre 0 e 10');
    assert.equal(validarAluno({ ...valido, nota2: 10.5 }).erro, 'Notas devem estar entre 0 e 10');
    assert.equal(validarAluno({ ...valido, nota1: 0, nota2: 10 }).ok, true);
});

test('corpo vazio ou ausente não derruba a validação', () => {
    assert.equal(validarAluno(undefined).ok, false);
    assert.equal(validarAluno({}).ok, false);
});

test('nota final é a soma e 7 já aprova', () => {
    assert.deepEqual(calcularResultado(3, 4), { notaFinal: 7, status: 'Aprovado' });
    assert.deepEqual(calcularResultado(3, 3), { notaFinal: 6, status: 'Reprovado' });
    assert.deepEqual(calcularResultado(10, 10), { notaFinal: 20, status: 'Aprovado' });
});
