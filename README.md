# RBC Online Banking UI Study

This is a test-only Express sample that recreates the two-step shape of the RBC Online Banking sign-in flow for UI/UX study:

1. Enter a client card number or username.
2. Enter a password.

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

This project is for design study only and is not affiliated with RBC, Royal Bank of Canada, or any banking service. Replace names and visual identity before using it for any public or production purpose.

Do not enter real credentials. The console output is intentionally for local test data only.
