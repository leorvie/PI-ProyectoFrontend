/**
 * @fileoverview Manejo del dashboard principal - Vista de tareas y filtros
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', async () => {
    /**
     * Gestor del dashboard principal de la aplicación
     * Maneja visualización de tareas, filtros, vistas Kanban/Lista y operaciones CRUD
     * @namespace DashboardManager
     */
    const DashboardManager = {
        /** @type {Array<Object>} Array de tareas del usuario */
        tasks: [],
        
        /** @type {Object|null} Datos del usuario autenticado */
        user: null,
        
        /** @type {string} Filtro actual aplicado ('all', 'pendiente', 'en-progreso', 'completada') */
        currentFilter: 'all',
        
        /** @type {string} Vista actual ('kanban' o 'list') */
        currentView: 'kanban', // Vista por defecto Kanban
        
        /** @type {string|null} ID de la tarea actualmente en edición/eliminación */
        currentTaskId: null, // Para tracking de la tarea actual en edición/eliminación

        /**
         * Inicializar el dashboard
         * Verifica autenticación, carga perfil y tareas, configura eventos
         * @async
         */
        async init() {
            // Verificar autenticación
            const isAuthenticated = await Utils.checkAuth();
            if (!isAuthenticated) return;

            await this.loadUserProfile();
            await this.loadTasks();
            this.bindEvents();
            this.hideLoading();
        },

        /**
         * Cargar perfil del usuario autenticado desde la API
         * @async
         */
        async loadUserProfile() {
            try {
                const userData = await window.ApiService.getProfile();
                this.user = userData;
                this.updateUserGreeting();
            } catch (error) {
                console.error('Error loading user profile:', error);
                Utils.showError('Error al cargar el perfil del usuario');
            }
        },

        /**
         * Actualizar saludo personalizado en el dashboard
         */
        updateUserGreeting() {
            const greeting = document.getElementById('user-greeting');
            if (greeting && this.user) {
                const name = this.user.name || this.user.username || this.user.email.split('@')[0];
                greeting.textContent = `¡Hola, ${name}!`;
            }
        },

        /**
         * Cargar todas las tareas del usuario desde la API
         * @async
         */
        async loadTasks() {
            try {
                this.tasks = await window.ApiService.getTasks();
                this.renderTasks();
            } catch (error) {
                console.error('Error loading tasks:', error);
                this.tasks = [];
                this.renderTasks();
            }
        },

        /**
         * Configurar event listeners para filtros y cambios de vista
         */
        bindEvents() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            const viewBtns = document.querySelectorAll('.view-btn');
            
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleFilter(e));
            });
            
            viewBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleViewChange(e));
            });
        },

        /**
         * Manejar cambio de vista entre Kanban y Lista
         * @param {Event} e - Evento del botón de vista clickeado
         */
        handleViewChange(e) {
            const view = e.target.closest('.view-btn').dataset.view;
            this.currentView = view;
            
            // Actualizar botones activos
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.closest('.view-btn').classList.add('active');
            
            // Mostrar/ocultar vistas
            const kanbanView = document.getElementById('kanban-view');
            const listView = document.getElementById('list-view');
            
            if (view === 'kanban') {
                kanbanView.style.display = 'grid';
                listView.style.display = 'none';
            } else {
                kanbanView.style.display = 'none';
                listView.style.display = 'block';
            }
            
            this.renderTasks();
        },

        /**
         * Manejar filtrado de tareas por estado
         * @param {Event} e - Evento del botón de filtro clickeado
         */
        handleFilter(e) {
            const filter = e.target.dataset.filter;
            this.currentFilter = filter;
            
            // Actualizar botones activos
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            this.renderTasks();
        },

        /**
         * Obtener tareas filtradas según el filtro actual
         * @returns {Array<Object>} Array de tareas filtradas
         */
        getFilteredTasks() {
            if (this.currentFilter === 'all') {
                return this.tasks;
            }
            return this.tasks.filter(task => task.status === this.currentFilter);
        },

        /**
         * Renderizar tareas según la vista actual (Kanban o Lista)
         */
        renderTasks() {
            if (this.currentView === 'kanban') {
                this.renderKanbanView();
            } else {
                this.renderListView();
            }
        },

        /**
         * Renderizar vista Kanban con columnas por estado
         */
        renderKanbanView() {
            const statuses = ['Por Hacer', 'Haciendo', 'Hecho'];
            
            statuses.forEach(status => {
                const column = document.querySelector(`[data-status="${status}"] .column-tasks`);
                const countElement = document.querySelector(`[data-status="${status}"] .task-count`);
                
                let tasksForStatus = this.tasks.filter(task => task.status === status);
                
                // Aplicar filtro si no es "all"
                if (this.currentFilter !== 'all') {
                    tasksForStatus = tasksForStatus.filter(task => task.status === this.currentFilter);
                }
                
                // Actualizar contador
                countElement.textContent = tasksForStatus.length;
                
                // Renderizar tareas
                if (tasksForStatus.length === 0) {
                    column.innerHTML = `
                        <div class="kanban-empty">
                            <p>No hay tareas en ${status}</p>
                        </div>
                    `;
                } else {
                    column.innerHTML = tasksForStatus.map(task => this.createKanbanTaskHTML(task)).join('');
                }
            });
            
            this.bindTaskEvents();
        },

        /**
         * Renderizar vista de lista con tareas ordenadas
         */
        renderListView() {
            const tasksContainer = document.getElementById('list-view');
            const filteredTasks = this.getFilteredTasks();
            
            if (filteredTasks.length === 0) {
                tasksContainer.innerHTML = this.getEmptyStateHTML();
                return;
            }
            
            // Ordenar por fecha ascendente
            const sortedTasks = filteredTasks.sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite));
            
            tasksContainer.innerHTML = sortedTasks.map(task => this.createTaskHTML(task)).join('');
            this.bindTaskEvents();
        },

        /**
         * Crear HTML para tarjeta de tarea en vista Kanban
         * @param {Object} task - Objeto de tarea
         * @returns {string} HTML de la tarjeta de tarea
         */
        createKanbanTaskHTML(task) {
            const createdDate = new Date(task.createdAt || task.updatedAt).toLocaleDateString('es-ES');
            
            // Fecha de vencimiento con hora
            let dueDateHTML = '';
            if (task.date) {
                const dueDate = new Date(task.date);
                const today = new Date();
                const isOverdue = dueDate < today && task.status !== 'Hecho';
                
                // Formatear fecha con hora
                const formatOptions = { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit'
                };
                const dateTimeFormatted = dueDate.toLocaleString('es-ES', formatOptions);
                
                dueDateHTML = `
                    <span class="kanban-task-due-date ${isOverdue ? 'overdue' : ''}" title="Fecha límite">
                        <svg class="task-icon" viewBox="0 0 24 24" width="14" height="14">
                            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                            <path d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                        </svg>
                        ${dateTimeFormatted}
                    </span>
                `;
            }
            
            return `
                <div class="kanban-task" data-task-id="${task._id}">
                    <div class="kanban-task-title">${task.title}</div>
                    <div class="kanban-task-description">${task.details || 'Sin descripción'}</div>
                    <div class="kanban-task-meta">
                        <span class="kanban-task-date">Creado: ${createdDate}</span>
                        ${dueDateHTML}
                    </div>
                    <div class="task-actions">
                        <button class="btn-icon edit-task" title="Editar tarea">✏️</button>
                        <button class="btn-icon delete-task" title="Eliminar tarea">🗑️</button>
                    </div>
                </div>
            `;
        },

        /**
         * Obtener HTML para estado vacío cuando no hay tareas
         * @returns {string} HTML del estado vacío
         */
        getEmptyStateHTML() {
            return `
                <div class="empty-state">
                    <h3>No tienes tareas aún</h3>
                    <p>¡Crea tu primera tarea para comenzar!</p>
                    <a href="/create-task.html" class="btn btn-primary">Nueva Tarea</a>
                </div>
            `;
        },

        /**
         * Crear HTML para tarjeta de tarea en vista de lista
         * @param {Object} task - Objeto de tarea
         * @returns {string} HTML de la tarjeta de tarea
         */
        createTaskHTML(task) {
            const isCompleted = task.status === 'Hecho';
            return `
                <div class="task-item ${isCompleted ? 'completed' : ''}" data-task-id="${task._id}">
                    <div class="task-header">
                        <h3 class="task-title ${isCompleted ? 'completed' : ''}">${task.title}</h3>
                        <div class="task-actions">
                            <button class="btn-icon toggle-status" title="${isCompleted ? 'Marcar como pendiente' : 'Marcar como completada'}">
                                ${isCompleted ? '↶' : '✓'}
                            </button>
                            <button class="btn-icon edit-task" title="Editar tarea">✏️</button>
                            <button class="btn-icon delete-task" title="Eliminar tarea">🗑️</button>
                        </div>
                    </div>
                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                    <div class="task-meta">
                        <span class="task-date">Creada: ${Utils.formatDate(task.createdAt)}</span>
                        <span class="task-status ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
                    </div>
                </div>
            `;
        },

        /**
         * Vincular eventos a los botones de acción de tareas
         */
        bindTaskEvents() {
            // Toggle status
            document.querySelectorAll('.toggle-status').forEach(btn => {
                btn.addEventListener('click', (e) => this.toggleTaskStatus(e));
            });
            
            // Delete task
            document.querySelectorAll('.delete-task').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteTask(e));
            });
            
            // Edit task (placeholder)
            document.querySelectorAll('.edit-task').forEach(btn => {
                btn.addEventListener('click', (e) => this.editTask(e));
            });
        },

        /**
         * Alternar estado de una tarea entre completada y pendiente
         * @param {Event} e - Evento del elemento clickeado
         * @async
         */
        async toggleTaskStatus(e) {
            // Buscar el elemento contenedor de la tarea (funciona para lista y kanban)
            const taskElement = e.target.closest('.task-item, .kanban-task');
            
            if (!taskElement) {
                console.error('No se pudo encontrar el elemento de la tarea');
                return;
            }
            
            const taskId = taskElement.dataset.taskId;
            const task = this.tasks.find(t => t._id === taskId);
            
            if (task) {
                const newStatus = task.status === 'Hecho' ? 'Por Hacer' : 'Hecho';
                try {
                    await window.ApiService.updateTask(taskId, { status: newStatus });
                    task.status = newStatus;
                    this.renderTasks();
                    
                    if (window.Utils) {
                        window.Utils.showSuccess(`Tarea marcada como ${newStatus}`);
                    }
                } catch (error) {
                    console.error('Error updating task:', error);
                    if (window.Utils) {
                        window.Utils.showError('Error al actualizar la tarea');
                    }
                }
            }
        },

        /**
         * Eliminar una tarea después de confirmación del usuario
         * @param {Event} e - Evento del elemento clickeado
         * @async
         */
        async deleteTask(e) {
            // Buscar el elemento contenedor de la tarea (funciona para lista y kanban)
            const taskElement = e.target.closest('.task-item, .kanban-task');
            
            if (!taskElement) {
                console.error('No se pudo encontrar el elemento de la tarea');
                return;
            }
            
            const taskId = taskElement.dataset.taskId;
            
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                try {
                    await window.ApiService.deleteTask(taskId);
                    this.tasks = this.tasks.filter(t => t._id !== taskId);
                    this.renderTasks();
                    
                    if (window.Utils) {
                        window.Utils.showSuccess('Tarea eliminada exitosamente');
                    }
                } catch (error) {
                    console.error('Error deleting task:', error);
                    if (window.Utils) {
                        window.Utils.showError('Error al eliminar la tarea');
                    }
                }
            }
        },

        /**
         * Abrir modal de edición para una tarea
         * @param {Event} e - Evento del elemento clickeado
         */
        editTask(e) {
            const taskElement = e.target.closest('[data-task-id]');
            const taskId = taskElement.dataset.taskId;
            const task = this.tasks.find(t => t._id === taskId);
            
            if (task) {
                // Abrir el modal de edición
                const modal = document.getElementById('edit-task-modal');
                const form = document.getElementById('edit-task-form');
                const titleInput = document.getElementById('edit-title');
                const detailsInput = document.getElementById('edit-details');
                const statusInput = document.getElementById('edit-status');
                const dateInput = document.getElementById('edit-date');
                const timeInput = document.getElementById('edit-time');

                // Establecer los valores actuales
                titleInput.value = task.title;
                detailsInput.value = task.details || '';
                statusInput.value = task.status;

                // Manejar fecha y hora si existen
                if (task.date) {
                    const dueDate = new Date(task.date);
                    
                    // Formato para input date (YYYY-MM-DD)
                    const year = dueDate.getFullYear();
                    const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                    const day = String(dueDate.getDate()).padStart(2, '0');
                    dateInput.value = `${year}-${month}-${day}`;
                    
                    // Formato para input time (HH:MM)
                    const hours = String(dueDate.getHours()).padStart(2, '0');
                    const minutes = String(dueDate.getMinutes()).padStart(2, '0');
                    timeInput.value = `${hours}:${minutes}`;
                } else {
                    dateInput.value = '';
                    timeInput.value = '';
                }

                // Guardar el ID de la tarea actual
                this.currentTaskId = taskId;

                // Mostrar el modal
                modal.style.display = 'flex';

                // Configurar el evento de envío del formulario
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    
                    // Procesar fecha y hora
                    let dateValue = formData.get('date');
                    const timeValue = formData.get('time') || '00:00';
                    
                    if (dateValue) {
                        // Combinar fecha y hora
                        const selectedDate = new Date(dateValue + 'T' + timeValue);
                        
                        // Verificar si la fecha es anterior a hoy
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        const selectedDateWithoutTime = new Date(selectedDate);
                        selectedDateWithoutTime.setHours(0, 0, 0, 0);
                        
                        if (selectedDateWithoutTime < today) {
                            alert('La fecha de vencimiento no puede ser anterior a hoy.');
                            return;
                        }
                        
                        // Convertir a formato ISO para el backend
                        dateValue = selectedDate.toISOString();
                    }
                    
                    const updatedTask = {
                        title: formData.get('title'),
                        details: formData.get('details'),
                        status: formData.get('status'),
                        date: dateValue || null
                    };

                    try {
                        // Intentar actualizar la tarea
                        await window.ApiService.updateTask(taskId, updatedTask);
                        
                        // Cerrar el modal
                        modal.style.display = 'none';
                        
                        // Recargar las tareas
                        await this.loadTasks();
                        
                        // Mostrar mensaje de éxito
                        if (window.Utils) {
                            window.Utils.showSuccess('Tarea actualizada exitosamente');
                        }
                    } catch (error) {
                        // Manejar error
                        console.error('Error updating task:', error);
                        
                        // Mostrar mensaje de error
                        if (window.Utils) {
                            window.Utils.showError('Error al actualizar la tarea');
                        } else {
                            alert('Error al actualizar la tarea');
                        }
                    }
                };

                // Configurar el botón de cancelar
                const cancelBtn = document.getElementById('cancel-edit');
                cancelBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            }
        },

        /**
         * Ocultar pantalla de carga
         */
        hideLoading() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }
    };

    await DashboardManager.init();
});