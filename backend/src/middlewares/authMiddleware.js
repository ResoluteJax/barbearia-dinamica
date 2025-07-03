// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protectRoute = (req, res, next) => {
  let token;

  // 1. Verifica se o header de autorização existe e começa com "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extrai o token do header (formato: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verifica e decodifica o token usando o segredo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Anexa o ID do usuário decodificado ao objeto da requisição
      // para que as próximas rotas possam usá-lo
      req.userId = decoded.userId;

      // 5. Libera o acesso para a próxima função (o controller)
      next();

    } catch (error) {
      // Se o token for inválido ou expirado, retorna erro
      res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
  }

  // Se não houver token no header, retorna erro
  if (!token) {
    res.status(401).json({ message: 'Acesso não autorizado, token não encontrado.' });
  }
};

module.exports = { protectRoute };