# 🌍 Geography Game

A geography guessing game built with **FastAPI** and **React + Vite**. Players guess country outlines, unlock AI-generated hints, and compete for high scores in single or two-player modes.

---

## 🧰 Requirements

- Python 3.11+
- Node.js 18+
- Yarn v4 (configured with `nodeLinker: node-modules`)
- PostgreSQL

---

## 🚀 Setup

### 1. Backend

```bash
cd backend
python -m venv .venv # or cater to your own virtual environment paradigm
source .venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt  # if present
# OR install manually:
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv

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

# Install dependencies
yarn install

# Start the development server
yarn dev
```

Frontend will be running at: [http://localhost:5173](http://localhost:5173)

---

## 🎨 Styling

This project uses **Tailwind CSS** for styling. Utility classes power dynamic UIs and responsive design.

---

## 🧪 Development Notes

- **Game flow**: `/start`, `/guess`, `/send`, and `/hints` (AI clues).
- **Country outlines** are served as SVGs from the backend (`/static/svg/...`).
- **State management** uses Redux Toolkit + RTK Query.
- **Authentication** and **game tracking** are tied to a unique username and contact method.
- **AI Clue System** gives intelligent hints powered by an LLM and a clue bank mechanic.
- Uses `classNames`, React 19, and TypeScript.

---

## 📦 Build for Production

```bash
# Frontend
cd frontend
yarn build

# Backend
# Deploy with Uvicorn/Gunicorn or platforms like Fly.io, Render, or Railway
```

---

## 🔐 Environment Variables

Create a `.env` file in `backend/` for database and API config:

```env
DATABASE_URL=postgresql://username:password@localhost/dbname
OPENAI_API_KEY=sk-...
```

---

## 🙌 License

MIT — use, remix, and contribute freely!
