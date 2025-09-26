/**
 * @fileoverview Gestor del perfil de usuario - Edición y eliminación de cuenta
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

/**
 * Clase que maneja la funcionalidad del perfil de usuario
 * Permite ver, editar y eliminar la cuenta del usuario
 * @class ProfileManager
 */
class ProfileManager {
    /**
     * Constructor del gestor de perfil
     * Inicializa referencias DOM y configura eventos
     */
    constructor() {
        /** @type {Object} Referencia al servicio de API */
        this.apiService = window.ApiService;
        
        /** @type {HTMLFormElement} Formulario de perfil */
        this.profileForm = document.getElementById('profile-form');
        
        /** @type {HTMLElement} Contenedor de información del perfil */
        this.profileInfo = document.querySelector('.profile-info');
        
        /** @type {HTMLButtonElement} Botón para editar perfil */
        this.editButton = document.getElementById('edit-profile');
        
        /** @type {HTMLButtonElement} Botón para guardar cambios */
        this.saveButton = document.getElementById('save-profile');
        
        /** @type {HTMLButtonElement} Botón para cancelar edición */
        this.cancelButton = document.getElementById('cancel-edit');
        
        /** @type {HTMLButtonElement} Botón para eliminar cuenta */
        this.deleteButton = document.getElementById('delete-account');
        
        /** @type {boolean} Indica si está en modo edición */
        this.editMode = false;

        this.initializeEventListeners();
        this.loadUserProfile();
    }

    /**
     * Configurar todos los event listeners del perfil
     */
    initializeEventListeners() {
        this.editButton?.addEventListener('click', () => this.enableEditMode());
        this.saveButton?.addEventListener('click', () => this.saveProfile());
        this.cancelButton?.addEventListener('click', () => this.cancelEdit());
        this.deleteButton?.addEventListener('click', () => this.confirmDeleteAccount());
        this.profileForm?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
     * Cargar perfil del usuario desde la API
     * @async
     */
    async loadUserProfile() {
        try {
            this.showLoading();
            const profile = await this.apiService.getProfile();
            this.updateProfileDisplay(profile);
            this.disableEditMode();
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Error al cargar el perfil: ' + error.message);
        }
    }

    /**
     * Actualizar la visualización del perfil en la interfaz
     * @param {Object} profile - Datos del perfil del usuario
     * @param {string} profile.name - Nombre del usuario
     * @param {string} profile.lastname - Apellido del usuario
     * @param {string} profile.email - Email del usuario
     * @param {number} profile.age - Edad del usuario
     * @param {string} profile.createdAt - Fecha de creación de la cuenta
     */
    updateProfileDisplay(profile) {
        // Actualizar campos del formulario
        document.getElementById('name').value = profile.name || '';
        document.getElementById('lastname').value = profile.lastname || '';
        document.getElementById('email').value = profile.email || '';
        document.getElementById('age').value = profile.age || '';

        // Actualizar vista de información
        document.getElementById('display-name').textContent = profile.name || '';
        document.getElementById('display-lastname').textContent = profile.lastname || '';
        document.getElementById('display-email').textContent = profile.email || '';
        document.getElementById('display-age').textContent = profile.age || '';
        document.getElementById('display-created').textContent = new Date(profile.createdAt).toLocaleDateString();
    }

    /**
     * Activar modo de edición del perfil
     */
    enableEditMode() {
        this.editMode = true;
        if (this.profileForm) this.profileForm.style.display = 'grid';
        if (this.profileInfo) this.profileInfo.style.display = 'none';
        if (this.editButton) this.editButton.style.display = 'none';
    }

    /**
     * Desactivar modo de edición del perfil
     */
    disableEditMode() {
        this.editMode = false;
        if (this.profileForm) this.profileForm.style.display = 'none';
        if (this.profileInfo) this.profileInfo.style.display = 'block';
        if (this.editButton) this.editButton.style.display = 'inline-block';
    }

    /**
     * Cancelar edición y restaurar datos originales
     */
    cancelEdit() {
        this.profileForm.reset();
        this.disableEditMode();
        this.loadUserProfile();
    }

    /**
     * Manejar envío del formulario de perfil
     * @param {Event} event - Evento de envío del formulario
     * @async
     */
    async handleSubmit(event) {
        event.preventDefault();
        await this.saveProfile();
    }

    /**
     * Guardar cambios del perfil en el servidor
     * @async
     */
    async saveProfile() {
        try {
            if (!this.validateForm()) return;
            
            const formData = new FormData(this.profileForm);
            const profileData = {
                name: formData.get('name'),
                lastname: formData.get('lastname'),
                email: formData.get('email'),
                age: parseInt(formData.get('age'))
            };

            this.showLoading();
            const updatedProfile = await this.apiService.updateProfile(profileData);
            this.updateProfileDisplay(updatedProfile);
            this.disableEditMode();
            this.hideLoading();
            this.showSuccess('Perfil actualizado con éxito');
        } catch (error) {
            this.hideLoading();
            this.showError('Error al actualizar el perfil');
            console.error('Error updating profile:', error);
        }
    }

    /**
     * Validar formulario de perfil
     * @returns {boolean} True si es válido, false en caso contrario
     */
    validateForm() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const lastname = document.getElementById('lastname').value;
        const age = document.getElementById('age').value;

        if (!emailRegex.test(email)) {
            this.showError('Por favor ingrese un email válido');
            return false;
        }

        if (name.trim().length < 2) {
            this.showError('El nombre debe tener al menos 2 caracteres');
            return false;
        }

        if (lastname.trim().length < 2) {
            this.showError('El apellido debe tener al menos 2 caracteres');
            return false;
        }

        if (age < 13) {
            this.showError('La edad debe ser mayor a 13 años');
            return false;
        }

        return true;
    }

