document.getElementById("reset-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;

  // Mostrar alerta de simulación
  alert(`📩 Si el correo ${email} está registrado, recibirás un enlace para restablecer tu contraseña.`);

  // Limpiar el formulario
  this.reset();
});