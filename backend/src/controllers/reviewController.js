const { PrismaClient, ReviewStatus } = require('@prisma/client');
const prisma = new PrismaClient();

// Se quiser notificar o barbeiro sobre novas avaliações, descomente a linha abaixo
// const { sendWhatsAppNotification } = require('../services/notificationService');

// PUBLIC: Criar uma nova avaliação
const createReview = async (req, res) => {
  try {
    console.log("1. Rota POST /reviews iniciada.");
    const { customerName, rating, comment } = req.body;

    if (!customerName || !rating) {
      return res.status(400).json({ message: 'Nome e nota são obrigatórios.' });
    }
    
    console.log("2. Dados validados. Criando avaliação no banco...");
    const newReview = await prisma.review.create({
      data: {
        customerName,
        rating: parseInt(rating, 10),
        comment,
        // O status PENDING é o padrão definido no schema
      },
    });
    console.log("3. Avaliação criada com sucesso no banco.");

    // Opcional: Notificação para o barbeiro sobre a nova avaliação
    
    try {
      const barberNumber = process.env.BARBER_WHATSAPP_NUMBER;
      if (barberNumber) {
        const messageBody = `Nova avaliação recebida de ${customerName} com nota ${rating}! Acesse o painel para moderar.`;
        await sendWhatsAppNotification(barberNumber, messageBody);
      }
    } catch (notificationError) {
      console.error('Avaliação criada, mas notificação para o barbeiro falhou:', notificationError);
    }
    

    console.log("4. Enviando resposta 201 para o cliente.");
    res.status(201).json({ message: 'Obrigado pela sua avaliação! Ela será revisada em breve.', review: newReview });

  } catch (error) {
    console.error('ERRO GERAL em createReview:', error);
    res.status(500).json({ message: 'Erro interno ao salvar sua avaliação.' });
  }
};
// PUBLIC: Obter todas as avaliações APROVADAS
const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      take: 10, // <-- Limita o resultado às 10 avaliações mais recentes
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações.' });
  }
};
// ADMIN: Obter TODAS as avaliações (para moderação)
const getAllReviewsAdmin = async (req, res) => {
  const { status } = req.query;
  const whereClause = status ? { status } : {};

  try {
    const reviews = await prisma.review.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar avaliações para o admin.' });
  }
};
// ADMIN: Atualizar o status de uma avaliação (Aprovar/Rejeitar)
const updateReviewStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!Object.values(ReviewStatus).includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { id: id },
      data: { status: status },
    });
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(404).json({ message: 'Avaliação não encontrada.' });
  }
};
const getPendingReviewCount = async (req, res) => {
  try {
    const count = await prisma.review.count({
      where: { status: 'PENDING' },
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao contar avaliações.' });
  }
};

module.exports = {
  createReview,
  getApprovedReviews,
  getAllReviewsAdmin,
  updateReviewStatus,
  getPendingReviewCount,
};