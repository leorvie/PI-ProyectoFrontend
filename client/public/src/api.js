// API Service para comunicación con el backend

// Detectar si estamos en producción o desarrollo
const isProduction = import.meta.env.MODE === "production";

// Selección automática de la URL base según el entorno
const API_BASE_URL = isProduction
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL_LOCAL;

const ApiService = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include', // Incluir cookies para autenticación, queda fijo y no se sobreescribe
    };

    console.log('API Request:', url, config); // Debug log

    try {
      const response = await fetch(url, config);
      
      console.log('API Response status:', response.status); // Debug log
      
      // Manejar diferentes tipos de respuesta
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('API Response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || data || `HTTP Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Métodos de autenticación
  async register(userData) {
    const requestData = {
      name: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      password: userData.password,
      age: userData.age || 18
    };
    
    return await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  async login(credentials) {
    return await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout error:', error);
    }
  },

  async forgotPassword(email) {
  return await this.request('/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
},

async resetPassword(token, newPassword) {
  return await this.request(`/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ password: newPassword }),
  });
},

  async verifyToken() {
    return await this.request('/verify');
  },

  async getProfile() {
    return await this.request('/profile');
  },

  // Recuperación de contraseña
  async forgotPassword(email) {
    return await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token, password) {
    return await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },

  // Métodos de tareas
  async getTasks() {
    return await this.request('/tasks');
  },

  async createTask(taskData) {
    return await this.request('/tasks/new', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  async getTask(id) {
    return await this.request(`/tasks/${id}`);
  }
};

export default ApiService;
