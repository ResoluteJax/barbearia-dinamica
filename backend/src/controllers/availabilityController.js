// backend/src/controllers/availabilityController.js
const { PrismaClient } = require('@prisma/client');
const { startOfDay, endOfDay, setHours, setMinutes, setSeconds, addMinutes, format } = require('date-fns');
const prisma = new PrismaClient();

const getAvailability = async (req, res) => {
  const { date, serviceDuration } = req.query;

  if (!date || !serviceDuration) {
    return res.status(400).json({ message: 'Data e duração do serviço são obrigatórias.' });
  }

  const searchDate = new Date(date);
  const duration = parseInt(serviceDuration, 10);

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay(searchDate),
          lte: endOfDay(searchDate),
        },
      },
      // A CORREÇÃO ESTÁ AQUI: Garantimos que os dados do serviço venham junto
      include: { 
        service: true,
      },
    });

    const busySlots = new Set();
    appointments.forEach(app => {
      const startTime = new Date(app.date);
      // Agora app.service nunca será nulo (a menos que haja dados corrompidos)
      const endTime = addMinutes(startTime, app.service.durationInMinutes);
      let currentTime = startTime;
      while (currentTime < endTime) {
        busySlots.add(currentTime.getTime());
        currentTime = addMinutes(currentTime, 1);
      }
    });

    const dayStartHour = 9;
    const dayEndHour = 18;
    const interval = 30;
    const availableTimes = [];

    for (let hour = dayStartHour; hour < dayEndHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const slotStart = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);
        const slotEnd = addMinutes(slotStart, duration);

        if (slotEnd.getHours() > dayEndHour || (slotEnd.getHours() === dayEndHour && slotEnd.getMinutes() > 0)) {
            continue;
        }

        let isSlotFree = true;
        let checkTime = new Date(slotStart);
        while (checkTime < slotEnd) {
          if (busySlots.has(checkTime.getTime())) {
            isSlotFree = false;
            break;
          }
          checkTime = addMinutes(checkTime, 1);
        }

        if (isSlotFree) {
          availableTimes.push(format(slotStart, 'HH:mm'));
        }
      }
    }

    res.status(200).json(availableTimes);
  } catch (error) {
    // Adiciona um log detalhado do erro no terminal do backend
    console.error("ERRO NO BACKEND AO CALCULAR DISPONIBILIDADE:", error);
    res.status(500).json({ message: 'Erro ao buscar disponibilidade', error: error.message });
  }
};

module.exports = { getAvailability };