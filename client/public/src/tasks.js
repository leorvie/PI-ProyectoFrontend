/**
 * @fileoverview Manejo de tareas - Versión simplificada del gestor de tareas
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

import ApiService from './api.js';

/**
 * Gestor de tareas simplificado
 * Maneja operaciones básicas de tareas y visualización
 * @namespace TaskManager
 */
const TaskManager = {
  /** @type {Array<Object>} Lista de tareas del usuario */
  tasks: [],
  
  /** @type {Object|null} Datos del usuario autenticado */
  user: null,

  /**
   * Inicializar el gestor de tareas
   * @param {Object} user - Datos del usuario autenticado
   */
  init(user) {
    this.user = user;
    this.bindEvents();
    this.loadTasks();
  },

  /**
   * Vincular eventos del DOM con los métodos del gestor
   */
  bindEvents() {
    const taskForm = document.getElementById('task-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    taskForm.addEventListener('submit', (e) => this.handleCreateTask(e));
    logoutBtn.addEventListener('click', () => this.handleLogout());
  },

  /**
   * Cargar tareas del servidor y renderizar en la interfaz
   * @async
   */
  async loadTasks() {
    try {
      const response = await ApiService.getTasks();
      this.tasks = response || [];
      this.renderTasks();
      this.updateTasksTitle();
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = [];
      this.renderTasks();
    }
  },

  /**
   * Manejar creación de nueva tarea
   * @param {Event} e - Evento de envío del formulario
   * @async
   */
  async handleCreateTask(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('task-error');
    errorDiv.textContent = '';

    const formData = new FormData(e.target);
    const taskData = Object.fromEntries(formData);

    try {
      await ApiService.createTask(taskData);
      e.target.reset();
      await this.loadTasks(); // Recargar tareas
    } catch (error) {
      errorDiv.textContent = error.message || 'Error al crear la tarea';
    }
  },

  /**
   * Manejar logout del usuario
   * @async
   */
  async handleLogout() {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    App.showAuth();
  },

  /**
   * Renderizar lista de tareas en la interfaz
   */
  renderTasks() {
    const tasksGrid = document.getElementById('tasks-grid');
    
    if (this.tasks.length === 0) {
      tasksGrid.innerHTML = '<div class="no-tasks">No tienes tareas aún. ¡Crea tu primera tarea!</div>';
      return;
    }

    const tasksHTML = this.tasks.map(task => `
      <div class="task-card ${task.status.toLowerCase().replace(' ', '-')}">
        <div class="task-header">
          <h3>${task.title}</h3>
          <span class="task-status status-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
        </div>
        ${task.details ? `<p class="task-details">${task.details}</p>` : ''}
        <div class="task-footer">
          <small>Creada: ${new Date(task.createdAt).toLocaleDateString('es-ES')}</small>
        </div>
      </div>
    `).join('');

    tasksGrid.innerHTML = tasksHTML;
  },

  /**
   * Actualizar título con el número de tareas
   */
  updateTasksTitle() {
    const tasksTitle = document.getElementById('tasks-title');
    tasksTitle.textContent = `Mis Tareas (${this.tasks.length})`;
  },

  /**
   * Actualizar saludo del usuario en la interfaz
   */
  updateUserGreeting() {
    const userGreeting = document.getElementById('user-greeting');
    userGreeting.textContent = `¡Hola, ${this.user?.name || 'Usuario'}!`;
  }
};