// backend/src/controllers/serviceController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Função para buscar todos os serviços
const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar serviços', error: error.message });
  }
};

module.exports = {
  getAllServices,
};