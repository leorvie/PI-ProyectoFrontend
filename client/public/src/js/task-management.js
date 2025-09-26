/**
 * @fileoverview Funciones para manejo de tareas - Modales de edición y eliminación
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

/**
 * Objeto que maneja las operaciones de tareas (editar, eliminar, validar)
 * Controla modales y formularios de edición de tareas
 * @namespace TaskManagement
 */
const TaskManagement = {
    /** @type {string|null} ID de la tarea actualmente seleccionada */
    currentTaskId: null,

    /**
     * Mostrar modal de edición de tarea con datos prellenados
     * @param {Object} task - Objeto tarea con todos sus datos
     * @param {string} task._id - ID único de la tarea
     * @param {string} task.title - Título de la tarea
     * @param {string} [task.details] - Descripción de la tarea
     * @param {string} task.status - Estado de la tarea
     * @param {string} [task.date] - Fecha límite de la tarea
     */
    showEditModal(task) {
        const modal = document.getElementById('edit-task-modal');
        const form = document.getElementById('edit-task-form');
        const titleInput = document.getElementById('edit-title');
        const detailsInput = document.getElementById('edit-details');
        const statusInput = document.getElementById('edit-status');
        const dateInput = document.getElementById('edit-date');

        this.currentTaskId = task._id;
        titleInput.value = task.title;
        detailsInput.value = task.details || '';
        statusInput.value = task.status;
        
        // Manejar el campo de fecha y hora
        if (dateInput) {
            const timeInput = document.getElementById('edit-time');
            
            if (task.date) {
                const dueDate = new Date(task.date);
                
                // Formatear fecha para input date
                const year = dueDate.getFullYear();
                const month = String(dueDate.getMonth() + 1).padStart(2, '0');
                const day = String(dueDate.getDate()).padStart(2, '0');
                dateInput.value = `${year}-${month}-${day}`;
                
                // Formatear hora para input time
                const hours = String(dueDate.getHours()).padStart(2, '0');
                const minutes = String(dueDate.getMinutes()).padStart(2, '0');
                
                if (timeInput) {
                    timeInput.value = `${hours}:${minutes}`;
                }
                
                console.log('Fecha original:', task.date);
                console.log('Fecha formateada para input:', `${year}-${month}-${day}`);
                console.log('Hora formateada para input:', `${hours}:${minutes}`);
            } else {
                dateInput.value = '';
                if (timeInput) timeInput.value = '00:00';
            }
        }

        // Actualizar contadores de caracteres
        this.updateCharCounter(titleInput, 50);
        this.updateCharCounter(detailsInput, 500);

        // Configurar validación en tiempo real para el modal de edición
        this.setupEditValidation();

        modal.style.display = 'flex';
    },

    /**
     * Ocultar modal de edición de tareas
     */
    hideEditModal() {
        const modal = document.getElementById('edit-task-modal');
        modal.style.display = 'none';
        this.currentTaskId = null;
    },

    /**
     * Mostrar modal de confirmación de eliminación
     * @param {string} taskId - ID de la tarea a eliminar
     */
    showDeleteModal(taskId) {
        const modal = document.getElementById('delete-task-modal');
        this.currentTaskId = taskId;
        modal.style.display = 'flex';
    },

    /**
     * Ocultar modal de confirmación de eliminación
     */
    hideDeleteModal() {
        const modal = document.getElementById('delete-task-modal');
        modal.style.display = 'none';
        this.currentTaskId = null;
    },

    /**
     * Actualizar contador de caracteres para campos de texto
     * @param {HTMLInputElement} input - Campo de entrada de texto
     * @param {number} maxLength - Límite máximo de caracteres
     */
    updateCharCounter(input, maxLength) {
        const counter = input.nextElementSibling;
        const length = input.value.length;
        counter.textContent = `${length}/${maxLength}`;
        
        if (length >= maxLength) {
            counter.classList.add('danger');
        } else if (length >= maxLength * 0.8) {
            counter.classList.add('warning');
            counter.classList.remove('danger');
        } else {
            counter.classList.remove('warning', 'danger');
        }
    },

    /**
     * Configurar validación para el modal de edición
     */
    setupEditValidation() {
        const titleInput = document.getElementById('edit-title');
        const dateInput = document.getElementById('edit-date');
        const timeInput = document.getElementById('edit-time');
        const statusInput = document.getElementById('edit-status');
        
        // Agregar eventos de validación
        [titleInput, dateInput, timeInput, statusInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.validateEditForm());
                input.addEventListener('change', () => this.validateEditForm());
            }
        });
        
        // Validación inicial
        this.validateEditForm();
    },

    /**
     * Validar formulario de edición de tareas
     */
    validateEditForm() {
        const titleInput = document.getElementById('edit-title');
        const dateInput = document.getElementById('edit-date');
        const timeInput = document.getElementById('edit-time');
        const statusInput = document.getElementById('edit-status');
        const submitBtn = document.querySelector('#edit-task-form button[type="submit"]');
        
        if (!submitBtn) return;
        
        // Validar título
        const hasValidTitle = titleInput && titleInput.value.trim().length > 0 && titleInput.value.length <= 50;
        
        // Validar fecha
        const hasValidDate = dateInput && dateInput.value.trim().length > 0;
        
        // Validar hora
        const hasValidTime = timeInput && timeInput.value.trim().length > 0;
        
        // Validar estado
        const hasValidStatus = statusInput && statusInput.value.trim().length > 0;
        
        // Habilitar botón solo si todos los campos básicos son válidos
        const isFormValid = hasValidTitle && hasValidDate && hasValidTime && hasValidStatus;
        
        submitBtn.disabled = !isFormValid;
        
        // Actualizar texto del botón
        if (isFormValid) {
            submitBtn.textContent = 'Guardar';
            submitBtn.title = '';
        } else {
            submitBtn.textContent = 'Completar campos requeridos';
            submitBtn.title = 'Título, fecha, hora y estado son obligatorios';
        }
    },

    /**
     * Manejar envío del formulario de edición de tareas
     * @param {Event} e - Evento de envío del formulario
     * @async
     */
    async handleEditSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Validaciones básicas
        const title = formData.get('title');
        if (!title || title.trim() === '') {
            alert('El título de la tarea es obligatorio.');
            return;
        }
        
        if (title.length > 50) {
            alert('El título no puede tener más de 50 caracteres.');
            return;
        }
        
        const details = formData.get('details');
        if (details && details.length > 500) {
            alert('La descripción no puede tener más de 500 caracteres.');
            return;
        }
        
        // Procesar la fecha y hora correctamente
        let dateValue = formData.get('date');
        const timeValue = formData.get('time') || '00:00';
        
        if (dateValue) {
            try {
                // Combinar fecha y hora
                const selectedDate = new Date(dateValue + 'T' + timeValue);
                
                // Verificar si la fecha es anterior a hoy (considerando solo la fecha, no la hora)
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
                console.log('Fecha formateada para enviar al backend:', dateValue);
            } catch (error) {
                console.error('Error al procesar la fecha:', error);
                alert('Formato de fecha u hora incorrecto. Por favor, verifica.');
                return;
            }
        }
        
        const taskData = {
            title: title.trim(),
            details: details ? details.trim() : '',
            status: formData.get('status'),
            date: dateValue || null
        };

        try {
            // Actualizar la tarea
            await ApiService.updateTask(this.currentTaskId, taskData);
            this.hideEditModal();
            
            // Recargar tareas en el dashboard si existe
            if (window.DashboardManager && window.DashboardManager.loadTasks) {
                await window.DashboardManager.loadTasks();
                
                // En este punto, DashboardManager existe y ya muestra su propio mensaje,
                // así que no hacemos nada más
                console.log('Tarea actualizada desde TaskManagement, delegando mensaje a Dashboard');
            } else {
                // Si estamos ejecutando esto fuera del dashboard, mostrar mensaje de éxito
                if (window.Utils) {
                    window.Utils.showSuccess('Tarea actualizada con éxito');
                }
            }
        } catch (error) {
            console.error('Error updating task:', error);
            
            // Solo mostrar mensaje de error si NO estamos en el dashboard
            if (!window.DashboardManager) {
                if (window.Utils) {
                    window.Utils.showError('No se pudo actualizar la tarea. Por favor, intenta de nuevo.');
                } else {
                    alert('No se pudo actualizar la tarea. Por favor, intenta de nuevo.');
                }
            }
        }
    },

    /**
     * Eliminar tarea seleccionada
     * @param {Event} e - Evento de confirmación de eliminación
     * @async
     */
    async deleteTask(e) {
        e.preventDefault();
        try {
            await ApiService.deleteTask(this.currentTaskId);
            this.hideDeleteModal();
            // Recargar tareas en el dashboard
            await window.DashboardManager.loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('No se pudo eliminar la tarea. Por favor, intenta de nuevo.');
        }
    },

    /**
     * Vincular eventos del DOM con los métodos del gestor
     */
    bindEvents() {
        // NO hacer bind de eventos si estamos en el dashboard
        // El dashboard maneja sus propios eventos
        if (window.location.pathname.includes('dashboard.html')) {
            console.log('TaskManagement: Saltando bind de eventos porque estamos en dashboard');
            return;
        }
        
        // Eventos para el modal de edición
        const editForm = document.getElementById('edit-task-form');
        const cancelEditBtn = document.getElementById('cancel-edit');
        const editTitleInput = document.getElementById('edit-title');
        const editDetailsInput = document.getElementById('edit-details');

        if (editForm) {
            editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        }
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.hideEditModal());
        }
        if (editTitleInput) {
            editTitleInput.addEventListener('input', () => this.updateCharCounter(editTitleInput, 50));
        }
        if (editDetailsInput) {
            editDetailsInput.addEventListener('input', () => this.updateCharCounter(editDetailsInput, 500));
        }

        // Eventos para el modal de eliminación
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        const cancelDeleteBtn = document.getElementById('cancel-delete');

        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', (e) => this.deleteTask(e));
        }
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        }
    },

    /**
     * Inicializar el gestor de tareas
     */
    init() {
        this.bindEvents();
    }
};

// Inicializar el manejo de tareas
document.addEventListener('DOMContentLoaded', () => {
    TaskManagement.init();
    // Hacer disponible globalmente
    window.TaskManagement = TaskManagement;
});