// backend/src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes'); // <-- Importe aqui

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', apiRoutes);
app.use('/api', authRoutes); // <-- Use aqui

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});