/**
 * @fileoverview Servicio de API simulado para desarrollo sin backend
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

/**
 * Servicio de API simulado para desarrollo y testing
 * Proporciona respuestas fictas para todas las operaciones de API
 * @namespace MockApiService
 */
const MockApiService = {
  /**
   * Simular petición HTTP con delay de red
   * @async
   * @param {string} endpoint - Endpoint de la API a simular
   * @param {Object} [options={}] - Opciones de la petición
   * @returns {Promise<Object>} Respuesta simulada
   */
  async request(endpoint, options = {}) {
    console.log('Mock API Request:', endpoint, options);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mocks basados en endpoints
    if (endpoint === '/profile') {
      return {
        id: '12345',
        name: 'Usuario',
        lastname: 'Demo',
        email: 'usuario@demo.com',
        age: 25,
        createdAt: new Date().toISOString()
      };
    }
    
    if (endpoint === '/profile/edit') {
      return {
        id: '12345',
        name: 'Usuario Actualizado',
        lastname: 'Demo',
        email: 'usuario@demo.com',
        age: 25,
        createdAt: new Date().toISOString()
      };
    }
    
    if (endpoint.startsWith('/user/')) {
      return { message: 'Cuenta eliminada correctamente' };
    }
    
    return { success: true };
  },

  /**
   * Obtener perfil del usuario (simulado)
   * @async
   * @returns {Promise<Object>} Datos del perfil del usuario
   */
  async getProfile() {
    return await this.request('/profile');
  },

  /**
   * Actualizar perfil del usuario (simulado)
   * @async
   * @param {Object} profileData - Datos del perfil a actualizar
   * @returns {Promise<Object>} Perfil actualizado
   */
  async updateProfile(profileData) {
    return await this.request('/profile/edit', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Eliminar cuenta de usuario (simulado)
   * @async
   * @param {string} userId - ID del usuario a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async deleteUser(userId) {
    return await this.request(`/user/${userId}`, {
      method: 'DELETE'
    });
  }
};

// Si el ApiService real no está disponible, usar el mock
if (typeof ApiService === 'undefined') {
  window.ApiService = MockApiService;
} else {
  window.MockApiService = MockApiService;
}