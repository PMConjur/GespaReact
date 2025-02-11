document.addEventListener("DOMContentLoaded", function () {
  const bankDropdown = document.getElementById("bankDropdown");

  // Simulación de datos de bancos
  const banks = [
    { id: 1, name: "Banamex" },
    { id: 2, name: "América Express" },
    { id: 3, name: "Bancomer" },
    { id: 4, name: "Santander" },
    { id: 5, name: "HSBC" },
  ];

  // Llenar el dropdown con las carteras (bancos)
  banks.forEach(function (bank) {
    const option = document.createElement("option");
    option.value = bank.id; // Valor asociado a la opción
    option.textContent = bank.name; // Texto visible para el usuario
    bankDropdown.appendChild(option); // Añadir la opción al dropdown
  });
});
