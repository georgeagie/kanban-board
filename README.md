# Kanban Board

Local kanban board with a FastAPI + SQLite backend and a React + Vite frontend.

## Backend

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8000
```

API docs: http://localhost:8000/docs  
Health: http://localhost:8000/api/health

## Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173  
Vite proxies `/api` to the backend on port 8000.
