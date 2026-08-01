import os
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import pandas as pd
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from .models import MachineData, Diagnosis, SimulationRequest, SimulationResult, LoginRequest, AuthResponse, ProfileUpdateRequest
from .simulator import simulator
from .dss_engine import dss_engine
from .es_engine import es_engine
from .database import db

load_dotenv()

SECRET_KEY = os.getenv("SMARTFACTORY_SECRET_KEY") or "smart-factory-dev-secret-key-change-me-in-production-2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 12
ALLOWED_ORIGINS = [origin.strip() for origin in os.getenv("SMARTFACTORY_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",") if origin.strip()]

app = FastAPI(title="Smart Manufacturing Hybrid System")

@app.on_event("startup")
def startup_event():
    print("--- BACKEND STARTUP: Initializing Local DB ---")
    db.init_db()
    simulator.ensure_history()
    print("--- BACKEND SERVER RUNNING ON PORT 8000 (LOCAL SQLITE) ---")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# New Models for Requests
class MaintenanceLogRequest(BaseModel):
    machine_id: str
    diagnosis_id: Optional[int] = None
    technician_action: str
    notes: str
    resolved: bool = True

class SearchQuery(BaseModel):
    query: str


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if 'sub' in to_encode and to_encode['sub'] is not None:
        to_encode['sub'] = str(to_encode['sub'])
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(request: Request):
    auth_header = request.headers.get("authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth_header.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.get_user_by_id(int(user_id))
    if not user or user.get("status") != "active":
        raise HTTPException(status_code=401, detail="User is not active")
    return user


def require_roles(request: Request, allowed_roles: List[str]):
    user = get_current_user(request)
    if user.get("role") not in allowed_roles:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user


@app.get("/")
def read_root():
    return {"status": "System Online", "modules": ["Simulator", "DSS", "ES", "LocalDB"]}


@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "smartfactory-backend",
        "database": "sqlite",
        "services": ["auth", "simulator", "dss", "es"]
    }

@app.post("/api/refresh")
def force_refresh():
    """Force data generation step into DB"""
    new_data = simulator.get_latest_readings()
    return {"status": "Refreshed and Synced to DB", "machines_monitored": len(new_data)}

@app.get("/api/es/rules")
def get_all_rules():
    """Get all rules"""
    try:
        return db.get_all_rules()
    except Exception as e:
        print(f"Rules Error: {e}")
        return []

@app.post("/api/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    user = db.get_user_by_email(payload.email)
    if not user or not db.verify_password(payload.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if user.get('status') != 'active':
        raise HTTPException(status_code=403, detail="User account is inactive")
    expires_delta = timedelta(days=30) if payload.remember_me else timedelta(hours=12)
    token = create_access_token({"sub": user['id'], "email": user['email'], "role": user['role']}, expires_delta)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user['id'],
            "full_name": user['full_name'],
            "email": user['email'],
            "role": user['role'],
            "status": user['status'],
        }
    }


@app.get("/api/auth/me")
def get_me(request: Request):
    user = get_current_user(request)
    return user


@app.get("/api/auth/profile")
def get_profile(request: Request):
    user = get_current_user(request)
    return {
        "id": user['id'],
        "full_name": user['full_name'],
        "email": user['email'],
        "role": user['role'],
        "status": user['status'],
        "phone": user.get('phone'),
        "profile_picture": user.get('profile_picture'),
    }


@app.put("/api/auth/profile")
def update_profile(request: Request, payload: ProfileUpdateRequest):
    user = get_current_user(request)
    user_id = user['id']

    updates = []
    values = []
    if payload.full_name is not None:
        updates.append("full_name = ?")
        values.append(payload.full_name)
    if payload.phone is not None:
        updates.append("phone = ?")
        values.append(payload.phone)
    if payload.profile_picture is not None:
        updates.append("profile_picture = ?")
        values.append(payload.profile_picture)
    if payload.password is not None and payload.password.strip():
        updates.append("password_hash = ?")
        values.append(db.hash_password(payload.password))

    if updates:
        values.append(user_id)
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", values)
        conn.commit()
        conn.close()

    refreshed_user = db.get_user_by_id(user_id)
    return {
        "id": refreshed_user['id'],
        "full_name": refreshed_user['full_name'],
        "email": refreshed_user['email'],
        "role": refreshed_user['role'],
        "status": refreshed_user['status'],
        "phone": refreshed_user.get('phone'),
        "profile_picture": refreshed_user.get('profile_picture'),
    }


@app.post("/api/auth/logout")
def logout():
    return {"status": "logged_out"}


@app.get("/api/dashboard/overview")
def get_overview():
    """Combined view for the dashboard"""
    try:
        current_readings = simulator.get_latest_readings()
        active_machines = 490 # Fixed: 10 machines OFF as requested
        
        active_diagnoses = es_engine.diagnose_all(current_readings)
        alert_count = len(active_diagnoses)
        critical_count = len([d for d in active_diagnoses if "Critical" in d.reasoning or d.confidence > 0.9])

        # Calculated Business Metrics
        production = 98.4 - (alert_count * 0.1)
        avg_power = sum([r.power for r in current_readings]) / len(current_readings) if current_readings else 10
        efficiency = 100 - ((avg_power - 10) * 5) if avg_power > 10 else 98.5

        return {
            "active_machines": active_machines,
            "total_machines": 500,
            "active_alerts": alert_count,
            "critical_alerts": critical_count,
            "production_output": round(production, 1),
            "energy_efficiency": round(efficiency, 1),
            "system_health": "Optimal" if alert_count < 10 else "Attention Required"
        }
    except Exception as e:
        print(f"Overview Error: {e}")
        return {
            "active_machines": 0, "total_machines": 500, "active_alerts": 0, "critical_alerts": 0,
            "production_output": 0, "energy_efficiency": 0, "system_health": "Error"
        }

@app.get("/api/dss/forecast")
def get_efficiency_forecast():
    return {
        "current_efficiency": 94.0,
        "projected_efficiency": 92.5,
        "degradation": 1.5,
        "reason": "Thermal throttling in Sector 7 detected",
        "timeframe": "4 hours"
    }

@app.get("/api/dss/trends")
def get_trends():
    """Get trend analysis from DSS using latest data"""
    try:
        # Use history fetch for trends
        history = db.get_history(period="60m")
        if not history: return {}
        df = pd.DataFrame(history)
        return dss_engine.analyze_trends(df)
    except:
        return {}

@app.get("/api/es/diagnoses", response_model=List[Diagnosis])
def get_diagnoses():
    """Get current active diagnoses"""
    latest = simulator.get_latest_readings()
    return es_engine.diagnose_all(latest)

@app.get("/api/es/search")
def search_knowledge_base(q: str):
    """Search the 'fault_rules' table"""
    if not q: return []
    try:
        return db.search_rules(q)
    except Exception as e:
        print(f"Search Error: {e}")
        return []

@app.get("/api/maintenance/logs")
def get_maintenance_logs():
    """Get maintenance logs for the technician view."""
    return db.get_maintenance_logs()


@app.post("/api/maintenance/log")
def log_maintenance(request: Request, log: MaintenanceLogRequest):
    """Log technician action and persist it to SQLite."""
    require_roles(request, ["super_admin", "plant_manager", "maintenance_engineer"])
    log_id = db.log_maintenance(log.machine_id, log.diagnosis_id, log.technician_action, log.notes, log.resolved)
    return {"status": "Logged", "id": log_id}

@app.post("/api/dss/simulate", response_model=SimulationResult)
def run_simulation(req: SimulationRequest):
    """Run a what-if scenario"""
    latest = simulator.get_latest_readings()
    machine = next((m for m in latest if m.machine_id == req.machine_id), None)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
        
    result = dss_engine.run_simulation(req.machine_id, req.parameter, req.value, machine)
    if not result:
        raise HTTPException(status_code=400, detail="Simulation failed")
    return result

@app.get("/api/dashboard/history")
def get_dashboard_history(period: str = "24h"):
    """
    Get simulated history for charts.
    period: '24h' (Hourly agg), '60m' (Minute agg), 'current' (Last 10m distinct)
    """
    try:
        # Use specialized DB method for aggregation
        return db.get_history(period)
    except Exception as e:
        print(f"History Endpoint Fail: {e}")
        return []

@app.get("/api/machines", response_model=List[MachineData])
def get_machines(limit: int = 50):
    """Raw machine data"""
    try:
        # Convert dicts back to Pydantic models
        raw = db.get_latest_readings(limit)
        return [MachineData(**r) for r in raw]
    except:
        return simulator.get_latest_readings()[:limit]
