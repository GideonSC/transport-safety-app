import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const getReports = () => api.get('/reports/me');
export const getAllReports = () => api.get('/reports');
export const markReportReviewed = (reportId) => api.patch(`/reports/${reportId}/review`);
export const submitReport = (payload) => api.post('/reports', payload);

export default api;
