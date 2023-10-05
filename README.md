# Sistema de Gerenciamento de Livros - Biblioteca Escolar de Mossoró

Bem-vindo ao Sistema de Gerenciamento de Livros, desenvolvido como parte do projeto de extensão NERDS do IFRN para uma escola da cidade Mossoró - RN.

## Tecnologias Utilizadas

### Backend

- Express.js: Framework web para Node.js que facilita a criação de APIs.
- TypeScript: Superset do JavaScript que oferece recursos de tipagem estática.
- Bcrypt: Biblioteca para hashing de senhas e segurança de autenticação.
- JsonWebToken (JWT): Para autenticação baseada em tokens.
- MongoDB: Banco de dados NoSQL para armazenamento de dados.
- Mongoose: Biblioteca JavaScript que simplifica a interação com o MongoDB.

### Frontend

- HTML: Linguagem de marcação para estruturar a interface do usuário.
- CSS: Folhas de estilo para estilização da interface.
- JavaScript: Linguagem de programação para interatividade do usuário.

## Funcionalidades

- Cadastro e autenticação de usuários (bibliotecários, administrador, usuário).
- Adição, edição e exclusão de livros no acervo.
- Pesquisa de livros por título, autor, categoria, etc.
- Registro de empréstimos e devoluções de livros.
- Controle de prazos de empréstimo.

## Pré-Requisitos

- Node.js: [Instalação](https://nodejs.org/)
- npm (Node Package Manager): Normalmente é instalado junto com o Node.js
- Banco de dados: MongoDB (com Mongoose)

## Instalação

1. Clone o repositório: `git clone https://github.com/sabiss/bibliotecaNERDS.git`
2. Navegue até a pasta do projeto: `cd seu-projeto`
3. Instale as dependências do backend: `npm install`

## Configuração

1. Configure as variáveis de ambiente no arquivo `.env`:

   - `PORT`: Porta em que o servidor Express irá rodar.
   - `db_user`: nome de usuário do banco de dados MongoDB.
   - `db_senha`: senha para conexão com o banco
   - `APP_SECRET`: Segredo para a geração de tokens JWT.

   Exemplo de arquivo `.env`:

## Autores

- Sabrina Bezerra da Silva (@sabiss)
- Marcal José de Oliveira Morais II (mentor)

## Licença

Este projeto está sob a licença [MIT License](LICENSE).
