/**
 * @fileoverview Servicio de API para comunicación con el backend
 * @author Equipo de Desarrollo  
 * @version 1.0.0
 */

/** URL base de la API del backend */
const API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Servicio principal para todas las comunicaciones con la API del backend
 * Maneja autenticación, perfil de usuario, tareas y otras operaciones
 * @namespace ApiService
 */
const ApiService = {
  /**
   * Método genérico para realizar peticiones HTTP a la API
   * @async
   * @param {string} endpoint - Endpoint de la API (ej: '/login', '/tasks')
   * @param {Object} [options={}] - Opciones de configuración para fetch
   * @param {Object} [options.headers] - Headers HTTP adicionales
   * @param {string} [options.method] - Método HTTP (GET, POST, PUT, DELETE)
   * @param {string} [options.body] - Cuerpo de la petición (JSON string)
   * @returns {Promise<*>} Respuesta de la API parseada
   * @throws {Error} Error con mensaje descriptivo si la petición falla
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Incluir cookies
      ...options,
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
   * Registrar un nuevo usuario en el sistema
   * @async
   * @param {Object} userData - Datos del usuario para registro
   * @param {string} userData.firstName - Nombre del usuario
   * @param {string} userData.lastName - Apellido del usuario  
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @param {number} [userData.age] - Edad del usuario
   * @returns {Promise<Object>} Respuesta del servidor con datos del usuario registrado
   * @throws {Error} Error si el registro falla
   */
  async register(userData) {
    const requestData = {
      name: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      password: userData.password,
      age: parseInt(userData.age) || 18
    };
    
    return await this.request('/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  /**
   * Iniciar sesión con credenciales de usuario
   * @async
   * @param {Object} credentials - Credenciales de acceso
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del servidor con token y datos del usuario
   * @throws {Error} Error si las credenciales son incorrectas
   */
  async login(credentials) {
    return await this.request('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Cerrar sesión del usuario actual
   * Limpia cookies de autenticación tanto en servidor como cliente
   * @async
   */
  async logout() {
    try {
      await this.request('/logout', { method: 'POST' });
    } catch (error) {
      console.log('Logout error:', error);
    }
    
    // Siempre limpiar la cookie local independientemente del resultado del servidor
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },

  /**
   * Verificar si el token de autenticación actual es válido
   * @async
   * @returns {Promise<Object>} Datos del usuario si el token es válido
   * @throws {Error} Error si el token es inválido o ha expirado
   */
  async verifyToken() {
    console.log('ApiService.verifyToken() llamado');
    const result = await this.request('/verify');
    console.log('Resultado de /verify:', result);
    return result;
  },

  /**
   * Obtener perfil del usuario autenticado
   * @async
   * @returns {Promise<Object>} Datos del perfil del usuario
   * @throws {Error} Error si no está autenticado o falla la petición
   */
  async getProfile() {
    return await this.request('/profile');
  },

  /**
   * Actualizar perfil del usuario autenticado
   * @async
   * @param {Object} profileData - Nuevos datos del perfil
   * @param {string} [profileData.name] - Nuevo nombre
   * @param {string} [profileData.lastname] - Nuevo apellido
   * @param {string} [profileData.email] - Nuevo email
   * @param {number} [profileData.age] - Nueva edad
   * @returns {Promise<Object>} Perfil actualizado
   * @throws {Error} Error si falla la actualización
   */
  async updateProfile(profileData) {
    return await this.request('/profile/edit', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  /**
   * Obtener todas las tareas del usuario autenticado
   * @async
   * @returns {Promise<Array<Object>>} Array de tareas del usuario
   * @throws {Error} Error si no está autenticado o falla la petición
   */
  async getTasks() {
    return await this.request('/tasks');
  },

  /**
   * Crear una nueva tarea
   * @async
   * @param {Object} taskData - Datos de la nueva tarea
   * @param {string} taskData.title - Título de la tarea
   * @param {string} [taskData.details] - Descripción detallada de la tarea
   * @param {string} taskData.status - Estado de la tarea ('pendiente', 'en-progreso', 'completada')
   * @param {string} [taskData.date] - Fecha límite de la tarea
   * @returns {Promise<Object>} Tarea creada con ID asignado
   * @throws {Error} Error si falla la creación
   */
  async createTask(taskData) {
    return await this.request('/tasks/new', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Obtener una tarea específica por ID
   * @async
   * @param {string} id - ID de la tarea a obtener
   * @returns {Promise<Object>} Datos de la tarea
   * @throws {Error} Error si la tarea no existe o no se puede acceder
   */
  async getTask(id) {
    return await this.request(`/tasks/${id}`);
  },

  /**
   * Eliminar una tarea por ID
   * @async
   * @param {string} id - ID de la tarea a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   * @throws {Error} Error si la tarea no existe o no se puede eliminar
   */
  async deleteTask(id) {
    return await this.request(`/tasks/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Actualizar una tarea existente
   * @async
   * @param {string} id - ID de la tarea a actualizar
   * @param {Object} taskData - Nuevos datos de la tarea
   * @param {string} [taskData.title] - Nuevo título
   * @param {string} [taskData.details] - Nueva descripción
   * @param {string} [taskData.status] - Nuevo estado
   * @param {string} [taskData.date] - Nueva fecha límite
   * @returns {Promise<Object>} Tarea actualizada
   * @throws {Error} Error si la tarea no existe o falla la actualización
   */
  async updateTask(id, taskData) {
    return await this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  /**
   * Solicitar restablecimiento de contraseña
   * @async
   * @param {string} email - Email del usuario para enviar enlace de recuperación
   * @returns {Promise<Object>} Confirmación de envío
   * @throws {Error} Error si el email no existe o falla el envío
   */
  async forgotPassword(email) {
    return await this.request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

// Hacer ApiService disponible globalmente
window.ApiService = ApiService;
