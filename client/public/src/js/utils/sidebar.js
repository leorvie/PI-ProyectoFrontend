/**
 * @fileoverview Funcionalidad del sidebar de navegación
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

/**
 * Clase que maneja la funcionalidad del sidebar de navegación,
 * incluyendo navegación móvil, logout y carga de información del usuario
 * @class Sidebar
 */
class Sidebar {
    /**
     * Constructor de la clase Sidebar
     * Inicializa automáticamente todos los event listeners y funcionalidades
     */
    constructor() {
        this.init();
    }

    /**
     * Inicializar todas las funcionalidades del sidebar
     */
    init() {
        this.setupEventListeners();
        this.loadUserInfo();
        this.handleMobileMenu();
    }

    /**
     * Configurar todos los event listeners del sidebar
     * Incluye botones de logout, menú móvil, overlay y elementos de navegación
     */
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // Mobile menu button
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Sidebar overlay
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', this.closeMobileMenu.bind(this));
        }

        // Close mobile menu when clicking nav items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    /**
     * Cargar información del usuario desde la API y actualizar el sidebar
     * @async
     */
    async loadUserInfo() {
        try {
            const userData = await window.ApiService.getProfile();
            this.updateUserInfo(userData.username || userData.email || 'Usuario');
        } catch (error) {
            console.error('Error loading user info:', error);
            // Si hay error de autenticación, redirigir a auth
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                window.location.href = '/auth.html';
            } else {
                this.updateUserInfo('Usuario');
            }
        }
    }

    /**
     * Actualizar la información del usuario mostrada en el sidebar
     * @param {string} username - Nombre de usuario a mostrar
     */
    updateUserInfo(username) {
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement) {
            userInfoElement.textContent = `¡Hola, ${username}!`;
        }
    }

    /**
     * Manejar el proceso de cierre de sesión del usuario
     * Limpia datos locales y redirige a la página de autenticación
     * @async
     */
    async handleLogout() {
        try {
            // Usar el ApiService en lugar de fetch directo
            await window.ApiService.logout();
            
            // Limpiar cualquier dato local si es necesario
            localStorage.clear();
            sessionStorage.clear();
            
            // Redirigir a la página de login con parámetro para mostrar mensaje
            window.location.href = '/auth.html?logout=true';
        } catch (error) {
            console.error('Error during logout:', error);
            // En caso de error, aún así redirigir
            window.location.href = '/auth.html?logout=true';
        }
    }

    /**
     * Alternar la visibilidad del menú móvil
     * Añade/remueve las clases CSS necesarias para mostrar u ocultar el menú
     */
    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
        }
    }

    /**
     * Cerrar el menú móvil
     * Remueve las clases CSS que mantienen el menú visible
     */
    closeMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    }

    /**
     * Configurar event listeners adicionales para el manejo del menú móvil
     * Incluye cierre automático en redimensionamiento y tecla Escape
     */
    handleMobileMenu() {
        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Marcar el elemento activo del menú de navegación
     * @param {string} currentPage - Nombre de la página actual para marcar como activa
     */
    setActiveNavItem(currentPage) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            
            const href = item.getAttribute('href');
            if (href && href.includes(currentPage)) {
                item.classList.add('active');
            }
        });
    }
}

// Auto-inicializar el sidebar si existe
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        new Sidebar();
    }
});

// Exportar para uso en otros archivos
window.Sidebar = Sidebar;