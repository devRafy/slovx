import client from './client.js';

export const dashboardApi = {
  getStats:            ()      => client.get('/dashboard/stats'),
  getLeads:            (params = {}) => client.get('/dashboard/leads', { params }),
  getLeadDetail:       (phone) => client.get(`/dashboard/leads/${encodeURIComponent(phone)}`),
  getConversations:    ()      => client.get('/dashboard/conversations'),
  getConversationBy:   (phone) => client.get(`/dashboard/conversations/${encodeURIComponent(phone)}`),
  toggleTakeover:      (phone, enabled) =>
    client.patch(`/dashboard/conversations/${encodeURIComponent(phone)}/takeover`, { enabled }),
};

// Trigger a browser download for any authenticated GET endpoint. Fetches with the Bearer token,
// then constructs a temporary blob URL and clicks it. Works around <a href> not sending headers.
export const downloadExport = async (path, filename) => {
  const res = await client.get(path, { responseType: 'blob' });
  const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
