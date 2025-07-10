# Sistema de Agendamento para Barbearia

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Aplicação web full-stack para gerenciamento de agendamentos e operações de uma barbearia.

---

## Funcionalidades Principais

- **Cliente:**
  - Agendamento passo a passo com seleção de serviço, data e hora.
  - Cálculo de disponibilidade em tempo real baseado na duração dos serviços.
  - Galeria de produtos e portfólio de cortes.
  - Envio de avaliações com nota e comentário.
  - Interface responsiva com tema claro/escuro.
- **Barbeiro (Admin):**
  - Painel administrativo protegido por login (JWT).
  - Fluxo de primeiro login com troca de senha obrigatória.
  - Mecanismo de reset de senha administrativo.
  - Gerenciamento de Produtos, Portfólio e moderação de Avaliações.
  - Visualização de agenda com opção de cancelamento.
- **Automação:**
  - Notificações via WhatsApp (Twilio) para novos agendamentos e confirmações.
  - Lembretes automáticos para clientes um dia antes do horário.
  - Limpeza diária de agendamentos passados no banco de dados (`cron job`).

---

## Tecnologias

- **Frontend:** React, Vite, SCSS, React Router, Axios, `react-leaflet`.
- **Backend:** Node.js, Express.js, Prisma (ORM), JWT, `bcryptjs`, `multer`.
- **Banco de Dados:** PostgreSQL.
- **Serviços:** Twilio API.
- **DevOps:** Vercel (Frontend), Render (Backend + DB).

---

## Execução Local

1.  **Clone:** `git clone https://github.com/ResoluteJax/barbearia-dinamica.git`
2.  **Instale as dependências:**
    - `cd backend && npm install`
    - `cd ../frontend && npm install`
3.  **Configure os arquivos `.env`** nas pastas `/backend` e `/frontend`.
4.  **Prepare o Banco de Dados (na pasta `/backend`):**
    - `npx prisma migrate dev`
    - `npx prisma db seed`
5.  **Inicie os servidores (em dois terminais):**
    - Backend: `cd backend && npm start`
    - Frontend: `cd frontend && npm run dev`
