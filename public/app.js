const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieButtons = document.querySelectorAll("[data-accept-cookies]");
const emailForm = document.querySelector("[data-email-form]");
const passwordForm = document.querySelector("[data-password-form]");
const passwordToggle = document.querySelector("[data-toggle-password]");

document.querySelectorAll("[data-field] input").forEach((input) => {
  syncFieldState(input);
  input.addEventListener("input", () => syncFieldState(input));
});

cookieButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cookieBanner?.classList.add("is-hidden");
  });
});

emailForm?.addEventListener("submit", (event) => {
  const input = emailForm.querySelector("#email");
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

  if (!isValid) {
    event.preventDefault();
    showError(input, "Enter a valid email.");
    input.focus();
    return;
  }

  clearError(input);
});

passwordForm?.addEventListener("submit", (event) => {
  const input = passwordForm.querySelector("#password");

  if (!input.value.trim()) {
    event.preventDefault();
    showError(input, "Enter your password.");
    input.focus();
    return;
  }

  clearError(input);
});

passwordToggle?.addEventListener("click", () => {
  const input = document.querySelector("#password");
  const isShowing = input.type === "text";

  input.type = isShowing ? "password" : "text";
  passwordToggle.setAttribute("aria-pressed", String(!isShowing));
  passwordToggle.setAttribute("aria-label", isShowing ? "Show password" : "Hide password");
});

function syncFieldState(input) {
  input.closest("[data-field]")?.classList.toggle("has-value", input.value.length > 0);
}

function showError(input, message) {
  const field = input.closest("[data-field]");
  const error = document.getElementById(input.getAttribute("aria-describedby"));

  field?.classList.add("is-invalid");
  if (error) error.textContent = message;
}

function clearError(input) {
  const field = input.closest("[data-field]");
  const error = document.getElementById(input.getAttribute("aria-describedby"));

  field?.classList.remove("is-invalid");
  if (error) error.textContent = "";
}
