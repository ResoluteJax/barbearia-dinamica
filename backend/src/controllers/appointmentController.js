// backend/src/controllers/appointmentController.js
const { PrismaClient } = require('@prisma/client');
const { sendWhatsAppNotification } = require('../services/notificationService');
const { format } = require('date-fns');
const prisma = new PrismaClient();

const createAppointment = async (req, res) => {
  try {
    console.log("1. Rota POST /appointments iniciada.");
    const { customerName, customerPhone, serviceId, date } = req.body;

    if (!customerName || !serviceId || !date) {
      return res.status(400).json({ message: 'Dados insuficientes.' });
    }

    const appointmentDate = new Date(date);

    /* --- VALIDAÇÃO TEMPORARIAMENTE DESATIVADA PARA TESTE ---
    if (appointmentDate < new Date()) {
      return res.status(400).json({ message: 'Não é possível agendar em uma data passada.' });
    }
    */

    console.log("2. Buscando por agendamentos existentes...");
    const existingAppointment = await prisma.appointment.findFirst({
      where: { date: appointmentDate },
    });
    console.log("3. Busca por agendamentos existentes concluída.");

    if (existingAppointment) {
      console.log("4. Horário já ocupado. Retornando erro 409.");
      return res.status(409).json({ message: 'Este horário já está ocupado.' });
    }

    console.log("5. Criando novo agendamento no banco de dados...");
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
    console.log("6. Agendamento criado com sucesso no banco.");

    /* --- LÓGICA DE NOTIFICAÇÃO DESATIVADA --- */

    console.log("7. Enviando resposta 201 para o cliente.");
    res.status(201).json(newAppointment);

  } catch (error) {
    console.error('ERRO GERAL em createAppointment:', error);
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
