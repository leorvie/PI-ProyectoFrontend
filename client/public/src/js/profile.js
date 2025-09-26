/**
 * @fileoverview Módulo de gestión de perfiles de usuario
 * @description Maneja la funcionalidad completa del perfil de usuario incluyendo
 * visualización, edición, actualización y eliminación de cuentas
 * @author Proyecto Frontend
 * @version 1.0.0
 * @namespace ProfileManager
 */

/**
 * Clase para manejar todas las operaciones relacionadas con el perfil del usuario
 * @class ProfileManager
 * @description Gestiona la visualización, edición y eliminación del perfil de usuario
 */
class ProfileManager {
    /**
     * Constructor de la clase ProfileManager
     * @constructor
     * @description Inicializa el gestor de perfiles y configura los elementos del DOM
     */
    constructor() {
        this.apiService = ApiService;
        
        this.profileForm = document.getElementById('profile-form');
        this.profileInfo = document.querySelector('.profile-info');
        this.editButton = document.getElementById('edit-profile');
        this.saveButton = document.getElementById('save-profile');
        this.cancelButton = document.getElementById('cancel-edit');
        this.deleteButton = document.getElementById('delete-account');
        this.editMode = false;

        this.initializeEventListeners();
        this.loadUserProfile();
    }

    /**
     * Inicializa todos los event listeners del perfil
     * @method initializeEventListeners
     * @description Configura los manejadores de eventos para botones y formularios
     */
    initializeEventListeners() {
        this.editButton?.addEventListener('click', () => this.enableEditMode());
        this.saveButton?.addEventListener('click', () => this.saveProfile());
        this.cancelButton?.addEventListener('click', () => this.cancelEdit());
        this.deleteButton?.addEventListener('click', () => this.confirmDeleteAccount());
        this.profileForm?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
     * Carga el perfil del usuario desde la API
     * @async
     * @method loadUserProfile
     * @description Obtiene los datos del perfil del usuario y actualiza la interfaz
     * @returns {Promise<void>} Promesa que se resuelve cuando el perfil se ha cargado
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
     * Actualiza la visualización del perfil en el DOM
     * @method updateProfileDisplay
     * @description Actualiza tanto los campos del formulario como la vista de información
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
     * Habilita el modo de edición del perfil
     * @method enableEditMode
     * @description Muestra el formulario de edición y oculta la vista de información
     */
    enableEditMode() {
        this.editMode = true;
        if (this.profileForm) this.profileForm.style.display = 'grid';
        if (this.profileInfo) this.profileInfo.style.display = 'none';
        if (this.editButton) this.editButton.style.display = 'none';
    }

    /**
     * Deshabilita el modo de edición del perfil
     * @method disableEditMode
     * @description Oculta el formulario de edición y muestra la vista de información
     */
    disableEditMode() {
        this.editMode = false;
        if (this.profileForm) this.profileForm.style.display = 'none';
        if (this.profileInfo) this.profileInfo.style.display = 'block';
        if (this.editButton) this.editButton.style.display = 'inline-block';
    }

    /**
     * Cancela la edición del perfil
     * @method cancelEdit
     * @description Resetea el formulario, sale del modo edición y recarga los datos originales
     */
    cancelEdit() {
        this.profileForm.reset();
        this.disableEditMode();
        this.loadUserProfile();
    }

    /**
     * Maneja el evento de envío del formulario
     * @async
     * @method handleSubmit
     * @description Previene el comportamiento por defecto del formulario y guarda el perfil
     * @param {Event} event - Evento de envío del formulario
     * @returns {Promise<void>} Promesa que se resuelve cuando se ha manejado el envío
     */
    async handleSubmit(event) {
        event.preventDefault();
        await this.saveProfile();
    }

    /**
     * Guarda los cambios del perfil del usuario
     * @async
     * @method saveProfile
     * @description Valida el formulario, envía los datos a la API y actualiza la interfaz
     * @returns {Promise<void>} Promesa que se resuelve cuando el perfil se ha guardado
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
     * Valida los datos del formulario de perfil
     * @method validateForm
     * @description Verifica que todos los campos cumplan con los requisitos mínimos
     * @returns {boolean} True si el formulario es válido, false en caso contrario
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
     * Muestra la pantalla de carga
     * @method showLoading
     * @description Hace visible el elemento de pantalla de carga
     */
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'flex';
    }

    /**
     * Oculta la pantalla de carga
     * @method hideLoading
     * @description Oculta el elemento de pantalla de carga
     */
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) loadingScreen.style.display = 'none';
    }

    /**
     * Muestra un mensaje de error al usuario
     * @method showError
     * @description Presenta un mensaje de error usando alert
     * @param {string} message - Mensaje de error a mostrar
     */
    showError(message) {
        alert(message);
    }

    /**
     * Muestra un mensaje de éxito al usuario
     * @method showSuccess
     * @description Presenta un mensaje de éxito usando alert
     * @param {string} message - Mensaje de éxito a mostrar
     */
    showSuccess(message) {
        alert(message);
    }

    /**
     * Confirma la eliminación de la cuenta del usuario
     * @method confirmDeleteAccount
     * @description Muestra un modal de confirmación para eliminar la cuenta
     */
    confirmDeleteAccount() {
        // Crear un modal de confirmación personalizado
        const modal = this.createDeleteConfirmationModal();
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }

    /**
     * Crea el modal de confirmación para eliminar cuenta
     * @method createDeleteConfirmationModal
     * @description Construye y configura el modal con opciones de confirmación
     * @returns {HTMLElement} Elemento del modal de confirmación
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
     * Elimina permanentemente la cuenta del usuario
     * @async
     * @method deleteAccount
     * @description Ejecuta la eliminación de la cuenta, limpia datos locales y redirige al login
     * @returns {Promise<void>} Promesa que se resuelve cuando la cuenta ha sido eliminada
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

/**
 * Inicialización del gestor de perfil
 * @description Se ejecuta cuando el DOM está completamente cargado para inicializar
 * el ProfileManager y el Sidebar con un pequeño retraso para asegurar la carga completa
 */
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
