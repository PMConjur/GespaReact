export const validateUsername = (
  inputElement,
  feedbackElement,
  validFeedbackElement
) => {
  const value = inputElement.value;
  const regex = /^[A-Z]{4}$/; // Expresión regular para exactamente 4 letras mayúsculas

  if (!regex.test(value)) {
    inputElement.classList.remove("is-valid");
    inputElement.classList.add("is-invalid");
    feedbackElement.style.display = "block";
    validFeedbackElement.style.display = "none";
  } else {
    inputElement.classList.remove("is-invalid");
    inputElement.classList.add("is-valid");
    feedbackElement.style.display = "none";
    validFeedbackElement.style.display = "block";
  }
};

export const sanitizeUsername = (inputElement) => {
  inputElement.value = inputElement.value.replace(/[^A-Z]/g, ""); // Solo permite mayúsculas
};
