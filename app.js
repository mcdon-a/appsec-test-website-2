const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.redirect("/login/username");
});

app.get("/login/username", (_req, res) => {
  res.send(renderPage({ step: "username" }));
});

app.get("/login/password", (req, res) => {
  const username = typeof req.query.username === "string" ? req.query.username : "";
  res.send(renderPage({ step: "password", username }));
});

app.post("/login/complete", (req, res) => {
  const username = typeof req.body.username === "string" ? req.body.username : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  logTestLoginCapture(username, password);

  res.redirect("/login/complete");
});

app.get("/login/complete", (_req, res) => {
  res.send(renderPage({ step: "complete" }));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`RBC login UI study running at http://localhost:${port}`);
  });
}

function renderPage({ step, username = "" }) {
  const content = {
    username: renderUsernameStep(),
    password: renderPasswordStep(username),
    complete: renderCompleteStep()
  }[step];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>RBC Online Banking UI Study</title>
    <meta name="description" content="A test-only Express recreation of a two-step online banking sign-in UI.">
    <link rel="stylesheet" href="/styles.css">
    <script src="/app.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <div class="study-banner" role="note">
      UI study clone for testing only. Do not enter real banking credentials.
    </div>
    <div class="scene" aria-hidden="true">
      <div class="mountain mountain-one"></div>
      <div class="mountain mountain-two"></div>
      <div class="mountain mountain-three"></div>
    </div>
    <header class="brand-panel" aria-labelledby="brand-heading">
      <div class="crest" aria-label="RBC UI study mark">
        <span class="lion" aria-hidden="true"></span>
        <strong>RBC</strong>
      </div>
      <h1 id="brand-heading">Secure Sign-In</h1>
      <p>RBC Online Banking</p>
    </header>
    <main id="main" class="login-panel" aria-labelledby="form-title">
      ${content}
      ${renderFooter()}
    </main>
    <aside class="cookie-banner" data-cookie-banner aria-label="Cookie notice">
      <p>
        To ensure you have the best possible experience, we use cookies and similar technologies on our sites.
        Some are necessary for helping our sites run smoothly and securely, others are optional and help us
        create customized experiences.
      </p>
      <div class="cookie-actions">
        <button class="cookie-primary" type="button" data-accept-cookies>Accept All Cookies</button>
        <button class="cookie-secondary" type="button">Manage Cookie Settings</button>
      </div>
      <button class="cookie-close" type="button" aria-label="Close cookie notice" data-accept-cookies></button>
    </aside>
  </body>
</html>`;
}

function renderUsernameStep() {
  return `<section class="form-card">
        <form action="/login/password" method="get" data-username-form novalidate>
          <div class="field-row">
            <label id="form-title" for="username">Client Card or Username</label>
            <a class="security-link" href="#" aria-label="RBC Digital Banking Security Guarantee opens in a new tab">
              Security Guarantee
            </a>
            <input id="username" name="username" type="text" autocomplete="username" required aria-describedby="username-error" autofocus>
            <p class="field-error" id="username-error" aria-live="polite"></p>
          </div>
          <div class="save-row">
            <input id="save-username" type="checkbox">
            <label for="save-username">Save client card or username</label>
            <button class="help-button" type="button" aria-label="Help - Save your client card or username">?</button>
          </div>
          <button class="primary-action" type="submit">Next</button>
        </form>
        <nav class="panel-links" aria-label="Username help">
          <a href="#">Recover Your Username</a>
          <a href="#">Enrol in Online Banking</a>
          <a href="#">Other Online Services</a>
        </nav>
      </section>`;
}

function renderPasswordStep(username) {
  const safeUsername = escapeHtml(username || "testuser");

  return `<section class="form-card">
        <div class="signin-context">
          <a class="back-link" href="/login/username" aria-label="Back to client card or username"></a>
          <p>Signing in with <strong>${safeUsername}</strong></p>
        </div>
        <form action="/login/complete" method="post" data-password-form novalidate>
          <input type="hidden" name="username" value="${safeUsername}">
          <div class="field-row password-row">
            <label id="form-title" for="password">Password</label>
            <a class="security-link" href="#" aria-label="RBC Digital Banking Security Guarantee opens in a new tab">
              Security Guarantee
            </a>
            <input id="password" name="password" type="password" autocomplete="current-password" required aria-describedby="password-error">
            <button class="show-password" type="button" aria-label="Your password is hidden. Click to display it" aria-pressed="false" data-toggle-password></button>
            <p class="field-error" id="password-error" aria-live="polite"></p>
          </div>
          <button class="primary-action" type="submit">Sign In</button>
        </form>
        <nav class="panel-links" aria-label="Password help">
          <a href="#">Reset Your Password</a>
          <a href="#">Having Trouble Signing In?</a>
          <a href="#">Other Online Services</a>
        </nav>
      </section>`;
}

function renderCompleteStep() {
  return `<section class="form-card complete-card">
        <h2 id="form-title">Demo complete</h2>
        <p>
          This test-only sample logged the submitted fields to the server console. It does not authenticate,
          create a session, or store credentials.
        </p>
        <a class="primary-action link-action" href="/login/username">Start again</a>
      </section>`;
}

function renderFooter() {
  return `<footer class="site-footer">
      <p>RBC Online Banking is provided by Royal Bank of Canada.</p>
      <p>Royal Bank of Canada Website, (c) 1995-2026</p>
      <nav aria-label="Footer links">
        <a href="#">Legal</a>
        <a href="#">Accessibility</a>
        <a href="#">Privacy & Security</a>
        <a href="#">Advertising & Cookies</a>
      </nav>
    </footer>`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function logTestLoginCapture(username, password) {
  console.log("[TEST LOGIN CAPTURE] Testing purposes only. These fields are from this local UI study and do not correspond to an actual production username or password.", {
    username,
    password
  });
}

module.exports = { app, logTestLoginCapture };
