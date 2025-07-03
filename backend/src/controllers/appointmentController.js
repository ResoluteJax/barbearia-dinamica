// backend/src/controllers/appointmentController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAppointment = async (req, res) => {
  try {
    const { customerName, customerPhone, serviceId, date } = req.body;

    // 1. Validação básica dos dados recebidos
    if (!customerName || !serviceId || !date) {
      return res.status(400).json({ message: 'Dados insuficientes para o agendamento.' });
    }

    const appointmentDate = new Date(date);

    // 2. Validação da Lógica de Negócio
    // Verifica se a data do agendamento não é no passado
    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: 'Não é possível agendar em uma data passada.' });
    }

    // Verifica se o horário já não está ocupado
    const existingAppointment = await prisma.appointment.findFirst({
      where: { date: appointmentDate },
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Este horário já está ocupado.' });
    }

    // 3. Criação do Agendamento no Banco
    const newAppointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        date: appointmentDate,
        serviceId, // Conecta o agendamento ao serviço escolhido
      },
    });

    // 4. Resposta de Sucesso
    res.status(201).json(newAppointment);

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno ao criar agendamento.', error: error.message });
  }
};

module.exports = {
  createAppointment,
};