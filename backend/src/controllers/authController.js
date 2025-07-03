// backend/src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Busca o usuário pelo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Email não encontrado
    }

    console.log('DADOS DO USUÁRIO DO BANCO:', user);

    // 2. Compara a senha enviada com a senha hasheada no banco
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // Senha incorreta
    }

    // 3. Gera o Token JWT
    const token = jwt.sign(
      { userId: user.id },      // O que será armazenado no token (payload)
      process.env.JWT_SECRET,   // O segredo para assinar o token
      { expiresIn: '8h' }       // Duração do token
    );

    // 4. Responde com o token
    res.status(200).json({ token });

} catch (error) {
  console.error('ERRO NO LOGIN:', error);
  res.status(500).json({ message: 'Erro interno no servidor.' });
}
};

module.exports = { login };