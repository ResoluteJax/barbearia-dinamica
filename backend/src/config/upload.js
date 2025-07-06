// backend/src/config/upload.js
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o diretório onde as imagens serão salvas
    cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Cria um nome de arquivo único para evitar conflitos
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);
      const fileName = `${hash.toString('hex')}-${file.originalname}`;
      cb(null, fileName);
    });
  },
});

const upload = multer({ storage: storage });

module.exports = upload;