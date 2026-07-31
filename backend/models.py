from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserCreateRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = 'viewer'

class LoginRequest(BaseModel):
    email: str
    password: str
    remember_me: bool = False

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: dict

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_picture: Optional[str] = None
    password: Optional[str] = None

class MachineData(BaseModel):
    machine_id: str
    timestamp: datetime
    temperature: float
    vibration: float
    power: float
    status: str = "running"

class Diagnosis(BaseModel):
    machine_id: str
    timestamp: datetime
    condition: str
    action: str
    reasoning: str
    confidence: float

class SimulationRequest(BaseModel):
    machine_id: str
    parameter: str
    value: float

class SimulationResult(BaseModel):
    machine_id: str
    original_value: float
    new_value: float
    energy_impact: float
    output_impact: float
