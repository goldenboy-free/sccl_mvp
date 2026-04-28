# SCCL MVP — Deployment Guide

## Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | SvelteKit 2 (Vite, Svelte 5)  |
| Backend  | Express 5 (Node.js, ES Modules)|
| Database | SQLite (better-sqlite3)        |
| Auth     | JWT + bcrypt                   |

---

## 1. Frontend → Vercel

### Setup
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo: `goldenboy-free/sccl_mvp`
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects SvelteKit — no build config needed

### Environment Variables (Vercel Dashboard)
| Variable | Value |
|---|---|
| `PUBLIC_API_URL` | `https://your-backend.onrender.com` |

### Build & Output
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** auto-detected by adapter-auto

---

## 2. Backend → Render

### Setup
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect your GitHub repo: `goldenboy-free/sccl_mvp`
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npm start`

### Environment Variables (Render Dashboard)
| Variable | Value |
|---|---|
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `CORS_ORIGIN` | `https://your-app.vercel.app` |
| `NODE_ENV` | `production` |
| `PORT` | (auto-set by Render) |

### Important Notes
- Render provides a **persistent disk** if you need SQLite data to survive redeploys. Go to your service → **Disks** → Add a disk mounted at `/data`.
- If using a persistent disk, update `db.js` to use `/data/sccl.db` via an env var.
- For a true production app, migrate to PostgreSQL (Render provides free managed Postgres).

---

## 3. Local Development

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env
# Edit .env with a real JWT_SECRET
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

---

## 4. CORS Configuration

- In development: allows `localhost:5173` and `localhost:4173`
- In production: set `CORS_ORIGIN` to your exact Vercel URL
- Multiple origins: comma-separate them: `https://app.vercel.app,https://custom-domain.com`

---

## 5. Security Checklist

- [x] Passwords hashed with bcrypt (10 rounds)
- [x] JWT with 24h expiry
- [x] Input validation on auth routes
- [x] Parameterized SQL queries (better-sqlite3 prepared statements)
- [x] CORS restricted to allowed origins
- [x] JSON body size limited to 1MB
- [x] Stack traces hidden in production
- [x] No secrets committed (`.env` in `.gitignore`)
- [x] Health check endpoint at `GET /health`

---

## 6. Common Issues

| Issue | Fix |
|---|---|
| CORS errors on Vercel | Set `CORS_ORIGIN` in Render to your exact Vercel URL (no trailing slash) |
| "Invalid Token" on login | Ensure `JWT_SECRET` matches between backend env and any existing tokens |
| SQLite data lost on redeploy | Add a persistent disk on Render, or migrate to PostgreSQL |
| Frontend API calls fail | Ensure `PUBLIC_API_URL` is set in Vercel (not just locally) |
| 502 on Render | Check that `npm start` works — run `NODE_ENV=production node src/server.js` locally first |
