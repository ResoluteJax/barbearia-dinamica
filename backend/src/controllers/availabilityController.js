// backend/src/controllers/availabilityController.js
const { PrismaClient } = require('@prisma/client');
const { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } = require('date-fns');
const prisma = new PrismaClient();

const getAvailability = async (req, res) => {
  // Pega a data da query string, ex: /availability?date=2025-07-03
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'A data é obrigatória.' });
  }

  const searchDate = new Date(date);

  try {
    // Busca todos os agendamentos e horários bloqueados para o dia selecionado
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay(searchDate), // Maior ou igual ao início do dia
          lte: endOfDay(searchDate),   // Menor ou igual ao fim do dia
        },
      },
    });

    const blockedTimes = await prisma.blockedTime.findMany({
      where: {
        startTime: {
          lte: endOfDay(searchDate),
        },
        endTime: {
          gte: startOfDay(searchDate),
        },
      },
    });

    // Define o horário de funcionamento da barbearia
    const dayStartHour = 9;
    const dayEndHour = 18;
    const slotInterval = 30; // Intervalo de 30 minutos

    // Gera a lista de todos os horários possíveis no dia
    const possibleTimes = [];
    for (let hour = dayStartHour; hour < dayEndHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotInterval) {
        const time = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);
        possibleTimes.push(format(time, 'HH:mm'));
      }
    }

    // Cria uma lista com todos os horários que já estão ocupados
    const unavailableTimes = new Set();
    appointments.forEach(appointment => {
      unavailableTimes.add(format(new Date(appointment.date), 'HH:mm'));
    });
    
    blockedTimes.forEach(block => {
        let currentTime = new Date(block.startTime);
        const endTime = new Date(block.endTime);

        while(currentTime < endTime) {
            unavailableTimes.add(format(currentTime, 'HH:mm'));
            currentTime.setMinutes(currentTime.getMinutes() + slotInterval);
        }
    });

    // Filtra os horários possíveis, removendo os que estão ocupados
    const availableTimes = possibleTimes.filter(time => !unavailableTimes.has(time));

    res.status(200).json(availableTimes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar disponibilidade', error: error.message });
  }
};

module.exports = {
  getAvailability,
};