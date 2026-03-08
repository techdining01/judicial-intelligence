# Running the Judicial Intelligence Platform

Architecture (from `backend/judicial_intelligence_app_intent.md`):

- **Django** — Auth, SaaS, models, permissions, audit, courts & alerts APIs
- **FastAPI** — AI, scraping, rules engine, law explain
- **Next.js** — Frontend only

## 1. Backend (Django)

```bash
cd backend
pip install -r requirements.txt
cd django_core
python manage.py migrate
python manage.py createsuperuser   # email + password for admin/login
python manage.py runserver
```

Django: **http://localhost:8000**

- Admin: http://localhost:8000/admin/
- API auth: `POST /api/auth/login/` with `{"email","password"}`
- Court analytics: `GET /api/courts/analytics/` (Bearer token)
- Alerts: `GET /api/alerts/my/` (Bearer token)

## 2. FastAPI

```bash
cd backend/fastapi_services
# Use same .env as Django (or set DJANGO_SECRET_KEY for JWT)
uvicorn app.main:app --reload --port 8001
```

FastAPI: **http://localhost:8001**

- Health: http://localhost:8001/health
- AI: `/ai/summarize`, `/ai/precedents`, `/ai/simulations`
- Law: `POST /law/explain-law`
- Scraping: `/scrape/scrape`, `/scrape/cause-list`
- Alerts: `POST /alerts/send`

## 3. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_DJANGO_URL and NEXT_PUBLIC_FASTAPI_URL if needed
npm run dev
```

Frontend: **http://localhost:3000**

- `/` redirects to `/login` or `/dashboard`
- Login with a Django user (e.g. superuser); dashboard redirects by role (Admin, Lawyer, Student, Researcher).

## 4. Optional: Celery + Redis

For scheduled morning court alerts:

```bash
# Terminal: Redis
redis-server

# Terminal: Celery worker
cd backend/django_core && celery -A config worker -l info

# Terminal: Celery beat
cd backend/django_core && celery -A config beat -l info
```

## Environment

- **backend**: Copy `backend/.env.example` to `backend/.env` (or `django_core/.env`) and set `DJANGO_SECRET_KEY`.
- **frontend**: Copy `frontend/.env.local.example` to `frontend/.env.local`; defaults (localhost:8000, 8001) work for local dev.
