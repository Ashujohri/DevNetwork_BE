const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstname, lastname, email, password } = req?.body;
  if (!firstname || !lastname) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter strong password");
  }
};

const validateProfileEditData = (req) => {
  const allowedField = [
    "firstname",
    "lastname",
    "age",
    "gender",
    "about",
    "photoUrl",
    "skills",
  ];
  const isAllowedField = Object.keys(req.body).every((item) =>
    allowedField.includes(item)
  );

  return isAllowedField;
};

module.exports = { validateSignUpData, validateProfileEditData };
