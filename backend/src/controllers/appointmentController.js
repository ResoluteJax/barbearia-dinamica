const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função existente para criar agendamento
const createAppointment = async (req, res) => {
  try {
    const { customerName, customerPhone, serviceId, date } = req.body;

    if (!customerName || !serviceId || !date) {
      return res.status(400).json({ message: 'Dados insuficientes para o agendamento.' });
    }

    const appointmentDate = new Date(date);

    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: 'Não é possível agendar em uma data passada.' });
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: { date: appointmentDate },
    });

    if (existingAppointment) {
      return res.status(409).json({ message: 'Este horário já está ocupado.' });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        customerName,
        customerPhone,
        date: appointmentDate,
        serviceId,
      },
    });

    res.status(201).json(newAppointment);

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno ao criar agendamento.', error: error.message });
  }
};

// Nova função para buscar todos os agendamentos (deve estar ANTES do module.exports)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        date: 'asc',
      },
      include: {
        service: true,
      },
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar todos os agendamentos.' });
  }
};

// Exporta AMBAS as funções
module.exports = {
  createAppointment,
  getAllAppointments,
};