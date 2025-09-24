

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgot-form");
  const successMsg = document.getElementById("forgot-success");
  const errorMsg = document.getElementById("forgot-error");

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
