/**
 * @fileoverview Aplicación principal - Inicialización y enrutamiento
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

import ApiService from './api.js';

/**
 * Objeto principal de la aplicación
 * Maneja inicialización, autenticación y navegación entre pantallas
 * @namespace App
 */
const App = {
  /**
   * Inicializar la aplicación
   * Muestra pantalla de carga, verifica autenticación y redirige apropiadamente
   * @async
   */
  async init() {
    // Mostrar pantalla de carga
    this.showLoading();
    
    // Inicializar componentes
    AuthManager.init();
    
    // Verificar si hay autenticación existente
    try {
      const user = await ApiService.verifyToken();
      this.showDashboard(user);
    } catch (error) {
      console.log('No hay autenticación válida');
      this.showAuth();
    }
  },

  /**
   * Mostrar pantalla de carga
   */
  showLoading() {
    this.hideAllScreens();
    document.getElementById('loading-screen').style.display = 'flex';
  },

  /**
   * Mostrar pantalla de autenticación
   */
  showAuth() {
    this.hideAllScreens();
    document.getElementById('auth-screen').style.display = 'block';
  },

  /**
   * Mostrar dashboard principal
   * @param {Object} user - Información del usuario autenticado
   * @async
   */
  async showDashboard(user) {
    this.hideAllScreens();
    
    // Obtener perfil actualizado si no se proporcionó
    if (!user) {
      try {
        user = await ApiService.getProfile();
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
        this.showAuth();
        return;
      }
    }
    
    // Inicializar TaskManager con el usuario
    TaskManager.init(user);
    TaskManager.updateUserGreeting();
    
    document.getElementById('dashboard-screen').style.display = 'block';
  },

  /**
   * Ocultar todas las pantallas de la aplicación
   */
  hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
      screen.style.display = 'none';
    });
  }
};

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
