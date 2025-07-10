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

    // --- LÓGICA DE NOTIFICAÇÃO (ATIVA) ---
    try {
      const formattedDate = format(newAppointment.date, "dd/MM/yyyy 'às' HH:mm");
      
      // 1. Notificação para o BARBEIRO
      const barberNumber = process.env.BARBER_WHATSAPP_NUMBER;
      if (barberNumber) {
        const barberMessageBody = `*Novo Agendamento na D'Castro Barbearia!* 🔔\n\n*Cliente:* ${newAppointment.customerName}\n*WhatsApp:* ${newAppointment.customerPhone}\n*Serviço:* ${newAppointment.service.name}\n*Data:* ${formattedDate}`;
        await sendWhatsAppNotification(barberNumber, barberMessageBody);
      }

      // 2. Notificação para o CLIENTE
      const customerNumber = `whatsapp:${newAppointment.customerPhone}`;
      const clientMessageBody = `Olá, ${newAppointment.customerName}! Seu agendamento na *D'Castro Barbearia* foi confirmado com sucesso. ✅\n\n*Serviço:* ${newAppointment.service.name}\n*Data:* ${formattedDate}\n\nAté lá!`;
      await sendWhatsAppNotification(customerNumber, clientMessageBody);

    } catch (notificationError) {
      // O agendamento foi criado, mas a notificação falhou.
      // Apenas registra o erro no console do servidor para não quebrar a experiência do usuário.
      console.error('Agendamento criado, mas a notificação via WhatsApp falhou:', notificationError);
    }
    // --- FIM DA LÓGICA DE NOTIFICAÇÃO ---

    res.status(201).json(newAppointment);

  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ message: 'Erro interno ao criar agendamento.', error: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          // Busca apenas agendamentos de agora em diante para o dashboard
          gte: new Date(),
        }
      },
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
  const { id } = req.params; 

  try {
    // Primeiro, busca o agendamento para notificar o cliente do cancelamento (opcional)
    const appointmentToCancel = await prisma.appointment.findUnique({
      where: { id },
    });

    if (appointmentToCancel) {
      await prisma.appointment.delete({
        where: { id },
      });

      // Opcional: Enviar notificação de cancelamento para o cliente
      try {
        const customerNumber = `whatsapp:${appointmentToCancel.customerPhone}`;
        const messageBody = `Olá, ${appointmentToCancel.customerName}. Informamos que seu agendamento na D'Castro Barbearia foi cancelado. Para reagendar, acesse nosso site.`;
        await sendWhatsAppNotification(customerNumber, messageBody);
      } catch (notificationError) {
        console.error("Agendamento cancelado, mas notificação para o cliente falhou:", notificationError);
      }
    } else {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.status(204).send(); // Sucesso, sem conteúdo para retornar
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cancelar o agendamento.' });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  deleteAppointment,
};