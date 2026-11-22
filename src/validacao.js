/**
 * Regras de negócio do cadastro de aluno, sem Express e sem banco.
 * Ficam isoladas aqui para serem testadas com `npm test`.
 */

const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 10;
// A nota final é a SOMA das duas notas (regra da atividade). Aprovado com 7 ou mais.
const NOTA_FINAL_APROVACAO = 7;

// Validação simples de formato (não prova que o e-mail existe).
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida o corpo recebido em POST /alunos.
 * @returns {{ok: true, dados: object} | {ok: false, erro: string}}
 */
function validarAluno(corpo) {
    const { nome, email, nota1, nota2 } = corpo || {};

    if (typeof nome !== 'string' || nome.trim() === '') {
        return { ok: false, erro: 'Nome é obrigatório' };
    }
    if (typeof email !== 'string' || email.trim() === '') {
        return { ok: false, erro: 'Email é obrigatório' };
    }
    if (!EMAIL_REGEX.test(email.trim())) {
        return { ok: false, erro: 'Email inválido' };
    }
    if (nota1 === undefined || nota1 === null) {
        return { ok: false, erro: 'Nota1 é obrigatória' };
    }
    if (nota2 === undefined || nota2 === null) {
        return { ok: false, erro: 'Nota2 é obrigatória' };
    }
    // Number.isFinite recusa NaN e Infinity, que `typeof === 'number'` deixaria passar.
    if (!Number.isFinite(nota1) || !Number.isFinite(nota2)) {
        return { ok: false, erro: 'Notas devem ser números' };
    }
    // As colunas nota1/nota2 são INT: um 7.5 seria arredondado em silêncio pelo MySQL e a
    // nota final calculada aqui não bateria com a gravada. O front-end (Boletim) já exige inteiros.
    if (!Number.isInteger(nota1) || !Number.isInteger(nota2)) {
        return { ok: false, erro: 'Notas devem ser números inteiros' };
    }
    if (nota1 < NOTA_MINIMA || nota1 > NOTA_MAXIMA || nota2 < NOTA_MINIMA || nota2 > NOTA_MAXIMA) {
        return { ok: false, erro: 'Notas devem estar entre 0 e 10' };
    }

    return {
        ok: true,
        dados: { nome: nome.trim(), email: email.trim(), nota1, nota2 },
    };
}

/** Calcula a nota final (soma) e o status do aluno. */
function calcularResultado(nota1, nota2) {
    const notaFinal = nota1 + nota2;
    const status = notaFinal >= NOTA_FINAL_APROVACAO ? 'Aprovado' : 'Reprovado';
    return { notaFinal, status };
}

module.exports = { validarAluno, calcularResultado, NOTA_FINAL_APROVACAO };
