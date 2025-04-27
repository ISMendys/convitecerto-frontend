const axios = require("axios");

// Ler variáveis de ambiente
const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

// Verificar se as variáveis de ambiente estão configuradas
if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
  console.warn("Aviso: Variáveis de ambiente EVOLUTION_API_URL ou EVOLUTION_API_KEY não configuradas. A integração com WhatsApp pode não funcionar.");
}

// Instância Axios para Evolution API
const evolutionApi = axios.create({
  baseURL: EVOLUTION_API_URL,
  headers: {
    "apikey": EVOLUTION_API_KEY,
    "Content-Type": "application/json",
  },
});

/**
 * Envia uma mensagem de texto simples via Evolution API.
 * @param {string} instanceName - Nome da instância na Evolution API.
 * @param {string} number - Número do destinatário (formato internacional, ex: 5511999998888).
 * @param {string} text - Conteúdo da mensagem.
 * @returns {Promise<object>} - Resposta da API Evolution.
 * @throws {Error} - Se ocorrer um erro na comunicação com a API.
 */
const sendTextMessage = async (instanceName, number, text) => {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
    throw new Error("Configuração da Evolution API incompleta.");
  }

  try {
    const response = await evolutionApi.post(`/message/sendText/${instanceName}`, {
      number,
      options: {
        delay: 1200, // Pequeno delay para simular digitação
        presence: "composing",
      },
      textMessage: {
        text,
      },
    });
    console.log("Mensagem enviada via Evolution API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar mensagem via Evolution API:", error.response?.data || error.message);
    // Tentar extrair uma mensagem de erro mais útil
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Erro desconhecido ao enviar mensagem.";
    throw new Error(`Erro Evolution API: ${errorMessage}`);
  }
};

/**
 * Configura o webhook global ou por instância na Evolution API.
 * @param {string} instanceName - Nome da instância na Evolution API.
 * @param {string} webhookUrl - URL do endpoint no backend que receberá os webhooks.
 * @returns {Promise<object>} - Resposta da API Evolution.
 * @throws {Error} - Se ocorrer um erro na comunicação com a API.
 */
const configureWebhook = async (instanceName, webhookUrl) => {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
    throw new Error("Configuração da Evolution API incompleta.");
  }

  try {
    const response = await evolutionApi.post(`/webhook/set/${instanceName}`, {
      url: webhookUrl,
      webhook_by_events: false, // Receber todos os eventos em uma única URL
      // Se precisar de eventos específicos, ajuste webhook_by_events para true e defina os eventos:
      // events: ["messages.upsert", "connection.update", "qrcode.updated"]
    });
    console.log("Webhook configurado na Evolution API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao configurar webhook na Evolution API:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || "Erro desconhecido ao configurar webhook.";
    throw new Error(`Erro Evolution API: ${errorMessage}`);
  }
};

// (Opcional) Função para verificar o status da instância
const getInstanceStatus = async (instanceName) => {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
    // Não lançar erro aqui, apenas avisar ou retornar status desconhecido
    console.warn("Configuração da Evolution API incompleta para verificar status.");
    return { status: "unknown" };
  }
  try {
    const response = await evolutionApi.get(`/instance/connectionState/${instanceName}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar status da instância na Evolution API:", error.response?.data || error.message);
    return { status: "error", message: error.message };
  }
};

module.exports = {
  sendTextMessage,
  configureWebhook,
  getInstanceStatus,
};
