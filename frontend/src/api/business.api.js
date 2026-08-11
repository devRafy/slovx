import client from './client.js';

export const businessApi = {
  getConfig:         ()     => client.get('/business'),
  saveConfig:        (data) => client.put('/business', data),
  onboardingStatus:  ()     => client.get('/business/onboarding-status'),
  connectWhatsApp:   (code) => client.post('/whatsapp/connect', { code }),
  disconnectWhatsApp:()     => client.delete('/whatsapp/connect'),
  whatsappStatus:    ()     => client.get('/whatsapp'),
};
