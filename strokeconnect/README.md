# StrokeConnect — Stroke Care Access Platform (Chandigarh & Punjab) — MVP Prototype

A two-sided platform connecting stroke patients/caregivers with doctors, hospitals, rehab
centres and clinics in Chandigarh & Punjab — search → view provider → send a connection
request → provider accepts/rejects/responds, similar in spirit to how an Uber/Ola request
is initiated, matched, and responded to (without real-time GPS matching or live tracking).

## Tech stack
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, bcrypt password hashing
- **Frontend:** Single-page React app (loaded via CDN + in-browser Babel — no build step,
  so it opens straight in a browser) using the Fetch API to talk to the backend
- **Database seed:** `server/seed.js` loads an initial provider dataset compiled from
  publicly available hospital/department pages, official stroke-network directories
  (Angels Initiative), and recent news coverage of Punjab's stroke-care system.

## Project structure
```
strokeconnect/
  server/            Express + MongoDB API
    models/          Provider, User (patient/caregiver), ConnectionRequest
    routes/          auth.js, providers.js, requests.js
    middleware/       auth.js (JWT)
    seed.js           Initial provider dataset
    server.js         App entrypoint
  client/
    index.html        Full frontend (patient + provider views), no build tooling required
```

## Running it locally

1. **Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env      # then set MONGO_URI / JWT_SECRET if needed
   npm run seed               # loads the initial provider dataset
   npm run dev                 # or: npm start
   ```
   The API runs at `http://localhost:5000`. A local MongoDB instance (or a free
   MongoDB Atlas cluster URI in `.env`) is required.

2. **Frontend**
   Just open `client/index.html` directly in a browser (double-click it, or serve it
   with any static server). It talks to the API at `http://localhost:5000/api`
   (see the `API` constant near the top of the `<script>` block if you need to
   change this, e.g. when deploying).

3. **Try the two-way flow**
   - As a patient: Search → pick a provider → Register/Login → "Send Request".
   - As a provider: Log in with the provider's email from `seed.js`
     (e.g. `dheeraj.khurana@pgimer-demo.in` style emails aren't actually seeded —
     see note below) and any password on first login (this "claims" the listing
     for demo purposes) → Accept/Reject/message the request from **Provider Dashboard**.

   > Note: the seeded providers don't ship with login emails/passwords (since
   > these weren't publicly listed). To demo the provider side end-to-end, add
   > an `email` field to one seed entry in `server/seed.js` before running
   > `npm run seed`, then log in with that email and any password.

## Assumptions & Scope

Given the internship/assignment timeframe, this submission is an **MVP prototype**,
not a production system. Key assumptions and deliberate scope decisions:

- **"Uber/Ola-style" is interpreted as the request lifecycle** — search → select →
  send request → provider responds (accept/reject) → basic messaging — **not** a
  literal real-time marketplace with live location tracking, dispatch algorithms,
  or payments. The assignment text explicitly frames this as the underlying idea.
- **Provider dataset is a starting sample, not an exhaustive directory.** It was
  compiled from public sources (hospital websites, the Angels Initiative stroke
  network directory, and news coverage of Punjab's 2024 CMC–Medtronic Hub-and-Spoke
  stroke care model) and covers major stroke-care institutions across Chandigarh,
  Mohali, Panchkula, Ludhiana, Patiala and Amritsar. Contact numbers, OPD hours and
  services should be re-verified with each provider before any real-world use —
  several entries (e.g. individual doctor OPD timings, the sample rehab clinic) are
  representative placeholders flagged in `seed.js`.
- **Provider accounts are "claimed" rather than self-registered** — since real
  providers weren't onboarded in this timeframe, a provider's first login (using
  their seeded email + any password) sets their password. A production version
  would have a verified provider onboarding/KYC flow instead.
- **Authentication is intentionally simple** (email + password, JWT), with no
  OTP/phone verification, email confirmation, or role-based admin approval —
  reasonable for a prototype, not for handling real patient health data.
- **No payments, insurance, or ambulance-dispatch integration** — out of scope
  for this assignment; noted as a "future expansion" item below.
- **Communication is an in-app text thread**, not real-time chat (no
  WebSockets/push notifications) — sufficient to demonstrate the two-way
  interaction the assignment asks for.
- **Frontend has no build step** (plain HTML + React via CDN) to keep setup
  friction near zero for evaluation; a production version would use a proper
  bundler (Vite/CRA) and add mobile apps if targeting the "mobile app" option.
- **Single region hard-coded (Chandigarh & Punjab)** in line with the assignment's
  "initial focus," but the data model (`city`/`state` fields, filters) is built to
  extend to other regions and services without schema changes.

## Suggested next steps (post-MVP)
- Verified provider onboarding (documents/registration number check)
- Expand and continuously validate the provider dataset (ideally via a
  government/health-department partnership, similar to the Punjab stroke Hub-and-Spoke model)
- Real-time notifications (WebSockets/push) for new requests and responses
- Geolocation-based "nearest provider" search
- Expand beyond stroke care to other specialities/regions
