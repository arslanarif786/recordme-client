import EventBus from "../js/EventBus";
export const showErrorMessage = (error) => {
  let message = error?.response?.data?.message;
  const errors = error?.response?.data?.errors;
  if (errors && typeof errors === "object") {
    const errorKeys = Object.keys(errors);
    if (errorKeys[0]) {
      const errorKey = errorKeys[0];
      if (errors[errorKey][0]) message = errors[errorKey][0];
    }
  }
  EventBus.$emit("show-notification-bar", {
    type: "error",
    message: message ? message : "Error Occurred",
  });
};

export const showSimpleErrorMessage = (errorMessage) => {
  EventBus.$emit("show-notification-bar", {
    type: "error",
    message: errorMessage,
  });
};

export const showNotificationBar = (type, message) => {
  EventBus.$emit("show-notification-bar", {
    type,
    message,
  });
};