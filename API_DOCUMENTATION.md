# API Documentation

## Authentication

### POST /api/auth/login
Authenticates a user and returns a JWT token.

Request body:
- `email` (string)
- `password` (string)
- `remember_me` (boolean, optional)

Response:
- `access_token`
- `token_type`
- `user`

### GET /api/auth/me
Returns the currently authenticated user based on the JWT bearer token.

### GET /api/auth/profile
Returns the profile for the authenticated user.

### PUT /api/auth/profile
Updates the authenticated user profile and optionally changes the password.

### POST /api/auth/logout
Returns a simple logged-out confirmation payload.

## Health

### GET /health
### GET /api/health
Returns backend status, database type, and available service names.

## Dashboard

### GET /api/dashboard/overview
Returns aggregate dashboard metrics.

### GET /api/dashboard/history
Returns history data for charts.

## Expert System / DSS

### GET /api/es/rules
Returns the rule set used by the expert system.

### GET /api/es/diagnoses
Returns active diagnoses for the current dataset.

### GET /api/es/search
Searches the knowledge base by query.

### POST /api/dss/simulate
Runs a simulation scenario for a specified machine.

## Maintenance

### GET /api/maintenance/logs
Returns saved maintenance logs.

### POST /api/maintenance/log
Persists a maintenance action to the database. Requires an authenticated user with a supported role.

## Machines

### GET /api/machines
Returns machine telemetry data.
