

/**
 * @fileoverview Funcionalidad para recuperación de contraseña
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLFormElement} Formulario de recuperación de contraseña */
  const form = document.getElementById("forgot-form");
  
  /** @type {HTMLElement} Elemento para mostrar mensajes de éxito */
  const successMsg = document.getElementById("forgot-success");
  
  /** @type {HTMLElement} Elemento para mostrar mensajes de error */
  const errorMsg = document.getElementById("forgot-error");

  /**
   * Manejar envío del formulario de recuperación de contraseña
   * @param {Event} e - Evento de submit del formulario
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    successMsg.textContent = "";
    errorMsg.textContent = "";

    const email = document.getElementById("email").value;

    try {
  const res = await window.ApiService.forgotPassword(email);
      successMsg.textContent = res.message || "Revisa tu correo para el enlace de recuperación.";
    } catch (err) {
      errorMsg.textContent = err.message || "Error al enviar el correo.";
    }
  });
});
