/**
 * @fileoverview Funcionalidad para restablecer contraseña con token
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */

import ApiService from "./services/api.js";

/**
 * Inicialización del módulo de restablecimiento de contraseña
 * Configura eventos y validaciones del formulario
 */
document.addEventListener("DOMContentLoaded", () => {
  /** @type {HTMLFormElement} Formulario de restablecimiento de contraseña */
  const form = document.getElementById("reset-form");
  
  /** @type {HTMLElement} Elemento para mostrar mensajes de éxito */
  const successMsg = document.getElementById("reset-success");
  
  /** @type {HTMLElement} Elemento para mostrar mensajes de error */
  const errorMsg = document.getElementById("reset-error");

  // Obtener el token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  
  /** @type {string|null} Token de restablecimiento de contraseña */
  const token = urlParams.get("token");

  /**
   * Validar existencia del token en la URL
   * Si no existe, ocultar el formulario y mostrar error
   */
  if (!token) {
    errorMsg.textContent = "Token inválido o faltante.";
    form.style.display = "none";
    return;
  }

  /**
   * Manejar envío del formulario de restablecimiento
   * Valida contraseñas y envía solicitud al servidor
   * @param {Event} e - Evento de envío del formulario
   * @async
   */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    successMsg.textContent = "";
    errorMsg.textContent = "";

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      errorMsg.textContent = "Las contraseñas no coinciden.";
      return;
    }

    try {
      const res = await ApiService.resetPassword(token, password);
      successMsg.textContent = res.message || "Contraseña restablecida correctamente.";
    } catch (err) {
      errorMsg.textContent = err.message || "Error al restablecer la contraseña.";
    }
  });
});
