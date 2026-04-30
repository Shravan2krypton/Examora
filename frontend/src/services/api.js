import axios from 'axios';

// Use Vite proxy for local development, /api for Vercel production
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
};

export const examAPI = {
  create: (data) => api.post('/exams/create', data),
  getAll: () => api.get('/exams'),
  getById: (id) => api.get(`/exams/${id}`),
  getForAttempt: (id) => api.get(`/exams/${id}/attempt`),
};

export const questionAPI = {
  add: (data) => api.post('/questions/add', data),
  addBulk: (data) => api.post('/questions/add-bulk', data),
  getByExam: (examId) => api.get(`/questions/${examId}`),
};

export const examAttemptAPI = {
  start: (examId) => api.post('/exam/start', { examId }),
  saveAnswer: (examId, questionId, selectedOption) =>
    api.post('/exam/save-answer', { examId, questionId, selectedOption }),
  submit: (examId, answers) => api.post('/exam/submit', { examId, answers }),
};

export const resultAPI = {
  getByStudent: (studentId) => api.get(`/results/student/${studentId || ''}`),
  getDetail: (examId) => api.get(`/results/detail/${examId}`),
  getLeaderboard: (examId) => api.get(`/results/leaderboard/${examId}`),
  getExamResults: (examId) => api.get(`/results/exam/${examId}`),
};

export const questionBankAPI = {
  upload: (formData) =>
    api.post('/questionbank/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/questionbank'),
};

export default api;
