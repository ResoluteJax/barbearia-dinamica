// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Importa o middleware e o controller
const { protectRoute } = require('../middlewares/authMiddleware');
const { getAllAppointments, deleteAppointment } = require('../controllers/appointmentController');
const { getPendingReviewCount } = require('../controllers/reviewController');


router.get('/admin/appointments', protectRoute, getAllAppointments);
router.delete('/admin/appointments/:id', protectRoute, deleteAppointment);

router.get('/admin/reviews/pending-count', protectRoute, getPendingReviewCount);
module.exports = router;