import client from './client.js';

export const businessApi = {
  getConfig:              ()     => client.get('/business'),
  saveConfig:             (data) => client.put('/business', data),
  onboardingStatus:       ()     => client.get('/business/onboarding-status'),
  connectWhatsApp:        (code) => client.post('/whatsapp/connect', { code }),
  disconnectWhatsApp:     ()     => client.delete('/whatsapp/connect'),
  whatsappStatus:         ()     => client.get('/whatsapp'),
  sendWhatsAppTestMessage:(payload) => client.post('/whatsapp/test-message', payload),
  registerWhatsAppNumber: ()        => client.post('/whatsapp/register'),
  toggleBot:              (enabled) => client.patch('/subscriber/bot-toggle', { enabled }),
};
