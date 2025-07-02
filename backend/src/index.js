// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');

const app = express();

// Middlewares
app.use(cors()); // Permite que o front-end acesse a API
app.use(express.json()); // Permite que a API entenda requisições com corpo em JSON

// Rota principal da API
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});