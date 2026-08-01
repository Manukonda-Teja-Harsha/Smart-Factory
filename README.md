# 🏭 SmartFactory DSES – Manufacturing Intelligence Dashboard

> A full-stack AI-powered Manufacturing Intelligence Platform that combines a **Decision Support System (DSS)** and an **Expert System (ES)** to monitor industrial machines, predict failures, and assist in data-driven decision making.

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi)
![SQLite](https://img.shields.io/badge/Database-SQLite-blue)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)

---

## 🌐 Live Demo

### 🚀 Frontend
**https://YOUR_VERCEL_LINK.vercel.app**

### ⚙️ Backend API
**https://YOUR_RENDER_LINK.onrender.com**

### 📘 API Documentation
**https://YOUR_RENDER_LINK.onrender.com/docs**

---

# 📖 Overview

SmartFactory DSES is a real-time industrial monitoring platform designed to improve manufacturing productivity through intelligent analytics, predictive maintenance, and expert rule-based diagnosis.

The application continuously analyzes machine telemetry such as:

- Temperature
- Vibration
- Pressure
- Energy Consumption
- Production Output
- Machine Status

and converts raw sensor data into meaningful insights for plant operators and managers.

---

# 🎯 Objectives

- Real-time machine monitoring
- Predictive maintenance
- Intelligent fault diagnosis
- Production optimization
- Energy efficiency monitoring
- Centralized factory management
- Role-based access control
- Interactive dashboards

---

# 🧠 Hybrid Intelligence Architecture

The system combines two AI techniques:

## Decision Support System (DSS)

Provides:

- Trend Analysis
- KPI Monitoring
- Performance Forecasting
- Production Analytics
- What-if Simulations
- Decision Recommendations

---

## Expert System (ES)

Provides:

- Rule-Based Diagnosis
- Fault Detection
- Machine Health Analysis
- Confidence Scores
- Knowledge Base Search
- Maintenance Recommendations

---

## Hybrid Integration

The DSS identifies patterns while the Expert System validates those patterns using engineering rules.

This enables:

- Early fault detection
- Accurate diagnosis
- Reduced downtime
- Better maintenance planning

---

# ✨ Features

## 🔐 Authentication

- Secure Login
- JWT Authentication
- Remember Me
- User Profile
- Protected Routes
- Role-Based Access

---

## 📊 Dashboard

- Live KPIs
- Active Machines
- Machine Health
- Production Output
- Energy Efficiency
- Active Alerts
- Critical Alerts
- System Health

---

## 🏭 Machine Monitoring

- Machine List
- Live Status
- Sensor Readings
- Historical Trends
- Machine Performance

---

## 🧠 Decision Support System

- Production Forecast
- Trend Analysis
- Efficiency Monitoring
- Scenario Simulation
- Business Insights

---

## ⚙️ Expert System

- Rule-Based Diagnosis
- Knowledge Base
- Fault Search
- Confidence Analysis
- Maintenance Suggestions

---

## 👤 User Management

- User Login
- User Profile
- Update Profile
- Password Update
- Role Management

---

## 📈 Analytics

- Trend Charts
- Machine Statistics
- Energy Analysis
- Production Reports
- KPI Dashboard

---

## 📄 Reports

- PDF Report Generation
- Daily Reports
- Machine Summary
- Analytics Export

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- Lucide React
- jsPDF
- jsPDF-AutoTable

---

## Backend

- Python
- FastAPI
- SQLAlchemy
- JWT Authentication
- Pydantic
- Uvicorn
- Python-dotenv

---

## Database

- SQLite

---

## Deployment

- Vercel (Frontend)
- Render (Backend)
- GitHub

---

## Development Tools

- VS Code
- Git
- GitHub
- Postman
- npm
- pip

---

# 📂 Project Structure

```
SmartFactory_DSES
│
├── backend
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── simulator.py
│   ├── dss_engine.py
│   ├── es_engine.py
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── api.js
│   │   ├── config.js
│   │   └── App.jsx
│   │
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── requirements.txt
├── render.yaml
├── README.md
└── smartfactory.db
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone YOUR_REPO_LINK
```

```bash
cd SmartFactory_DSES
```

---

## Backend

```bash
pip install -r requirements.txt
```

```bash
uvicorn backend.main:app --reload
```

---

## Frontend

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

---

# 🌍 Environment Variables

## Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Production:

```env
VITE_API_BASE_URL=https://YOUR_RENDER_LINK.onrender.com/api
```

---

## Backend

```env
SMARTFACTORY_SECRET_KEY=your-secret-key
SMARTFACTORY_ALLOWED_ORIGINS=http://localhost:5173,https://YOUR_VERCEL_LINK.vercel.app
```

---

# 🔗 API Endpoints

## Authentication

- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/me`
- GET `/api/auth/profile`
- PUT `/api/auth/profile`

---

## Dashboard

- GET `/api/dashboard/overview`
- GET `/api/dashboard/history`

---

## Decision Support

- GET `/api/dss/forecast`
- GET `/api/dss/trends`
- POST `/api/dss/simulate`

---

## Expert System

- GET `/api/es/diagnoses`
- GET `/api/es/search`
- GET `/api/es/rules`

---

## Maintenance

- GET `/api/maintenance/logs`
- POST `/api/maintenance/log`

---

## Health

- GET `/health`

---

# 📸 Screenshots

Add screenshots here:

- Login Page
- Dashboard
- DSS Module
- Expert System
- Machine Monitoring
- User Profile

---

# 🔮 Future Enhancements

- CSV Upload & Import
- IoT Sensor Integration
- MQTT Support
- PostgreSQL Database
- Email Notifications
- SMS Alerts
- Predictive Maintenance using ML
- Real-time WebSocket Updates
- Docker Deployment
- Kubernetes Support

---

# 👨‍💻 Author

**Teja Harsha**

- GitHub: https://github.com/Manukonda-Teja-Harsha
- LinkedIn: https://www.linkedin.com/in/teja-harsha

---

# 📜 License

This project is developed for educational, research, and demonstration purposes.
