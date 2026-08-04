const cookieBanner = document.querySelector("[data-cookie-banner]");
const cookieButtons = document.querySelectorAll("[data-accept-cookies]");
const usernameForm = document.querySelector("[data-username-form]");
const passwordForm = document.querySelector("[data-password-form]");
const passwordToggle = document.querySelector("[data-toggle-password]");

cookieButtons.forEach((button) => {
  button.addEventListener("click", () => {
    cookieBanner?.classList.add("is-hidden");
  });
});

usernameForm?.addEventListener("submit", (event) => {
  const input = usernameForm.querySelector("#username");

  if (!input.value.trim()) {
    event.preventDefault();
    showError(input, "Enter your client card number or username.");
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
  passwordToggle.setAttribute(
    "aria-label",
    isShowing
      ? "Your password is hidden. Click to display it"
      : "Your password is displayed. Click to hide it"
  );
});

function showError(input, message) {
  const field = input.closest(".field-row");
  const error = document.getElementById(input.getAttribute("aria-describedby"));

  field?.classList.add("is-invalid");
  if (error) error.textContent = message;
}

function clearError(input) {
  const field = input.closest(".field-row");
  const error = document.getElementById(input.getAttribute("aria-describedby"));

  field?.classList.remove("is-invalid");
  if (error) error.textContent = "";
}