    /**
     * Mostrar pantalla de carga
     */
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'flex';
    }

    /**
     * Ocultar pantalla de carga
     */
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }

    /**
     * Mostrar mensaje de error
     * @param {string} message - Mensaje de error a mostrar
     */
    showError(message) {
        alert(message);
    }

    /**
     * Mostrar mensaje de éxito
     * @param {string} message - Mensaje de éxito a mostrar
     */
    showSuccess(message) {
        alert(message);
    }

    /**
     * Mostrar confirmación antes de eliminar cuenta
     */
    confirmDeleteAccount() {
        // Crear un modal de confirmación personalizado
        const modal = this.createDeleteConfirmationModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    /**
     * Crear modal de confirmación para eliminación de cuenta
     * @returns {HTMLElement} Elemento modal de confirmación
     */
    createDeleteConfirmationModal() {
        const modal = document.createElement('div');
        modal.className = 'delete-confirmation-modal';
        modal.innerHTML = `
            <div class="delete-modal-content">
                <div class="delete-modal-header">
                    <h3>⚠️ Confirmar Eliminación de Cuenta</h3>
                </div>
                <div class="delete-modal-body">
                    <p><strong>¿Estás seguro de que deseas eliminar tu cuenta?</strong></p>
                    <p>Esta acción es <strong>irreversible</strong> y eliminará:</p>
                    <ul>
                        <li>Tu perfil personal</li>
                        <li>Todas tus tareas guardadas</li>
                        <li>Todo tu historial en la aplicación</li>
                    </ul>
                    <p>No podrás recuperar esta información una vez eliminada.</p>
                </div>
                <div class="delete-modal-actions">
                    <button class="btn btn-secondary" id="cancel-delete">Cancelar</button>
                    <button class="btn btn-danger" id="confirm-delete">Sí, Eliminar Cuenta</button>
                </div>
            </div>
        `;

        // Agregar event listeners
        modal.querySelector('#cancel-delete').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#confirm-delete').addEventListener('click', async () => {
            modal.remove();
            await this.deleteAccount();
        });

        // Cerrar modal al hacer click fuera de él
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        return modal;
    }

    /**
     * Eliminar cuenta de usuario de forma permanente
     * @async
     */
    async deleteAccount() {
        try {
            this.showLoading();
            
            // Obtener el ID del usuario actual desde el perfil
            const profile = await this.apiService.getProfile();
            console.log('Usuario a eliminar:', profile);
            
            // Llamar al endpoint de eliminación real
            const result = await this.apiService.deleteUser(profile.id);
            console.log('Resultado eliminación:', result);
            
            this.hideLoading();
            
            // Mostrar mensaje de confirmación
            alert('✅ Cuenta eliminada permanentemente.\n\n' + 
                  '• Tu perfil ha sido eliminado\n' + 
                  '• Todas tus tareas han sido eliminadas\n' +
                  '• No podrás volver a acceder con estas credenciales\n\n' +
                  'Serás redirigido al inicio.');
            
            // Limpiar cualquier dato local y redirigir
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirigir al login
            window.location.href = 'auth.html';
            
        } catch (error) {
            this.hideLoading();
            console.error('Error deleting account:', error);
            
            if (error.message.includes('Failed to fetch')) {
                this.showError('No se puede conectar con el servidor para eliminar la cuenta.');
            } else {
                this.showError('Error al eliminar la cuenta: ' + error.message);
            }
        }
    }
}

// Inicializar el gestor de perfil cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando ProfileManager...');
    try {
        // Dar tiempo para que se carguen todos los scripts
        setTimeout(() => {
            new ProfileManager();
            new Sidebar();
        }, 100);
    } catch (error) {
        console.error('Error inicializando ProfileManager:', error);
        alert('Error al inicializar el perfil. Por favor, recarga la página.');
    }
});
