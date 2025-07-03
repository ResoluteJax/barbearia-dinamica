// backend/src/routes/apiRoutes.js
const express = require('express');
const router = express.Router();

// Importa os controllers
const { getAllServices } = require('../controllers/serviceController');
const { getAvailability } = require('../controllers/availabilityController');
const { createAppointment } = require('../controllers/appointmentController'); // <-- Importe aqui

// Define as rotas
router.get('/services', getAllServices);
router.get('/availability', getAvailability);
router.post('/appointments', createAppointment); 

module.exports = router;