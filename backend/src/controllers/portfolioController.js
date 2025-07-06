// backend/src/controllers/portfolioController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Adicionar imagem ao portfólio
exports.addImage = async (req, res) => {
  const { title } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const image = await prisma.portfolioImage.create({
      data: { title, imageUrl },
    });
    res.status(201).json(image);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todas as imagens
exports.getAllImages = async (req, res) => {
  const images = await prisma.portfolioImage.findMany();
  res.json(images);
};

// Deletar uma imagem
exports.deleteImage = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.portfolioImage.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Imagem não encontrada ou erro ao deletar.' });
  }
};