const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { userId: user.id, mustChangePassword: user.mustChangePassword },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({ token, mustChangePassword: user.mustChangePassword });

  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

const changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.userId;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'A nova senha precisa ter pelo menos 6 caracteres.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });
    res.status(200).json({ message: 'Senha alterada com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao alterar a senha.' });
  }
};

// Valida o código de reset e gera um token temporário
const requestPasswordReset = async (req, res) => {
  const { email, masterCode } = req.body;

  if (masterCode !== process.env.PASSWORD_RESET_CODE) {
    return res.status(401).json({ message: 'Código de reset inválido.' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Gera um token de curta duração (5 minutos) apenas para o reset
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '5m' });
    res.status(200).json({ resetToken });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};

// Reseta a senha usando o token temporário
const resetPasswordWithToken = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Token e uma nova senha válida (mínimo 6 caracteres) são necessários.' });
  }

  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    res.status(401).json({ message: 'Link de reset inválido ou expirado.' });
  }
};

module.exports = { 
  login, 
  changePassword, 
  requestPasswordReset, 
  resetPasswordWithToken 
};