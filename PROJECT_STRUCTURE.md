# Project Structure

## Root
- backend/: FastAPI application and persistence logic
- frontend/: Vite + React application
- tests/: Backend regression tests
- requirements.txt: Python dependencies
- .env.example: Example environment configuration

## Backend
- backend/main.py: API entrypoint and route definitions
- backend/database.py: SQLite database initialization and persistence helpers
- backend/models.py: Pydantic request/response models
- backend/simulator.py: Synthetic telemetry generator
- backend/dss_engine.py: Decision-support simulation logic
- backend/es_engine.py: Expert-system diagnosis engine

## Frontend
- frontend/src/App.jsx: Root app shell and auth/data orchestration
- frontend/src/api.js: Axios client with environment-aware base URL
- frontend/src/components/: UI components and page views
- frontend/src/context/ThemeContext.jsx: Shared theme context
