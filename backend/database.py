import hashlib
import hmac
import os
import sqlite3
import json
from datetime import datetime, timedelta
from typing import List, Optional

DB_NAME = "smartfactory.db"

class Database:
    def __init__(self):
        self.conn = None

    def get_connection(self):
        return sqlite3.connect(DB_NAME, check_same_thread=False)

    def init_db(self):
        """Initialize Local SQLite Database with Schema"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # 1. Machine Readings Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS machine_readings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                machine_id TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                temperature REAL,
                vibration REAL,
                power REAL,
                status TEXT
            )
        ''')
        # Index for fast time-range queries
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_timestamp ON machine_readings(timestamp)')

        # 2. Fault Rules Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS fault_rules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symptom_keywords TEXT, -- JSON Array
                diagnosis TEXT NOT NULL,
                action TEXT NOT NULL,
                confidence REAL,
                severity TEXT
            )
        ''')

        # 3. Maintenance Logs
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS maintenance_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                machine_id TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                diagnosis_id INTEGER,
                technician_action TEXT,
                notes TEXT,
                resolved BOOLEAN DEFAULT 0
            )
        ''')

        # 4. Users for Authentication
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'viewer',
                status TEXT NOT NULL DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        self._ensure_user_profile_columns(cursor)

        # Seed Fault Rules if empty
        cursor.execute('SELECT count(*) FROM fault_rules')
        if cursor.fetchone()[0] == 0:
            self._seed_rules(cursor)

        cursor.execute('SELECT count(*) FROM users')
        if cursor.fetchone()[0] == 0:
            self._seed_users(cursor)

        conn.commit()
        conn.close()
        print(f"--- SQLite Database '{DB_NAME}' Initialized ---")

    def _ensure_user_profile_columns(self, cursor):
        cursor.execute("PRAGMA table_info(users)")
        columns = {row[1] for row in cursor.fetchall()}
        if 'phone' not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN phone TEXT")
        if 'profile_picture' not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN profile_picture TEXT")

    def _seed_rules(self, cursor):
        rules = [
            (json.dumps(['vibration', 'noise', 'grinding']), 'Bearing Seizure', 'Replace Bearing Assembly', 0.95, 'Critical'),
            (json.dumps(['temperature', 'heat', 'smoke']), 'Motor Overheating', 'Check Cooling Fan & Vents', 0.90, 'Critical'),
            (json.dumps(['power', 'fluctuation']), 'Voltage Instability', 'Inspect Power Supply Unit', 0.85, 'Medium'),
            (json.dumps(['vibration', 'misalignment']), 'Shaft Misalignment', 'Realign Motor Shaft', 0.88, 'Medium'),
        ]
        cursor.executemany('INSERT INTO fault_rules (symptom_keywords, diagnosis, action, confidence, severity) VALUES (?, ?, ?, ?, ?)', rules)

    def _seed_users(self, cursor):
        users = [
            ('Super Admin', 'admin@smartfactory.com', self.hash_password('Admin@123'), 'super_admin', 'active'),
            ('Plant Manager', 'manager@smartfactory.com', self.hash_password('Manager@123'), 'plant_manager', 'active'),
            ('Maintenance Engineer', 'engineer@smartfactory.com', self.hash_password('Engineer@123'), 'maintenance_engineer', 'active'),
        ]
        cursor.executemany(
            'INSERT INTO users (full_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
            users
        )

    def hash_password(self, password: str) -> str:
        salt = hashlib.sha256(os.urandom(16)).hexdigest().encode('utf-8')
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return salt.decode('utf-8') + ':' + pwd_hash.hex()

    def verify_password(self, password: str, password_hash: str) -> bool:
        try:
            salt, stored_hash = password_hash.split(':', 1)
        except ValueError:
            return False
        pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
        return hmac.compare_digest(pwd_hash.hex(), stored_hash)

    def create_user(self, full_name: str, email: str, password: str, role: str = 'viewer', status: str = 'active'):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO users (full_name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
            (full_name, email.lower(), self.hash_password(password), role, status)
        )
        conn.commit()
        conn.close()

    def get_user_by_email(self, email: str):
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        row = cursor.execute('SELECT * FROM users WHERE email = ?', (email.lower(),)).fetchone()
        conn.close()
        return dict(row) if row else None

    def get_user_by_id(self, user_id: int):
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        row = cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,)).fetchone()
        conn.close()
        return dict(row) if row else None

    def insert_readings(self, readings: List[dict]):
        """Bulk insert machine readings"""
        conn = self.get_connection()
        cursor = conn.cursor()
        data = [
            (r['machine_id'], r['timestamp'], r['temperature'], r['vibration'], r['power'], r['status'])
            for r in readings
        ]
        cursor.executemany('''
            INSERT INTO machine_readings (machine_id, timestamp, temperature, vibration, power, status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', data)
        conn.commit()
        conn.close()

    def get_latest_readings(self, limit=500):
        """Get the most recent reading for each machine (approx)"""
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Use Python time to ensure we only get RECENT fresh data
        # If data is old (stale), this returns empty, forcing simulator to regenerate.
        start_dt = datetime.now() - timedelta(minutes=2)
        
        cursor.execute('''
            SELECT * FROM machine_readings 
            WHERE timestamp > ?
            ORDER BY timestamp DESC
            LIMIT ?
        ''', (start_dt.isoformat(), limit))
        rows = cursor.fetchall()
        conn.close()
        return [dict(row) for row in rows]

    def get_history(self, period="24h"):
        """
        Get aggregated history for charts.
        period: '24h' (Hourly), '60m' (Minutely), 'current' (Raw)
        """
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        now = datetime.now()
        
        if period == "current":
            # Very tight window for "Current" (Last 2 minutes)
            start_dt = now - timedelta(minutes=2)
            cursor.execute('''
                SELECT 
                    strftime('%Y-%m-%dT%H:%M:%S', timestamp) as timestamp,
                    temperature, vibration, power
                FROM machine_readings
                WHERE timestamp > ?
                ORDER BY timestamp ASC
                LIMIT 2000
            ''', (start_dt.isoformat(),))
            
        elif period == "60m":
            # Last 60 Minutes (Strict)
            start_dt = now - timedelta(hours=1)
            cursor.execute('''
                SELECT 
                    strftime('%Y-%m-%dT%H:%M:00', timestamp) as timestamp,
                    AVG(temperature) as temperature,
                    AVG(vibration) as vibration,
                    AVG(power) as power
                FROM machine_readings
                WHERE timestamp > ?
                GROUP BY strftime('%Y-%m-%dT%H:%M:00', timestamp)
                ORDER BY timestamp ASC
            ''', (start_dt.isoformat(),))
            
        else:
            # Last 24 Hours
            start_dt = now - timedelta(hours=24)
            cursor.execute('''
                SELECT 
                    strftime('%Y-%m-%dT%H:00:00', timestamp) as timestamp,
                    AVG(temperature) as temperature,
                    AVG(vibration) as vibration,
                    AVG(power) as power
                FROM machine_readings
                WHERE timestamp > ?
                GROUP BY strftime('%Y-%m-%dT%H:00:00', timestamp)
                ORDER BY timestamp ASC
            ''', (start_dt.isoformat(),))
            
        rows = cursor.fetchall()
        conn.close()
        
        result = []
        for row in rows:
            d = dict(row)
            d['signals'] = int(d['power'] * 50) # Mock metric
            result.append(d)
        return result

    def has_any_data(self):
        conn = self.get_connection()
        c = conn.cursor()
        c.execute("SELECT id FROM machine_readings LIMIT 1")
        has_data = c.fetchone() is not None
        conn.close()
        return has_data

    # --- Rule & Search Helpers ---
    def get_all_rules(self):
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        rows = conn.cursor().execute("SELECT * FROM fault_rules").fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def search_rules(self, query):
        conn = self.get_connection()
        conn.row_factory = sqlite3.Row
        rows = conn.cursor().execute(
            "SELECT * FROM fault_rules WHERE diagnosis LIKE ? OR action LIKE ?", 
            (f'%{query}%', f'%{query}%')
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

db = Database()
