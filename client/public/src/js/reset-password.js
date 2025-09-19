import ApiService from "./services/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-form");
  const successMsg = document.getElementById("reset-success");
  const errorMsg = document.getElementById("reset-error");

  // Obtener el token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  if (!token) {
    errorMsg.textContent = "Token inválido o faltante.";
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    successMsg.textContent = "";
    errorMsg.textContent = "";

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

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
