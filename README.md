# API GrowTweeter

API REST desenvolvida com Node.js, TypeScript, Express, Prisma ORM e PostgreSQL.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- Bcrypt
- Swagger/OpenAPI
- Render

---

## Deploy

API Online:

https://api-growtweeter-edicodewes3.onrender.com

Swagger:

https://api-growtweeter-edicodewes3.onrender.com/docs

---

## Funcionalidades

### Usuários
- Criar usuário
- Listar usuários
- Atualizar usuário
- Excluir usuário

### Autenticação
- Login com username/email e senha
- Geração de JWT

### Tweets
- Criar tweet
- Listar tweets
- Feed paginado

### Curtidas
- Curtir tweet
- Remover curtida

### Respostas
- Responder tweets
- Listar respostas

### Seguidores
- Seguir usuários
- Deixar de seguir usuários
- Listar seguidores
- Listar seguindo

---

## Usuários para Teste

### Ana Costa
Usuário: anacosta

Senha: Ana12345

### Pedro Henrique
Usuário: pedro

Senha: Pedro123
---

## Endpoints Principais

| Método | Endpoint |
|----------|----------|
| POST | /auth/signin |
| GET | /user |
| POST | /user |
| POST | /tweet |
| GET | /feed |
| POST | /like |
| POST | /reply |
| POST | /follower |

---

## Executando Localmente

Instalar dependências:

```bash
npm install
```

Configurar arquivo `.env`:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
BCRYPT_SALT=
PORT=3000
```

Executar migrações:

```bash
npx prisma migrate deploy
```

Gerar cliente Prisma:

```bash
npx prisma generate
```

Iniciar servidor:

```bash
npm run dev
```

---

## Autor

Édico Luiz Dewes

Projeto desenvolvido para o desafio Growdev - GrowTweeter.