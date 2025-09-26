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
  // Variables para control de notificaciones
  _lastErrorMessage: null,
  _lastErrorTime: 0,
  _lastSuccessMessage: null,
  _lastSuccessTime: 0,

   /**
   * Formatear fecha con hora en formato local español
   * @param {string|Date} date - Fecha a formatear
   * @returns {string} Fecha formateada o mensaje de error
   */
  _formatDate: function(date, options) {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  },

  // Formatear fecha completa con hora
  formatDate: function(date) {
    return this._formatDate(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Formatear solo fecha (sin hora) en formato local español
   * @param {string|Date} date - Fecha a formatear
   * @returns {string} Fecha formateada o mensaje de error
   */
  formatDateOnly: function(date) {
    return this._formatDate(date, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  // Gestionar mensajes en elementos DOM
  _updateDOMElement: function(elementId, message, action = 'set') {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = action === 'clear' ? '' : message;
      return true;
    }
    return false;
  },

  /**
   * Mostrar mensaje de error en un elemento específico
   * @param {string} elementId - ID del elemento donde mostrar el error
   * @param {string} message - Mensaje de error a mostrar
   */
  showError: function(messageOrElementId, elementIdOrMessage) {
    // Detectar si el primer parámetro es un ID de elemento
    if (typeof messageOrElementId === 'string' && arguments.length === 2) {
      // Formato: showError(elementId, message)
      if (!this._updateDOMElement(messageOrElementId, elementIdOrMessage)) {
        this.showNotification(elementIdOrMessage, 'error');
      }
    } else {
      // Formato: showError(message)
      this.showNotification(messageOrElementId, 'error');
    }
  },

  /**
   * Limpiar mensaje de error de un elemento específico
   * @param {string} elementId - ID del elemento donde limpiar el error
   */
  clearError: function(elementId) {
    this._updateDOMElement(elementId, '', 'clear');
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

  // Gestionar pantalla de carga
  _toggleLoading: function(show) {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = show ? 'flex' : 'none';
    }
  },

  /**
   * Mostrar pantalla de carga
   */
  showLoading: function() {
    this._toggleLoading(true);
  },

  /**
   * Ocultar pantalla de carga
   */
  hideLoading: function() {
    this._toggleLoading(false);
  },


  
  // Prevenir notificaciones duplicadas
  _isDuplicateNotification: function(message, type) {
    const now = Date.now();
    const timeThreshold = 3000; // 3 segundos

    if (type === 'error') {
      if (this._lastErrorMessage === message && now - this._lastErrorTime < timeThreshold) {
        console.log('Evitando notificación de error duplicada:', message);
        return true;
      }
      this._lastErrorMessage = message;
      this._lastErrorTime = now;
    } else if (type === 'success') {
      if (this._lastSuccessMessage === message && now - this._lastSuccessTime < timeThreshold) {
        console.log('Evitando notificación de éxito duplicada:', message);
        return true;
      }
      this._lastSuccessMessage = message;
      this._lastSuccessTime = now;
    }
    return false;
  },

  // Método para mostrar notificaciones
  showNotification: function(message, type) {
    type = type || 'info';
    
    // Prevenir duplicados
    if (this._isDuplicateNotification(message, type)) {
      return;
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

  // Aliases para mantener compatibilidad
  showErrorMessage: function(message) {
    this.showNotification(message, 'error');
  },

  showSuccessMessage: function(message) {
    this.showNotification(message, 'success');
  },

  showSuccess: function(message) {
    this.showNotification(message, 'success');
  }
};

// Hacer Utils disponible globalmente
window.Utils = Utils;