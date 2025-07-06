// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../config/upload');
const { protectRoute } = require('../middlewares/authMiddleware');

// Rota pública para ver os produtos
router.get('/products', productController.getAllProducts);

// Rotas protegidas para gerenciar produtos
router.post('/products', protectRoute, upload.single('image'), productController.createProduct);
router.delete('/products/:id', protectRoute, productController.deleteProduct);

module.exports = router;