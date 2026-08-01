# Deployment Guide

## Prerequisites
- Python 3.10+
- Node.js 18+
- A GitHub repository
- A Vercel account
- A Render account

## 1) Prepare the backend for Render
1. Make sure the repository root contains the backend app and the Render config file.
2. In the repository root, create a `.env` file locally with:
   - `SMARTFACTORY_SECRET_KEY=change-this-to-a-strong-secret`
   - `SMARTFACTORY_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:5173,http://127.0.0.1:5173`
3. Install Python dependencies locally:
   - `pip install -r requirements.txt`
4. Test locally:
   - `uvicorn backend.main:app --host 0.0.0.0 --port 8000`
5. Verify health:
   - `curl http://127.0.0.1:8000/health`

## 2) Deploy the backend to Render
1. Create a new Web Service in Render.
2. Connect your GitHub repository.
3. Choose the repository root as the root directory.
4. Set the build command:
   - `pip install -r requirements.txt`
5. Set the start command:
   - `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables in Render:
   - `SMARTFACTORY_SECRET_KEY` = your strong secret
   - `SMARTFACTORY_ALLOWED_ORIGINS` = `https://your-vercel-app.vercel.app,http://localhost:5173,http://127.0.0.1:5173`
7. Deploy and copy the Render URL.

Example backend URL:
- `https://your-app-name.onrender.com`

## 3) Prepare the frontend for Vercel
1. In the frontend folder, create a `.env.production` file with:
   - `VITE_API_BASE_URL=https://your-app-name.onrender.com/api`
2. Build locally:
   - `cd frontend`
   - `npm install`
   - `npm run build`
3. Confirm the frontend uses the Render backend URL through the API client.

## 4) Deploy the frontend to Vercel
1. Create a new Vercel project.
2. Import your GitHub repository.
3. Set the root directory to `frontend`.
4. Add environment variables in Vercel:
   - `VITE_API_BASE_URL=https://your-app-name.onrender.com/api`
5. Deploy.

## 5) Connect frontend to backend
The frontend now calls the backend through the API client in [frontend/src/api.js](frontend/src/api.js). The base URL is pulled from the environment variable `VITE_API_BASE_URL`.

### Required runtime values
- Frontend env in Vercel:
  - `VITE_API_BASE_URL=https://your-app-name.onrender.com/api`
- Backend env in Render:
  - `SMARTFACTORY_SECRET_KEY=<strong-secret>`
  - `SMARTFACTORY_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:5173,http://127.0.0.1:5173`

### What to expect after deployment
- Frontend login calls: `https://your-app-name.onrender.com/api/auth/login`
- Frontend dashboard calls: `https://your-app-name.onrender.com/api/dashboard/overview`
- Health check: `https://your-app-name.onrender.com/health`

## 6) Production notes
- Keep `SMARTFACTORY_SECRET_KEY` secret and strong.
- If you later move to Postgres, update the database layer accordingly.
- The current app is SQLite-compatible for small deployments and demo use.
