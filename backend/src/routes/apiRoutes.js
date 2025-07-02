const express = require('express');
const router = express.Router();

// Importa os controllers
const { getAllServices } = require('../controllers/serviceController');
const { getAvailability } = require('../controllers/availabilityController');

// Define as rotas
router.get('/services', getAllServices);
router.get('/availability', getAvailability);

module.exports = router;