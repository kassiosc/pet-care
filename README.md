# 🐾 Pet Care

Sistema de agendamento de banho e tosa para pets. O projeto tem duas partes: um **front-end** em HTML, CSS e JavaScript puro, e uma **API REST** em Node.js + Express.

> Projeto de estudo desenvolvido no curso (UC13). O front-end hoje funciona sozinho, guardando os dados no navegador; a API roda separada. Integrar os dois está no [roadmap](#roadmap).

## Funcionalidades

**Front-end**
- Cadastro e login de clientes, com validação de formulário
- Páginas protegidas: quem não está logado volta para o login
- Cadastro, listagem e exclusão de pets, separados por usuário
- Agendamento de serviços para cada pet, com opção de cancelar
- Tema claro/escuro, lembrado entre as visitas
- Layout responsivo

**API**
- CRUD de usuários, pets e agendamentos
- Login por e-mail e senha, com senha protegida por hash (`bcryptjs`)
- Validação de entrada e códigos HTTP corretos (`200`, `201`, `400`, `401`, `404`)
- Regra de negócio: só é possível agendar para um pet que pertence ao usuário

## Tecnologias

HTML5 · CSS3 · JavaScript · Web Storage (`localStorage` e `sessionStorage`) · Node.js · Express · bcryptjs · CORS

## Como rodar

### Front-end
Abra `frontend/index.html` no navegador, ou use a extensão **Live Server** do VS Code.

### API
```bash
cd api
npm install
npm start
```
A API sobe em `http://localhost:3300`. Para testar as rotas, use o arquivo `api/requests.http` com a extensão **REST Client** do VS Code.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | `/users` | Cadastra usuário |
| GET | `/users` · `/users/:id` | Lista / consulta usuários |
| PUT | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Remove usuário |
| POST | `/login` | Autentica com e-mail e senha |
| POST | `/pets` | Cadastra pet |
| GET | `/pets` · `/pets/:id` | Lista / consulta pets |
| GET | `/user/:userid/pets` | Pets de um usuário |
| PUT · DELETE | `/pets/:id` | Atualiza / remove pet |
| POST | `/agendamento` | Cria agendamento |
| GET | `/agendamento` · `/agendamento/:id` | Lista / consulta agendamentos |
| GET | `/user/:userid/agendamento` | Agendamentos de um usuário |
| PUT · DELETE | `/agendamento/:id` | Atualiza / remove agendamento |

## Estrutura

```text
pet-care/
├── frontend/        # páginas, estilos e app.js
└── api/             # server.js, package.json e requests.http
```

## Limitações conhecidas

- Os dados da API ficam **em memória** e somem ao reiniciar o servidor.
- No front-end, as senhas ficam no `localStorage` **sem criptografia**. Isso serve só para estudo e não deve ser usado em produção.

## Roadmap

- [ ] Fazer o front-end consumir a API com `fetch`, no lugar do `localStorage`
- [ ] Persistir os dados em um banco (SQLite ou MySQL)
- [ ] Autenticação com token (JWT)
- [ ] Impedir agendamentos em datas passadas e em horários já ocupados
