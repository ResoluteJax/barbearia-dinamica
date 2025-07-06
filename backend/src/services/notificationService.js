// backend/src/services/notificationService.js
const twilio = require('twilio');

// Pega as credenciais do arquivo .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Validação para garantir que o serviço não tente rodar sem as credenciais
if (!accountSid || !authToken) {
  console.error('ERRO: Credenciais da Twilio (ACCOUNT_SID e AUTH_TOKEN) não estão configuradas no arquivo .env.');
}

// Inicializa o cliente da Twilio apenas se as credenciais existirem
const client = twilio(accountSid, authToken);

/**
 * Função para enviar uma notificação de WhatsApp.
 * @param {string} to - O número de destino no formato "whatsapp:+5521999999999".
 * @param {string} body - O conteúdo da mensagem.
 */
const sendWhatsAppNotification = async (to, body) => {
  // Verifica novamente antes de tentar enviar
  if (!accountSid || !authToken) {
    console.error('Envio de WhatsApp abortado: Credenciais da Twilio não configuradas.');
    return;
  }

  try {
    const message = await client.messages.create({
      from: twilioPhoneNumber, // Número do sandbox da Twilio
      to: to,                  // Número do destinatário
      body: body,              // Mensagem a ser enviada
    });

    console.log(`Mensagem enviada com sucesso para ${to}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    // Registra o erro detalhado no console do servidor, mas não quebra a aplicação
    console.error(`Falha ao enviar WhatsApp para ${to}. Erro: ${error.message}`);
  }
};

module.exports = {
  sendWhatsAppNotification,
};