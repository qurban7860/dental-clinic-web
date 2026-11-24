# Dental Clinic Web

Standalone React/Vite frontend for the Dental Clinic Management System.

Repository: https://github.com/qurban7860/dental-clinic-web

## Local setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `VITE_API_URL` in `.env.local` to the backend API base URL, ending in `/api`. The database URL must never be added to this frontend repository.

## Build and tests

```powershell
npm run test
npm run build
```

Browser tests need the backend API running separately. Install Playwright Chromium with `npx playwright install chromium`, then run `npx playwright test`.

## Render

The included `render.yaml` configures a static site, SPA route fallback, and required `VITE_API_URL` setting. Set it to the deployed backend URL, for example `https://YOUR-API-HOST/api`.

## Vercel

Import this repository into Vercel with the repository root as the project root. Vercel builds the Vite app to `dist`; `vercel.json` keeps React Router routes working on refresh. Set `VITE_API_URL` to the backend deployment URL ending in `/api` for Production and Preview as appropriate.
