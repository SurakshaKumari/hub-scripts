import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
  withCredentials: true,
});

// Script APIs
export const scriptAPI = {
  getAll: (params?: Record<string, string | number | boolean>) => api.get('/scripts', { params }),
  getFeatured: () => api.get('/scripts/featured'),
  getTrending: () => api.get('/scripts/trending'),
  getById: (id: string) => api.get(`/scripts/${id}`),
  create: (data: Record<string, unknown>) => api.post('/scripts', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/scripts/${id}`, data),
  delete: (id: string) => api.delete(`/scripts/${id}`),
  getMyScripts: () => api.get('/scripts/my-scripts'),
};

// Auth APIs
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

// Comment APIs
export const commentAPI = {
  getAll: (scriptId: string) => api.get(`/scripts/${scriptId}/comments`),
  add: (scriptId: string, content: string) => api.post(`/scripts/${scriptId}/comments`, { content }),
  delete: (scriptId: string, commentId: string) => api.delete(`/scripts/${scriptId}/comments/${commentId}`),
};

// Vote APIs
export const voteAPI = {
  vote: (scriptId: string, type: 'UP' | 'DOWN') => api.post(`/scripts/${scriptId}/vote`, { type }),
};

// Favorite APIs
export const favoriteAPI = {
  getAll: () => api.get('/favorites'),
  toggle: (scriptId: string) => api.post(`/favorites/${scriptId}`),
};

// Executor APIs
export const executorAPI = {
  getAll: () => api.get('/executors'),
  getById: (id: string) => api.get(`/executors/${id}`),
};

// User APIs
export const userAPI = {
  getProfile: (username: string) => api.get(`/users/${username}`),
  updateAvatar: (avatar: string) => api.put('/users/profile', { avatar }),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationsRead: () => api.put('/users/notifications/read'),
};

// Admin APIs
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getScripts: (params?: Record<string, string | number>) => api.get('/admin/scripts', { params }),
  approveScript: (id: string) => api.put(`/admin/scripts/${id}/approve`),
  rejectScript: (id: string, reason?: string) => api.put(`/admin/scripts/${id}/reject`, { reason }),
  toggleVerified: (id: string) => api.put(`/admin/scripts/${id}/verify`),
  toggleBumped: (id: string) => api.put(`/admin/scripts/${id}/bump`),
  getUsers: () => api.get('/admin/users'),
  toggleBan: (id: string) => api.put(`/admin/users/${id}/ban`),
  updateRole: (id: string, role: string) => api.put(`/admin/users/${id}/role`, { role }),
};

export default api;
