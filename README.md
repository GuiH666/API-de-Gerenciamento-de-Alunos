# API de Gerenciamento de Alunos

API desenvolvida em Node.js com Express e MySQL para cadastro e gerenciamento de alunos.

## Sobre o Projeto

Projeto desenvolvido como atividade acadêmica da graduação em Análise e Desenvolvimento de Sistemas.

O objetivo foi criar uma API REST capaz de receber dados de alunos, validar informações, calcular resultados acadêmicos e armazenar os dados em banco MySQL.

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


## Estrutura da Tabela

```sql
CREATE TABLE alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100),
  nota1 INT,
  nota2 INT,
  notaFinal INT,
  status VARCHAR(20)
);
```


### POST /alunos

![POST](<p align="left">
  <img src="screenshots/post-cadastro.png" width="220">
  </p>)


### GET /alunos

![TABELA](<p align="left">
  <img src="screenshots/get-alunos-cadastrados.png" width="220">
  </p>)


## Autor

Guilherme Bomfim Ribeiro

GitHub:
https://github.com/GuiH666

LinkedIn:
https://www.linkedin.com/in/guilherme-bomfim-ribeiro-2623aa218/