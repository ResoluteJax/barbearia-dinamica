// backend/src/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const upload = require('../config/upload');
const { protectRoute } = require('../middlewares/authMiddleware');

// Rota pública para ver o portfólio
router.get('/portfolio', portfolioController.getAllImages);

// Rotas protegidas
router.post('/portfolio', protectRoute, upload.single('image'), portfolioController.addImage);
router.delete('/portfolio/:id', protectRoute, portfolioController.deleteImage);

module.exports = router;