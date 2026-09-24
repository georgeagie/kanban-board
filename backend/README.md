# kanban-backend

FastAPI + SQLAlchemy (sqlite3) API for the kanban board.

## Setup

Dependencies are managed with [uv](https://docs.astral.sh/uv/). Already initialized; to reinstall:

```bash
cd backend
uv sync
```

## Run (once `main.py` exposes `app`)

```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```

Docs: http://localhost:8000/docs
