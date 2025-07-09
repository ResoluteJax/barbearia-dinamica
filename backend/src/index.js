// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { sendWhatsAppNotification } = require('./services/notificationService');
const { format, startOfTomorrow, endOfTomorrow } = require('date-fns');

// Importação de todas as rotas
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

// Registro de todas as rotas
app.use('/api', apiRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', productRoutes);
app.use('/api', portfolioRoutes); 
app.use('/api', reviewRoutes);

// --- TAREFAS AGENDADAS (CRON JOBS) ---

// 1. TAREFA: Enviar lembretes de agendamento todo dia às 9h da manhã.
cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Executando tarefa agendada: Enviando lembretes de agendamento...');
  const tomorrowStart = startOfTomorrow();
  const tomorrowEnd = endOfTomorrow();
  try {
    const appointments = await prisma.appointment.findMany({
      where: { date: { gte: tomorrowStart, lte: tomorrowEnd } },
    });
    console.log(`Encontrados ${appointments.length} agendamentos para amanhã.`);
    for (const app of appointments) {
      try {
        const customerNumber = `whatsapp:${app.customerPhone}`;
        const formattedDate = format(app.date, "HH:mm");
        const messageBody = `Olá, ${app.customerName}! Passando para lembrar do seu horário amanhã na *D'Castro Barbearia* às *${formattedDate}*. Até lá!`;
        await sendWhatsAppNotification(customerNumber, messageBody);
      } catch (error) {
        console.error(`Falha ao enviar lembrete para ${app.customerName}:`, error);
      }
    }
  } catch (error) {
    console.error('Erro ao buscar agendamentos para lembretes:', error);
  }
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

// 2. TAREFA: Limpar agendamentos passados todo dia, 5 minutos após a meia-noite.
cron.schedule('* * * * *', async () => {
  console.log('🧹 Executando tarefa agendada: Limpando agendamentos passados...');
  const now = new Date();
  try {
    const result = await prisma.appointment.deleteMany({
      where: { date: { lt: now } }, // lt = less than (menor que)
    });
    if (result.count > 0) {
      console.log(`Limpeza concluída. ${result.count} agendamentos passados foram deletados.`);
    } else {
      console.log('Nenhum agendamento passado para limpar.');
    }
  } catch (error) {
    console.error('Erro ao executar a limpeza de agendamentos:', error);
  }
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

// --- FIM DAS TAREFAS AGENDADAS ---

// ... (depois do último app.use('/api', ...))

// ROTA DE TESTE DE BANCO DE DADOS
app.get('/api/db-test', async (req, res) => {
  console.log('Iniciando teste de conexão com o banco...');
  try {
    // Tenta fazer a query mais simples possível: contar os usuários.
    const userCount = await prisma.user.count(); 
    console.log(`Teste bem-sucedido. Contagem de usuários: ${userCount}`);
    res.status(200).json({ status: 'OK', users: userCount });
  } catch (error) {
    console.error('ERRO NO TESTE DE CONEXÃO COM O BANCO:', error);
    res.status(500).json({ status: 'Erro na conexão', error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});