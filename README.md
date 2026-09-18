# Mobile Test Login UI Study

This is a test-only Express sample for studying a mobile login page layout. The UI is intentionally generic and includes:

1. A visible warning banner telling testers to use test data only.
2. A username field and password field.
3. Server-side logging of the submitted test username and password.

It does not authenticate users, create sessions, or store credentials. On submit, it prints the entered test username and password to the server logs with a testing-only warning so you can confirm the fields are wired correctly.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Render

Render can run this as a Node web service.

- Build command: `npm install`
- Start command: `npm start`
- Runtime: Node 18 or newer

The app reads `process.env.PORT`, which Render provides automatically.

## Notes

This project is for design study only and is not affiliated with any bank, financial institution, or production login service.

Do not enter real credentials. The console output is intentionally for local test data only.
