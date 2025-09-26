/**
 * @fileoverview Manejo de creación de tareas - Formulario y validaciones
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', async () => {
    /**
     * Gestor para la creación de nuevas tareas
     * Maneja formulario, validaciones y contadores de caracteres
     * @namespace CreateTaskManager
     */
    const CreateTaskManager = {
        /**
         * Inicializar el gestor de creación de tareas
         * Verifica autenticación y configura eventos
         * @async
         */
        async init() {
            // Verificar autenticación
            const isAuthenticated = await Utils.checkAuth();
            if (!isAuthenticated) return;

            this.bindEvents();
            this.setupCharCounters();
        },

        /**
         * Configurar todos los event listeners del formulario de creación de tareas
         * Incluye validación en tiempo real y botones de navegación
         */
        bindEvents() {
            const taskForm = document.getElementById('task-form');
            const cancelBtn = document.getElementById('cancel-btn');
            const goDashboardBtn = document.getElementById('go-dashboard');
            const createAnotherBtn = document.getElementById('create-another');
            
            // Elementos del formulario para validación
            const titleInput = document.getElementById('task-title');
            const dateInput = document.getElementById('task-date');
            const timeInput = document.getElementById('task-time');
            const statusInput = document.getElementById('task-status');
            const submitBtn = taskForm.querySelector('button[type="submit"]');
            
            taskForm.addEventListener('submit', (e) => this.handleSubmit(e));
            cancelBtn.addEventListener('click', () => this.handleCancel());
            goDashboardBtn.addEventListener('click', () => this.goToDashboard());
            createAnotherBtn.addEventListener('click', () => this.createAnother());
            
            // Agregar eventos de validación en tiempo real
            [titleInput, dateInput, timeInput, statusInput].forEach(input => {
                if (input) {
                    input.addEventListener('input', () => this.validateForm());
                    input.addEventListener('change', () => this.validateForm());
                }
            });
            
            // Validación inicial
            this.validateForm();
        },

        /**
         * Validar formulario y habilitar/deshabilitar botón de envío
         * Verifica que todos los campos obligatorios estén completos y válidos
         */
        validateForm() {
            const titleInput = document.getElementById('task-title');
            const dateInput = document.getElementById('task-date');
            const timeInput = document.getElementById('task-time');
            const statusInput = document.getElementById('task-status');
            const submitBtn = document.querySelector('#task-form button[type="submit"]');
            
            if (!submitBtn) return;
            
            // Validar título (obligatorio y no vacío)
            const hasValidTitle = titleInput && titleInput.value.trim().length > 0 && titleInput.value.length <= 50;
            
            // Validar fecha (obligatoria)
            const hasValidDate = dateInput && dateInput.value.trim().length > 0;
            
            // Validar hora (obligatoria)
            const hasValidTime = timeInput && timeInput.value.trim().length > 0;
            
            // Validar estado (obligatorio)
            const hasValidStatus = statusInput && statusInput.value.trim().length > 0;
            
            // Habilitar botón solo si los campos básicos son válidos (sin validar fecha pasada)
            const isFormValid = hasValidTitle && hasValidDate && hasValidTime && hasValidStatus;
            
            submitBtn.disabled = !isFormValid;
            
            // Actualizar estilos visuales
            if (isFormValid) {
                submitBtn.textContent = 'Crear Tarea';
                submitBtn.title = '';
            } else {
                submitBtn.textContent = 'Completar campos requeridos';
                submitBtn.title = 'Título, fecha, hora y estado son obligatorios';
            }
        },

        /**
         * Configurar contadores de caracteres para los campos de texto
         * Muestra el límite de caracteres en tiempo real para título y descripción
         */
        setupCharCounters() {
            const titleInput = document.getElementById('task-title');
            const detailsInput = document.getElementById('task-details');
            
            if (titleInput) {
                titleInput.addEventListener('input', () => {
                    this.updateCharCounter(titleInput, 50);
                    this.validateForm(); // Revalidar cuando cambie el título
                });
            }
            
            if (detailsInput) {
                detailsInput.addEventListener('input', () => {
                    this.updateCharCounter(detailsInput, 500);
                });
            }
        },

        /**
         * Actualizar contador de caracteres de un campo de texto
         * Cambia el color cuando se acerca al límite
         * @param {HTMLInputElement|HTMLTextAreaElement} input - Campo de texto a monitorear
         * @param {number} maxLength - Límite máximo de caracteres
         */
        updateCharCounter(input, maxLength) {
            const counter = input.parentElement.querySelector('.char-counter');
            const currentLength = input.value.length;
            counter.textContent = `${currentLength}/${maxLength} caracteres`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ff6b6b';
            } else {
                counter.style.color = '#747bff';
            }
        },

        /**
         * Manejar envío del formulario de creación de tarea
         * Valida datos, procesa fecha/hora y envía la tarea a la API
         * @async
         * @param {Event} e - Evento de submit del formulario
         */
        async handleSubmit(e) {
            e.preventDefault();
            Utils.clearError('task-error');

            const formData = new FormData(e.target);
            const taskData = Object.fromEntries(formData);

            // Procesar correctamente la fecha si existe
            if (taskData.date) {
                const timeValue = document.getElementById('task-time').value || '00:00';
                
                // Crear fecha con hora seleccionada
                const selectedDate = new Date(taskData.date + 'T' + timeValue);
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Comparar solo fecha sin hora
                
                const selectedDateWithoutTime = new Date(selectedDate);
                selectedDateWithoutTime.setHours(0, 0, 0, 0);
                
                if (selectedDateWithoutTime < today) {
                    Utils.showError('La fecha de vencimiento no puede ser anterior a hoy');
                    return;
                }
                
                taskData.date = selectedDate.toISOString();
                console.log('Fecha con hora formateada para envío:', taskData.date);
                
                // Eliminar el campo time que no necesitamos enviar al backend
                delete taskData.time;
            }
            
            // Validaciones básicas
            if (!taskData.title.trim()) {
                Utils.showError('task-error', 'El título es obligatorio');
                return;
            }

            if (taskData.title.length > 50) {
                Utils.showError('task-error', 'El título no puede exceder 50 caracteres');
                return;
            }

            if (taskData.details.length > 500) {
                Utils.showError('task-error', 'La descripción no puede exceder 500 caracteres');
                return;
            }

            try {
                console.log('Creating task:', taskData);
                await ApiService.createTask(taskData);
                
                // Mostrar modal de éxito
                this.showSuccessModal();
                
                // Limpiar formulario
                e.target.reset();
                this.updateCharCounter(document.getElementById('task-title'), 50);
                this.updateCharCounter(document.getElementById('task-details'), 500);
                
            } catch (error) {
                console.error('Error creating task:', error);
                Utils.showError('task-error', error.message || 'Error al crear la tarea');
            }
        },

        /**
         * Manejar cancelación del formulario
         * Verifica cambios no guardados antes de salir
         */
        handleCancel() {
            if (this.hasUnsavedChanges()) {
                if (confirm('¿Estás seguro? Se perderán los cambios no guardados.')) {
                    this.goToDashboard();
                }
            } else {
                this.goToDashboard();
            }
        },

        /**
         * Verificar si hay cambios no guardados en el formulario
         * @returns {boolean} True si hay cambios, false en caso contrario
         */
        hasUnsavedChanges() {
            const title = document.getElementById('task-title').value.trim();
            const details = document.getElementById('task-details').value.trim();
            return title || details;
        },

        /**
         * Mostrar modal de éxito después de crear la tarea
         */
        showSuccessModal() {
            const modal = document.getElementById('success-modal');
            modal.style.display = 'flex';
        },

        /**
         * Ocultar modal de éxito
         */
        hideSuccessModal() {
            const modal = document.getElementById('success-modal');
            modal.style.display = 'none';
        },

        /**
         * Navegar al dashboard principal
         */
        goToDashboard() {
            Utils.navigateTo('/dashboard.html');
        },

        /**
         * Crear otra tarea - oculta modal y enfoca el primer campo
         */
        createAnother() {
            this.hideSuccessModal();
            // El formulario ya fue limpiado, solo enfocar el primer campo
            document.getElementById('task-title').focus();
        }
    };

    // Inicializar CreateTaskManager
    await CreateTaskManager.init();
});