// backend/generateHash.js
const bcrypt = require('bcryptjs');

// Defina a senha temporária que você quer usar
const temporaryPassword = 'barbeiro123';

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(temporaryPassword, salt);

console.log('Senha temporária:', temporaryPassword);
console.log('Hash para colar no banco de dados:', hash);