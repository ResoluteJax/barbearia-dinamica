// backend/src/controllers/productController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Criar um produto
exports.createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), imageUrl },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obter todos os produtos
exports.getAllProducts = async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
};

// Deletar um produto
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Produto não encontrado ou erro ao deletar.' });
  }
};