// backend/src/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getApprovedReviews, 
  getAllReviewsAdmin, 
  updateReviewStatus 
} = require('../controllers/reviewController');
const { protectRoute } = require('../middlewares/authMiddleware');

// --- ROTAS PÚBLICAS ---
// Cliente envia uma nova avaliação
router.post('/reviews', createReview);
// Cliente vê as avaliações já aprovadas
router.get('/reviews', getApprovedReviews);


// --- ROTAS DE ADMIN (PROTEGIDAS) ---
// Barbeiro vê TODAS as avaliações para moderar
router.get('/admin/reviews', protectRoute, getAllReviewsAdmin);
// Barbeiro aprova ou rejeita uma avaliação
router.put('/admin/reviews/:id', protectRoute, updateReviewStatus);

module.exports = router;