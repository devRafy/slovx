import client from './client.js';

export const authApi = {
  register:        (data)              => client.post('/auth/register', data),
  login:           (data)              => client.post('/auth/login', data),
  googleLogin:     (idToken)           => client.post('/auth/google', { idToken }),
  forgotPassword:  (email)             => client.post('/auth/forgot-password', { email }),
  resetPassword:   (token, password)   => client.post('/auth/reset-password', { token, password }),
  logout:          (refreshToken)      => client.post('/auth/logout', { refreshToken }),
  me:              ()                  => client.get('/auth/me'),
};
