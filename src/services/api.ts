import axios from 'axios';
import type { AuthResponse, User, DashboardStats, Student, StudentFormData, StudentFilters, PaginatedResponse, Payment, PaymentFormData, Teacher, TeacherFormData, Class, ClassFormData, Subject, SubjectFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string; password_confirmation: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },

  getUser: async (): Promise<User> => {
    const response = await api.get('/auth/user');
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStatistics: async (): Promise<{ data: DashboardStats }> => {
    const response = await api.get('/dashboard/statistics');
    return response.data;
  },
};

// Student API
export const studentAPI = {
  getAll: async (filters?: StudentFilters): Promise<PaginatedResponse<Student>> => {
    const response = await api.get('/students', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Student }> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: StudentFormData): Promise<{ data: Student }> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  update: async (id: string, data: StudentFormData): Promise<{ data: Student }> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/students/${id}`);
  },

  getPaymentHistory: async (id: string): Promise<{ data: { student: Student; payments: Payment[]; summary: { total_paid: number; pending_payments_count: number; pending_amount: number } } }> => {
    const response = await api.get(`/students/${id}/payments`);
    return response.data;
  },

  getClassHistory: async (id: string): Promise<{ data: { student: Student; classes: { id: string; name: string; subject_name: string; teacher_name: string }[] } }> => {
    const response = await api.get(`/students/${id}/classes`);
    return response.data;
  },
};

// Teacher API
export const teacherAPI = {
  getAll: async (filters?: { search?: string; subject_id?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Teacher>> => {
    const response = await api.get('/teachers', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Teacher }> => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: TeacherFormData): Promise<{ data: Teacher }> => {
    const response = await api.post('/teachers', data);
    return response.data;
  },

  update: async (id: string, data: TeacherFormData): Promise<{ data: Teacher }> => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/teachers/${id}`);
  },

  getStatistics: async (id: string): Promise<{ data: { teacher: Teacher; statistics: { total_classes: number; active_classes: number; total_students: number } } }> => {
    const response = await api.get(`/teachers/${id}/statistics`);
    return response.data;
  },
};

// Class API
export const classAPI = {
  getAll: async (filters?: { search?: string; subject_id?: string; teacher_id?: string; grade_level?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Class>> => {
    const response = await api.get('/classes', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Class }> => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  create: async (data: ClassFormData): Promise<{ data: Class }> => {
    const response = await api.post('/classes', data);
    return response.data;
  },

  update: async (id: string, data: ClassFormData): Promise<{ data: Class }> => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/classes/${id}`);
  },

  addStudent: async (classId: string, studentId: string): Promise<void> => {
    await api.post(`/classes/${classId}/students`, { student_id: studentId });
  },

  removeStudent: async (classId: string, studentId: string): Promise<void> => {
    await api.delete(`/classes/${classId}/students`, { data: { student_id: studentId } });
  },

  getStatistics: async (id: string): Promise<{ data: { class: Class; statistics: { total_students: number; available_slots: number; attendance_rate: number; capacity_percentage: number } } }> => {
    const response = await api.get(`/classes/${id}/statistics`);
    return response.data;
  },
};

// Utility functions for token management
export const tokenService = {
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('access_token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

// Subject API
export const subjectAPI = {
  getAll: async (filters?: { search?: string; grade_level?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Subject>> => {
    const response = await api.get('/subjects', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Subject }> => {
    const response = await api.get(`/subjects/${id}`);
    return response.data;
  },

  create: async (data: SubjectFormData): Promise<{ data: Subject }> => {
    const response = await api.post('/subjects', data);
    return response.data;
  },

  update: async (id: string, data: SubjectFormData): Promise<{ data: Subject }> => {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/subjects/${id}`);
  },

  getByGrade: async (grade: string): Promise<{ data: Subject[] }> => {
    const response = await api.get(`/subjects/grade/${grade}`);
    return response.data;
  },
};

// Payment API
export const paymentAPI = {
  getAll: async (filters?: { month?: number; year?: number; student_id?: string; subject_id?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get('/payments', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Payment }> => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  create: async (data: PaymentFormData): Promise<{ data: Payment }> => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  createBulk: async (data: { payments: PaymentFormData[] }): Promise<{ data: Payment[] }> => {
    const response = await api.post('/payments/bulk', data);
    return response.data;
  },

  update: async (id: string, data: PaymentFormData): Promise<{ data: Payment }> => {
    const response = await api.put(`/payments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/payments/${id}`);
  },

  getByStudent: async (studentId: string): Promise<{ data: { student: Student; payments: Payment[]; summary: { total_paid: number; pending_payments_count: number; pending_amount: number } } }> => {
    const response = await api.get(`/students/${studentId}/payments`);
    return response.data;
  },
};

export default api;