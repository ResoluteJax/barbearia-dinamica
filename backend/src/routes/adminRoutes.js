// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Importa o middleware e o controller
const { protectRoute } = require('../middlewares/authMiddleware');
const { getAllAppointments } = require('../controllers/appointmentController');

// Aplica o middleware de proteção nesta rota
// O middleware `protectRoute` será executado ANTES de `getAllAppointments`
router.get('/admin/appointments', protectRoute, getAllAppointments);

module.exports = router;