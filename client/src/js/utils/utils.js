// Utilidades generales
const Utils = {
  // Formatear fecha
  formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Mostrar mensaje de error
  showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  },

  // Limpiar mensaje de error
  clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = '';
    }
  },

  // Navegar a una página
  navigateTo(page) {
    window.location.href = page;
  },

  // Verificar autenticación y redirigir si es necesario
  async checkAuth() {
    try {
      console.log('Verificando autenticación...');
      await window.ApiService.verifyToken();
      console.log('Autenticación válida');
      return true;
    } catch (error) {
      console.log('Autenticación fallida:', error.message);
      // Solo redirigir si no estamos ya en la página de auth
      if (!window.location.pathname.includes('auth.html')) {
        console.log('Redirigiendo a auth.html');
  this.navigateTo('/src/pages/auth.html');
      }
      return false;
    }
  },

  // Ordenar tareas por fecha de creación (más recientes primero)
  sortTasksByDate(tasks) {
    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

// Hacer Utils disponible globalmente
window.Utils = Utils;