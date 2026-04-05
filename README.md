# 🎓 Campus Connect

A full-stack web application that helps students check real-time teacher availability on campus. Teachers can set availability slots, manage appointments, and toggle instant availability — students can search, view schedules, and book appointments.

## 🛠️ Tech Stack

| Layer     | Technology                                        |
|-----------|---------------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS                      |
| Backend   | Node.js, Express.js, Helmet, Rate Limiting        |
| Database  | MongoDB (Atlas or local) with Mongoose ODM        |
| Auth      | JWT (JSON Web Tokens), bcrypt                     |

## 📁 Project Structure

```
CAMPUS-CONNECT/
├── frontend/              # React + Vite client app
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, ErrorBoundary, ProtectedRoute)
│   │   ├── pages/           # Page components (Landing, Login, Register, Dashboards)
│   │   ├── context/         # React context (AuthContext)
│   │   └── api/             # Axios API client
│   ├── vercel.json          # Vercel deployment config
│   └── ...
├── backend/               # Express.js API server
│   ├── config/              # Database configuration
│   ├── controllers/         # Route handlers (auth, teacher, student)
│   ├── middleware/           # JWT auth & role authorization
│   ├── models/              # Mongoose schemas (User, Availability, Appointment)
│   ├── routes/              # API route definitions
│   └── server.js            # Entry point
├── render.yaml            # Render deployment blueprint
└── README.md
```

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud)

### 1. Clone & Setup

```bash
git clone https://github.com/YOUR_USERNAME/CAMPUS-CONNECT.git
cd CAMPUS-CONNECT
```

### 2. Backend

```bash
cd backend
cp .env.example .env       # Create your .env file — edit with your MongoDB URI
npm install
npm run dev                # Starts with nodemon (auto-reload)
```

> **Note:** If MongoDB isn't available in development, the server automatically uses an in-memory database. Data will be lost on restart.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                # Opens at http://localhost:5173
```

## ✨ Features

### 👩‍🏫 Teacher Dashboard
- Set date-specific availability slots with time ranges
- Toggle "Meet Now" instant availability
- View, approve, or reject student appointment requests
- Interactive calendar with heatmap visualization

### 👨‍🎓 Student Dashboard
- Search teachers by name, department, or subject
- View teacher availability on specific dates
- Book appointments with an optional message
- Track appointment history and statuses

### 🔒 Security
- JWT authentication with bcrypt password hashing
- Helmet HTTP security headers
- Rate limiting on auth routes (20 req/15min)
- CORS restricted to allowed origins
- Request body size limited to 10KB

## 📡 API Endpoints

| Method | Endpoint                                   | Auth     | Description                 |
|--------|-------------------------------------------|----------|-----------------------------|
| POST   | `/api/auth/register`                       | Public   | Register a new user         |
| POST   | `/api/auth/login`                          | Public   | Login and get JWT token     |
| GET    | `/api/auth/me`                             | Required | Get current user profile    |
| GET    | `/api/teacher/availability`                | Teacher  | Get my availability slots   |
| POST   | `/api/teacher/availability`                | Teacher  | Add availability slot       |
| PUT    | `/api/teacher/availability/:id`            | Teacher  | Update a slot               |
| DELETE | `/api/teacher/availability/:id`            | Teacher  | Delete a slot               |
| GET    | `/api/teacher/appointments`                | Teacher  | Get appointment requests    |
| PUT    | `/api/teacher/appointments/:id`            | Teacher  | Approve/reject appointment  |
| GET/PUT| `/api/teacher/instant-available`           | Teacher  | Get/toggle instant status   |
| GET    | `/api/student/teachers?search=...`         | Student  | Search teachers             |
| GET    | `/api/student/teachers/:id/availability`   | Student  | Get teacher's availability  |
| POST   | `/api/student/appointments`                | Student  | Book an appointment         |
| GET    | `/api/student/appointments`                | Student  | Get my appointments         |
| GET    | `/api/health`                              | Public   | Health check                |

## 🚀 Deployment

### Option A: Render (Full-Stack — Recommended)

1. Push to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render reads `render.yaml` automatically
4. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`
5. Deploy!

### Option B: Vercel (Frontend) + Render (Backend)

**Backend on Render:**
1. Create a new **Web Service** on Render
2. Root Directory: `backend`
3. Build: `npm install`, Start: `node server.js`
4. Add env vars: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL`

**Frontend on Vercel:**
1. Import the repo on [vercel.com](https://vercel.com)
2. Root Directory: `frontend`
3. Add env var: `VITE_API_URL=https://your-render-backend.onrender.com/api`
4. Deploy — `vercel.json` handles SPA routing

## 👥 Team Collaboration

1. Fork/clone the repo
2. Create feature branches: `git checkout -b feature/your-feature`
3. Never push directly to `main` — always use Pull Requests
4. Each developer creates their own `backend/.env` from `.env.example`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
