// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Importa o middleware e o controller
const { protectRoute } = require('../middlewares/authMiddleware');
const { getAllAppointments, deleteAppointment } = require('../controllers/appointmentController');


// Aplica o middleware de proteção nesta rota
// O middleware `protectRoute` será executado ANTES de `getAllAppointments`
router.get('/admin/appointments', protectRoute, getAllAppointments);

router.delete('/admin/appointments/:id', protectRoute, deleteAppointment);

module.exports = router;