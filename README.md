# API de Gerenciamento de Alunos

API desenvolvida em Node.js com Express e MySQL para cadastro e gerenciamento de alunos.

## Tecnologias

- Node.js
- Express.js
- MySQL
- Postman

## Funcionalidades

- Cadastro de alunos
- Validação de dados
- Cálculo de nota final
- Definição de status (Aprovado/Reprovado)
- Listagem de alunos
- Busca por ID
- Atualização de dados
- Exclusão de registros

## Rotas

### POST /alunos

Cadastrar aluno

Exemplo:

```json
{
  "nome": "João",
  "email": "joao@email.com",
  "nota1": 5,
  "nota2": 3
}