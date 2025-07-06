// backend/src/controllers/appointmentController.js
const { PrismaClient } = require('@prisma/client');
const { sendWhatsAppNotification } = require('../services/notificationService');
const { format } = require('date-fns');
const prisma = new PrismaClient();

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
      include: {
        service: true,
      },
    });

    // Lógica de Notificação
    try {
      const barberNumber = process.env.BARBER_WHATSAPP_NUMBER;
      const formattedDate = format(newAppointment.date, "dd/MM/yyyy 'às' HH:mm");
      const messageBody = `*Novo Agendamento na D'Castro Barbearia!* 🔔\n\n*Cliente:* ${newAppointment.customerName}\n*Serviço:* ${newAppointment.service.name}\n*Data:* ${formattedDate}`;

      if (barberNumber) { // Envia apenas se o número do barbeiro estiver configurado
        await sendWhatsAppNotification(barberNumber, messageBody);
      }
    } catch (notificationError) {
      console.error('Agendamento criado, mas a notificação falhou:', notificationError);
    }

    res.status(201).json(newAppointment);

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno ao criar agendamento.', error: error.message });
  }
};

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

const deleteAppointment = async (req, res) => {
  // O ID do usuário vem do middleware de proteção, garantindo que só o admin pode deletar
  const { id } = req.params; 

  try {
    await prisma.appointment.delete({
      where: { id },
    });
    res.status(204).send(); // Sucesso, sem conteúdo para retornar
  } catch (error) {
    res.status(404).json({ message: 'Agendamento não encontrado.' });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
};
