# 🌍 Geography Game

A geography guessing game built with **FastAPI** and **React + Vite** . Players guess country outlines, get feedback, and compete for high scores in single or multiplayer modes.

---

## 🧰 Requirements

- Python 3.11+
- Node.js (v16+ recommended)
- PostgreSQL (or SQLite if adapted)

---

## 🚀 Setup

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt  # if present
# OR install manually:
pip install fastapi uvicorn sqlalchemy psycopg2-binary

# Initialize the database
python -m app.db.init_db
```

#### Run the backend server

```bash
uvicorn app.main:app --reload
```

Backend will be running at: [http://localhost:8000](http://localhost:8000)

---

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be running at: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Development Notes

- **Game logic** is powered by FastAPI endpoints (`/start`, `/guess`, `/send`, etc.).
- **Country outlines** are served as static SVGs from the backend (`/static/svg/...`).
- Uses **Redux Toolkit Query** for client-side state and async API handling.
- Authentication and game progress are tied to a username and notification method (email or SMS).

---

## 📦 Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
# Serve via Gunicorn, Uvicorn, or a platform like Fly.io, Render, or Railway
```

---

## 🙌 License

MIT. Feel free to build on or extend this project!
