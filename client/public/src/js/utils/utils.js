/**
 * @fileoverview Funciones utilitarias generales de la aplicación
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

/**
 * Utilidades generales para la aplicación
 * Proporciona funciones helper para formateo, navegación, validación y notificaciones
 * @namespace Utils
 */
const Utils = {
  /**
   * Formatear fecha con hora en formato local español
   * @param {string|Date} date - Fecha a formatear
   * @returns {string} Fecha formateada o mensaje de error
   */
  formatDate: function(date) {
    if (!date) return 'N/A';
    
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  },

  /**
   * Formatear solo fecha (sin hora) en formato local español
   * @param {string|Date} date - Fecha a formatear
   * @returns {string} Fecha formateada o mensaje de error
   */
  formatDateOnly: function(date) {
    if (!date) return 'N/A';
    
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  },
  
  /**
   * Formatear solo hora en formato local español
   * @param {string|Date} date - Fecha con hora a formatear
   * @returns {string} Hora formateada o mensaje de error
   */
  formatTimeOnly: function(date) {
    if (!date) return 'N/A';
    
    try {
      return new Date(date).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear hora:', error);
      return 'Hora inválida';
    }
  },

  /**
   * Mostrar mensaje de error en un elemento específico
   * @param {string} elementId - ID del elemento donde mostrar el error
   * @param {string} message - Mensaje de error a mostrar
   */
  showError: function(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  },

  /**
   * Limpiar mensaje de error de un elemento específico
   * @param {string} elementId - ID del elemento donde limpiar el error
   */
  clearError: function(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = '';
    }
  },

  /**
   * Navegar a una página específica
   * @param {string} page - URL de la página a la que navegar
   */
  navigateTo: function(page) {
    window.location.href = page;
  },

  /**
   * Verificar autenticación y redirigir si es necesario
   * @returns {Promise<boolean>} True si está autenticado, false en caso contrario
   * @async
   */
  checkAuth: async function() {
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
        this.navigateTo('/auth.html');
      }
      return false;
    }
  },

  /**
   * Ordenar tareas por fecha de creación (más recientes primero)
   * @param {Array<Object>} tasks - Array de tareas a ordenar
   * @returns {Array<Object>} Array de tareas ordenado
   */
  sortTasksByDate: function(tasks) {
    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Mostrar pantalla de carga
   */
  showLoading: function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  },

  /**
   * Ocultar pantalla de carga
   */
  hideLoading: function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
    }
  },

  /**
   * Mostrar mensaje de error usando el sistema de notificaciones
   * @param {string} message - Mensaje de error a mostrar
   */
  showErrorMessage: function(message) {
    // Crear notificación de error
    this.showNotification(message, 'error');
  },

  /**
   * Mostrar mensaje de éxito usando el sistema de notificaciones
   * @param {string} message - Mensaje de éxito a mostrar
   */
  showSuccessMessage: function(message) {
    // Crear notificación de éxito
    this.showNotification(message, 'success');
  },

  /** @type {Array} Cola de notificaciones pendientes */
  notificationsQueue: [],
  
  /** @type {boolean} Indica si se está mostrando una notificación */
  isShowingNotification: false,
  
  /** @type {string|null} Último mensaje de error mostrado */
  lastErrorMessage: null,
  
  /** @type {number} Timestamp del último error */
  lastErrorTime: 0,
  
  /** @type {string|null} Último mensaje de éxito mostrado */
  lastSuccessMessage: null,
  
  /** @type {number} Timestamp del último éxito */
  lastSuccessTime: 0,
  
  /**
   * Mostrar notificación toast con prevención de duplicados
   * @param {string} message - Mensaje a mostrar
   * @param {string} [type='info'] - Tipo de notificación (info, success, error, warning)
   */
  showNotification: function(message, type) {
    // Usar un tipo por defecto si no se especifica
    if (!type) type = 'info';
    
    // Prevenir duplicados en corto tiempo
    const now = Date.now();
    
    if (type === 'error') {
      // Evitar mostrar el mismo error en menos de 3 segundos
      if (this.lastErrorMessage === message && now - this.lastErrorTime < 3000) {
        console.log('Evitando notificación de error duplicada:', message);
        return;
      }
      this.lastErrorMessage = message;
      this.lastErrorTime = now;
    } else if (type === 'success') {
      // Evitar mostrar el mismo éxito en menos de 3 segundos
      if (this.lastSuccessMessage === message && now - this.lastSuccessTime < 3000) {
        console.log('Evitando notificación de éxito duplicada:', message);
        return;
      }
      this.lastSuccessMessage = message;
      this.lastSuccessTime = now;
    }
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span>${message}</span>
        <button class="notification-close">&times;</button>
      </div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(function() {
      notification.classList.add('show');
    }, 10);
    
    // Configurar cierre automático
    setTimeout(function() {
      notification.classList.remove('show');
      setTimeout(function() {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300); // tiempo de la animación
    }, 3000);
    
    // Permitir cierre manual
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(function() {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      });
    }
  },

  /**
   * Mostrar mensaje de error con soporte para elementos DOM o notificaciones
   * @param {string} message - Mensaje de error
   * @param {string} [elementId] - ID del elemento DOM donde mostrar el error
   */
  showError: function(message, elementId) {
    // Si es un elemento DOM, actualizar el contenido
    if (elementId && document.getElementById(elementId)) {
      const errorElement = document.getElementById(elementId);
      errorElement.textContent = message;
    } else {
      // Si no hay elemento, usar sistema de notificaciones
      this.showNotification(message, 'error');
    }
  },

  /**
   * Mostrar mensaje de éxito usando notificaciones toast
   * @param {string} message - Mensaje de éxito a mostrar
   */
  showSuccess: function(message) {
    this.showNotification(message, 'success');
  }
};

// Hacer Utils disponible globalmente
window.Utils = Utils;