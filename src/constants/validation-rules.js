const rules = {
  required: (val) => !!val || "Field is required",
  select_field_required: (v) => v.length > 0 || "Field is required",
  password_length: (val) =>
    (val && val.length >= 6) ||
    "The password length must be greater than or equal to 6 characters",
  password_max_length: (val) =>
    (val && val.length < 15) ||
    "The password length must be less than 15 characters",
  workspace_max_length: (val) =>
    (val && val.length <= 30) ||
    "Name must be less than 30 characters",
  email: (val) => {
    if (val) {
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(val) || "Invalid email format";
    }
    return true;
  },
};

export default rules;
