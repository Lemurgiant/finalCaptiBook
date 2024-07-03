export const positiveNumberCheck = (num, fieldName) => {
  if (num === undefined || num === null) {
    return `${fieldName} missing from request body`;
  } else if (typeof num !== "number" || isNaN(num)) {
    return `${fieldName} must be a number`;
  } else if (num <= 0) {
    return `${fieldName} must be greater than zero`;
  }
};

const basicPresenceCheck = (fields) => {
  const errors = [];

  fields.forEach((field, index) => {
    if (field.value === undefined || field.value === null) {
      errors.push(`${field.name} is required`);
    }
  });

  return errors;
};
