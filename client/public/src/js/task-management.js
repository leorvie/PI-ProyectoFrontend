// Funciones para manejo de tareas
const TaskManagement = {
    currentTaskId: null,

    showEditModal(task) {
        const modal = document.getElementById('edit-task-modal');
        const form = document.getElementById('edit-task-form');
        const titleInput = document.getElementById('edit-title');
        const detailsInput = document.getElementById('edit-details');
        const statusInput = document.getElementById('edit-status');

        this.currentTaskId = task._id;
        titleInput.value = task.title;
        detailsInput.value = task.details || '';
        statusInput.value = task.status;

        // Actualizar contadores de caracteres
        this.updateCharCounter(titleInput, 50);
        this.updateCharCounter(detailsInput, 500);

        modal.style.display = 'flex';
    },

    hideEditModal() {
        const modal = document.getElementById('edit-task-modal');
        modal.style.display = 'none';
        this.currentTaskId = null;
    },

    showDeleteModal(taskId) {
        const modal = document.getElementById('delete-task-modal');
        this.currentTaskId = taskId;
        modal.style.display = 'flex';
    },

    hideDeleteModal() {
        const modal = document.getElementById('delete-task-modal');
        modal.style.display = 'none';
        this.currentTaskId = null;
    },

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

    async handleEditSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const taskData = {
            title: formData.get('title'),
            details: formData.get('details'),
            status: formData.get('status')
        };

      
    },

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

    bindEvents() {
        // Eventos para el modal de edición
        const editForm = document.getElementById('edit-task-form');
        const cancelEditBtn = document.getElementById('cancel-edit');
        const editTitleInput = document.getElementById('edit-title');
        const editDetailsInput = document.getElementById('edit-details');

        editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        cancelEditBtn.addEventListener('click', () => this.hideEditModal());
        editTitleInput.addEventListener('input', () => this.updateCharCounter(editTitleInput, 50));
        editDetailsInput.addEventListener('input', () => this.updateCharCounter(editDetailsInput, 500));

        // Eventos para el modal de eliminación
        const confirmDeleteBtn = document.getElementById('confirm-delete');
        const cancelDeleteBtn = document.getElementById('cancel-delete');

        confirmDeleteBtn.addEventListener('click', (e) => this.deleteTask(e));
        cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
    },

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