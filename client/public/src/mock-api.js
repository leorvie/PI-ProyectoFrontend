// Mock API Service para desarrollo sin backend
const MockApiService = {
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

  async getProfile() {
    return await this.request('/profile');
  },

  async updateProfile(profileData) {
    return await this.request('/profile/edit', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

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