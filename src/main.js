// Importa los estilos globales
import './css/style.css';

// 🔑 Verificar si el usuario está logueado
function checkAuth() {
  const token = localStorage.getItem('token');
  const nav = document.querySelector('nav');

  if (!nav) return; // si no hay menú en esta página, no hace nada

  // Buscar enlaces existentes
  const loginLink = nav.querySelector('a[href="./views/login.html"]');
  const registerLink = nav.querySelector('a[href="./views/register.html"]');

  // Eliminar un botón de logout previo (si existe, para no duplicar)
  const oldLogout = nav.querySelector('#logoutLink');
  if (oldLogout) oldLogout.remove();

  if (token) {
    // Si hay token → ocultar login/register y mostrar logout
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';

    const logoutBtn = document.createElement('a');
    logoutBtn.href = "#";
    logoutBtn.id = "logoutLink";
    logoutBtn.textContent = "🚪 Logout";

    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token'); // borrar token
      alert("Session closed");
      window.location.href = "./index.html"; // recargar a Home
    });

    nav.appendChild(logoutBtn);

  } else {
    // Si no hay token → mostrar login/register
    if (loginLink) loginLink.style.display = 'inline';
    if (registerLink) registerLink.style.display = 'inline';
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  console.log('✅ DS2 Task Manager frontend initialized');
});
