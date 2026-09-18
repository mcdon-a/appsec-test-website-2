const loginForm = document.querySelector("[data-login-form]");
const passwordToggle = document.querySelector("[data-toggle-password]");

loginForm?.addEventListener("submit", (event) => {
  const username = loginForm.querySelector("#username");
  const password = loginForm.querySelector("#password");
  let firstInvalid = null;

  if (!username.value.trim()) {
    showError(username, "Enter a test username.");
    firstInvalid = firstInvalid || username;
  } else {
    clearError(username);
  }

  if (!password.value.trim()) {
    showError(password, "Enter a test password.");
    firstInvalid = firstInvalid || password;
  } else {
    clearError(password);
  }

  if (firstInvalid) {
    event.preventDefault();
    firstInvalid.focus();
  }
});

passwordToggle?.addEventListener("click", () => {
  const input = document.querySelector("#password");
  const isShowing = input.type === "text";

  input.type = isShowing ? "password" : "text";
  passwordToggle.setAttribute("aria-pressed", String(!isShowing));
  passwordToggle.setAttribute("aria-label", isShowing ? "Show password" : "Hide password");
  passwordToggle.querySelector("span").textContent = isShowing ? "Show" : "Hide";
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
