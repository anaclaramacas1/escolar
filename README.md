

## API de Gestão Escolar

Projeto da Parte 01 

A ideia da atividade era criar uma API bem simples pra cadastrar e listar alunos de uma escola, usando:

`Node.js, Express e MongoDB`

## O que a aplicação faz
Cadastra um aluno (nome, idade, email, curso e turma) e lista todos os alunos cadastrados.

Salva tudo no MongoDB: 
banco: gestao_escolar,
coleção: alunos


## Tecnologias usadas
Node.js
Express
MongoDB driver
dotenv 
Thunder Client 
MongoDB Compass


## Como rodar o projeto

---- Instalar as dependências: ----

`npm install`

Criar um arquivo .env na raiz do projeto com:
MONGODB_URI=mongodb://localhost:27017
DB_NAME=gestao_escolar
PORT=3000
Ter o MongoDB rodando na máquina

---- Rodar a aplicação: -----

`npm start `

Se der tudo certo, aparece no terminal:

MongoDB conectado ao banco: gestao_escolar
Servidor rodando em http://localhost:3000

## Rotas
POST /alunos

Cadastra um aluno novo. Exemplo abaixo

json
{
  "nome": "Pedro Henrique",
  "idade": 19,
  "email": "pedro.henrique@email.com",
  "curso": "Informática",
  "turma": "3INFO"
}

nome, idade, email e curso são obrigatórios.

Além desses comandos, a API adiciona sozinha:
situacao: "ativo"
dataMatricula (data e hora do cadastro)


## GET /alunos
Retorna a lista de todos os alunos cadastrados, em JSON.

## Como eu testei

Usei o Thunder Client pra fazer os testes:

- Cadastrei 6 alunos diferentes com POST /alunos
- Listei todos com GET /alunos e confirmei que os 6 apareceram
- Abri o MongoDB Compass, entrei no banco gestao_escolar, coleção alunos, e confirmei que os dados foram salvos.


`Os prints desses testes estão na pasta 'Print' `