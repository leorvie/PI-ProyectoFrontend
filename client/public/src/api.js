/**
 * @fileoverview Servicio de API principal con detección de entorno
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

// Detectar si estamos en producción o desarrollo
const isProduction = import.meta.env.MODE === "production";

/**
 * URL base de la API que se adapta automáticamente al entorno
 * @type {string}
 */
const API_BASE_URL = isProduction
  ? import.meta.env.VITE_API_URL_PROD
  : import.meta.env.VITE_API_URL_LOCAL;

/**
 * Servicio de API principal con detección automática de entorno
 * Versión alternativa del ApiService con configuración de producción/desarrollo
 * @namespace ApiService
 */
const ApiService = {
  /**
   * Realizar petición HTTP a la API
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} [options={}] - Opciones de la petición fetch
   * @returns {Promise<Object>} Respuesta de la API
   * @async
   */
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

  /**
   * Registrar nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @param {string} userData.firstName - Nombre del usuario
   * @param {string} userData.lastName - Apellido del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @param {number} [userData.age=18] - Edad del usuario
   * @returns {Promise<Object>} Respuesta del registro
   * @async
   */
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

  /**
   * Iniciar sesión de usuario
   * @param {Object} credentials - Credenciales de acceso
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del login
   * @async
   */
  async login(credentials) {
    return await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Cerrar sesión de usuario
   * @async
   */
  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout error:', error);
    }
  },

  /**
   * Solicitar restablecimiento de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} Respuesta de la solicitud
   * @async
   */
  async forgotPassword(email) {
    return await this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Restablecer contraseña con token
   * @param {string} token - Token de restablecimiento
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Respuesta del restablecimiento
   * @async
   */
  async resetPassword(token, newPassword) {
    return await this.request(`/reset-password?token=${token}`, {
      method: 'POST',
      body: JSON.stringify({ password: newPassword }),
    });
  },
  /**
   * Verificar validez del token de autenticación
   * @returns {Promise<Object>} Respuesta de verificación
   * @async
   */
  async verifyToken() {
    return await this.request('/verify');
  },

  /**
   * Obtener perfil del usuario autenticado
   * @returns {Promise<Object>} Datos del perfil
   * @async
   */
  async getProfile() {
    return await this.request('/profile');
  },

  /**
   * Actualizar perfil del usuario
   * @param {Object} profileData - Datos del perfil a actualizar
   * @param {string} profileData.name - Nombre del usuario
   * @param {string} profileData.lastname - Apellido del usuario
   * @param {string} profileData.email - Email del usuario
   * @param {number} profileData.age - Edad del usuario
   * @returns {Promise<Object>} Perfil actualizado
   * @async
   */
  async updateProfile(profileData) {
    return await this.request('/profile/edit', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Obtener todas las tareas del usuario
   * @returns {Promise<Array>} Lista de tareas
   * @async
   */
  async getTasks() {
    return await this.request('/tasks');
  },

  /**
   * Crear nueva tarea
   * @param {Object} taskData - Datos de la tarea a crear
   * @param {string} taskData.title - Título de la tarea
   * @param {string} [taskData.details] - Descripción de la tarea
   * @param {string} taskData.status - Estado de la tarea
   * @param {string} [taskData.date] - Fecha límite de la tarea
   * @returns {Promise<Object>} Tarea creada
   * @async
   */
  async createTask(taskData) {
    return await this.request('/tasks/new', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Obtener una tarea específica por ID
   * @param {string} id - ID de la tarea
   * @returns {Promise<Object>} Datos de la tarea
   * @async
   */
  async getTask(id) {
    return await this.request(`/tasks/${id}`);
  },

  /**
   * Actualizar una tarea existente
   * @param {string} taskId - ID de la tarea a actualizar
   * @param {Object} taskData - Datos de la tarea a actualizar
   * @param {string} [taskData.title] - Título de la tarea
   * @param {string} [taskData.details] - Descripción de la tarea
   * @param {string} [taskData.status] - Estado de la tarea
   * @param {string} [taskData.date] - Fecha límite de la tarea
   * @returns {Promise<Object>} Tarea actualizada
   * @async
   */
  async updateTask(taskId, taskData) {
    return await this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Eliminar una tarea
   * @param {string} taskId - ID de la tarea a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   * @async
   */
  async deleteTask(taskId) {
    return await this.request(`/tasks/${taskId}`, {
      method: 'DELETE'
    });
  },

  /**
   * Eliminar cuenta de usuario
   * @param {string} userId - ID del usuario a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   * @async
   */
  async deleteUser(userId) {
    return await this.request(`/user/${userId}`, {
      method: 'DELETE'
    });
  }
};

// Hacer ApiService disponible globalmente
window.ApiService = ApiService;
