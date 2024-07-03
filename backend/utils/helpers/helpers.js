export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password) {
  const minLength = 8;
  const hasNumeric = /\d/; // Checks for at least one digit
  const hasNonNumeric = /\D/; // Checks for at least one non-digit

  let message = "";

  if (password.length < minLength) {
    message = "Password should be at least 8 characters long";
  } else if (!hasNumeric.test(password)) {
    message = "Password should contain at least one numeric character";
  } else if (!hasNonNumeric.test(password)) {
    message = "Password should contain at least one non-numeric character";
  }

  return {
    isValid: message === "",
    message: message || "Password is valid",
  };
}
