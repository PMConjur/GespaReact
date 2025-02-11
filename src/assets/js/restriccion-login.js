export function TimerPassword(passwordInput) {
  let timeoutId = null;

  passwordInput.addEventListener("input", function (event) {
    const realValue = event.target.value;

    // Si hay un timeout anterior, lo cancela para que no espere
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Muestra temporalmente el carácter ingresado
    passwordInput.type = "text";
    passwordInput.value = realValue;

    // Establece el nuevo timeout para enmascarar después de un corto tiempo
    timeoutId = setTimeout(() => {
      passwordInput.value = "•".repeat(realValue.length); // Enmascarar la contraseña
      passwordInput.type = "password"; // Regresar el tipo a password
    }, 150); // El tiempo que el carácter se mantiene visible (en milisegundos)
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("yourPassword");
  if (passwordInput) {
    TimerPassword(passwordInput);
  }
});
