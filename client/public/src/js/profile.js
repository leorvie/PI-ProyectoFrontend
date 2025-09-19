class ProfileManager {
    constructor() {
        this.apiService = window.ApiService;
        this.profileForm = document.getElementById('profile-form');
        this.profileInfo = document.querySelector('.profile-info');
        this.editButton = document.getElementById('edit-profile');
        this.saveButton = document.getElementById('save-profile');
        this.cancelButton = document.getElementById('cancel-edit');
        this.editMode = false;

        this.initializeEventListeners();
        this.loadUserProfile();
    }

    initializeEventListeners() {
        this.editButton?.addEventListener('click', () => this.enableEditMode());
        this.saveButton?.addEventListener('click', () => this.saveProfile());
        this.cancelButton?.addEventListener('click', () => this.cancelEdit());
        this.profileForm?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async loadUserProfile() {
        try {
            window.Utils.showLoading();
            const profile = await this.apiService.getProfile();
            console.log('Perfil cargado:', profile);  // Debug
            this.updateProfileDisplay(profile);
            this.disableEditMode(); // Asegurar que estamos en modo visualización
            window.Utils.hideLoading();
        } catch (error) {
            window.Utils.hideLoading();
            window.Utils.showErrorMessage('Error al cargar el perfil');
            console.error('Error loading profile:', error);
        }
    }

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

    enableEditMode() {
        this.editMode = true;
        if (this.profileForm) this.profileForm.style.display = 'grid';
        if (this.profileInfo) this.profileInfo.style.display = 'none';
        if (this.editButton) this.editButton.style.display = 'none';
    }

    disableEditMode() {
        this.editMode = false;
        if (this.profileForm) this.profileForm.style.display = 'none';
        if (this.profileInfo) this.profileInfo.style.display = 'block';
        if (this.editButton) this.editButton.style.display = 'inline-block';
    }

    cancelEdit() {
        this.profileForm.reset();
        this.disableEditMode();
        this.loadUserProfile();
    }

    async handleSubmit(event) {
        event.preventDefault();
        await this.saveProfile();
    }

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

            window.Utils.showLoading();
            const updatedProfile = await this.apiService.updateProfile(profileData);
            this.updateProfileDisplay(updatedProfile);
            this.disableEditMode();
            window.Utils.hideLoading();
            window.Utils.showSuccessMessage('Perfil actualizado con éxito');
        } catch (error) {
            window.Utils.hideLoading();
            window.Utils.showErrorMessage('Error al actualizar el perfil');
            console.error('Error updating profile:', error);
        }
    }

    validateForm() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const lastname = document.getElementById('lastname').value;
        const age = document.getElementById('age').value;

        if (!emailRegex.test(email)) {
            showErrorMessage('Por favor ingrese un email válido');
            return false;
        }

        if (name.trim().length < 2) {
            showErrorMessage('El nombre debe tener al menos 2 caracteres');
            return false;
        }

        if (lastname.trim().length < 2) {
            showErrorMessage('El apellido debe tener al menos 2 caracteres');
            return false;
        }

        if (age < 13) {
            showErrorMessage('La edad debe ser mayor a 13 años');
            return false;
        }

        return true;
    }
}

// Inicializar el gestor de perfil cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});
