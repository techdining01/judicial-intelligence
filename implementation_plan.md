# Implementation Plan: AI Videos, 36-State Coverage, and PWA Setup

This plan details the technical steps to fulfill the updated intent.

## Proposed Changes

### 1. AI Video Simulations (Backend: Django & FastAPI)
We need to set up the data models and endpoints for the junior lawyer AI video simulations.
- **[backend/django_core/intelligence/models.py](file:///c:/Users/USER/Desktop/judicial-intelligence/backend/django_core/intelligence/models.py)**: Add `AIVideoSimulation` model.
  - Fields: `title`, `description`, `category` (Constitutional, Civil, Criminal), `video_url`, `ai_prompt_used` (to reference the Nigerian Constitution), `created_at`.
- **`backend/django_core/intelligence/management/commands/seed_simulations.py`**: Create a Django management command to seed the database with the 5 Constitutional cases and 3 Civil/Criminal cases featuring SANs and judges.
- **[backend/fastapi_services/app/ai/routes.py](file:///c:/Users/USER/Desktop/judicial-intelligence/backend/fastapi_services/app/ai/routes.py)**: Add a `GET /ai/simulations` endpoint to fetch these simulations so the Next.js frontend can display them to users.

---

### 2. 36-State Small Claims Rules Engine (Backend: FastAPI)
The current rules engine has 16 state files. We need to expand this to cover all 36 states and the FCT.
- **`backend/fastapi_services/rules_engine/[missing_states].py`**: Generate the missing 21 state files (e.g., `abia.py`, `adamawa.py`, etc.). Each will contain a basic state-specific rules function similar to existing ones.
- **[backend/fastapi_services/rules_engine/resolver.py](file:///c:/Users/USER/Desktop/judicial-intelligence/backend/fastapi_services/rules_engine/resolver.py)**: Update the resolver rule registry to import and map all 36 states + FCT to their respective functions.

---

### 3. Progressive Web App Setup (Frontend: Next.js)
The frontend application needs to be installable and offline-capable as a PWA.
- **Dependencies**: Install `@ducanh2912/next-pwa` in the `frontend` directory.
- **[frontend/next.config.ts](file:///c:/Users/USER/Desktop/judicial-intelligence/frontend/next.config.ts)**: Wrap the Next.js config with the PWA plugin.
- **[frontend/public/manifest.json](file:///c:/Users/USER/Desktop/judicial-intelligence/frontend/public/manifest.json)**: Create the Web App Manifest defining the app's name, theme colors, and icons.
- **`frontend/public/icons/`**: Generate basic placeholder icons (192x192, 512x512) for the PWA.
- **[frontend/app/layout.tsx](file:///c:/Users/USER/Desktop/judicial-intelligence/frontend/app/layout.tsx)** (or relevant root layout): Add the `<link rel="manifest" href="/manifest.json" />` and theme color meta tags.

## Verification Plan

### Automated/Code Verification
1. Run Django migrations `python manage.py makemigrations` and `migrate` to ensure the new AI video model is created without errors.
2. Run the seeding script `python manage.py seed_simulations` and check if 8 records are created in the database.
3. Check the FastAPI application startup to ensure [resolver.py](file:///c:/Users/USER/Desktop/judicial-intelligence/backend/fastapi_services/rules_engine/resolver.py) imports all 37 rules correctly without `ModuleNotFoundError`.
4. Run frontend build `npm run build` in the `frontend` directory to ensure the Next.js PWA compilation succeeds and service workers (`sw.js`) are generated in the `.next` or `public` folder.

### Manual Verification
1. Open the frontend in a browser (e.g., via `npm run dev`) and check the Developer Tools -> Application -> Manifest to verify it is recognized as a PWA.
2. We can hit the `/ai/simulations` FastAPI endpoint manually (or via Swagger UI) to ensure the 8 cases are returned correctly.
