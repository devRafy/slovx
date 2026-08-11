import client from './client.js';

export const dashboardApi = {
  getStats:      ()              => client.get('/dashboard/stats'),
  getLeads:      (params = {})   => client.get('/dashboard/leads', { params }),
  getLeadDetail: (phone)         => client.get(`/dashboard/leads/${encodeURIComponent(phone)}`),
};
