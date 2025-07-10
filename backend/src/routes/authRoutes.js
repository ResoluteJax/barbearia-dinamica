// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, changePassword, requestPasswordReset, resetPasswordWithToken } = require('../controllers/authController');
const { protectRoute } = require('../middlewares/authMiddleware');

router.post('/auth/login', login);
router.put('/auth/change-password', protectRoute, changePassword);

// Novas rotas para o fluxo "Esqueci Minha Senha"
router.post('/auth/request-password-reset', requestPasswordReset);
router.post('/auth/reset-password-with-token', resetPasswordWithToken);

module.exports = router;