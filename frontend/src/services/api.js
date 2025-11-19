import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: (refreshToken) => api.post('/auth/logout', { refresh_token: refreshToken }),
  getCurrentUser: () => api.get('/auth/users/me'),
};

// Placeholder APIs for future backend implementation
export const profileAPI = {
  updateProfile: (profileData) => {
    // Mock implementation - replace when backend is ready
    return Promise.resolve({ data: profileData });
  },
};

export const foodLogAPI = {
  getLogs: () => {
    // Mock implementation - returns from localStorage
    const logs = JSON.parse(localStorage.getItem('food_logs') || '[]');
    return Promise.resolve({ data: logs });
  },
  createLog: (logData) => {
    const logs = JSON.parse(localStorage.getItem('food_logs') || '[]');
    const newLog = { ...logData, id: Date.now(), date: new Date().toISOString() };
    logs.unshift(newLog);
    localStorage.setItem('food_logs', JSON.stringify(logs));
    return Promise.resolve({ data: newLog });
  },
  deleteLog: (id) => {
    const logs = JSON.parse(localStorage.getItem('food_logs') || '[]');
    const filtered = logs.filter(log => log.id !== id);
    localStorage.setItem('food_logs', JSON.stringify(filtered));
    return Promise.resolve({ data: { success: true } });
  },
};

export const inventoryAPI = {
  getItems: () => {
    const items = JSON.parse(localStorage.getItem('inventory_items') || '[]');
    return Promise.resolve({ data: items });
  },
  createItem: (itemData) => {
    const items = JSON.parse(localStorage.getItem('inventory_items') || '[]');
    const newItem = { ...itemData, id: Date.now() };
    items.push(newItem);
    localStorage.setItem('inventory_items', JSON.stringify(items));
    return Promise.resolve({ data: newItem });
  },
  updateItem: (id, itemData) => {
    const items = JSON.parse(localStorage.getItem('inventory_items') || '[]');
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...itemData };
      localStorage.setItem('inventory_items', JSON.stringify(items));
    }
    return Promise.resolve({ data: items[index] });
  },
  deleteItem: (id) => {
    const items = JSON.parse(localStorage.getItem('inventory_items') || '[]');
    const filtered = items.filter(item => item.id !== id);
    localStorage.setItem('inventory_items', JSON.stringify(filtered));
    return Promise.resolve({ data: { success: true } });
  },
};

export const imageAPI = {
  uploadImage: (file) => {
    // Mock implementation - stores in localStorage as base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const images = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
        const newImage = {
          id: Date.now(),
          filename: file.name,
          data: reader.result,
          uploadedAt: new Date().toISOString(),
        };
        images.push(newImage);
        localStorage.setItem('uploaded_images', JSON.stringify(images));
        resolve({ data: newImage });
      };
      reader.readAsDataURL(file);
    });
  },
  getImages: () => {
    const images = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    return Promise.resolve({ data: images });
  },
  deleteImage: (id) => {
    const images = JSON.parse(localStorage.getItem('uploaded_images') || '[]');
    const filtered = images.filter(img => img.id !== id);
    localStorage.setItem('uploaded_images', JSON.stringify(filtered));
    return Promise.resolve({ data: { success: true } });
  },
};

export default api;
