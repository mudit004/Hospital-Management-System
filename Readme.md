# 🏥 Healthcare Management System

**Django REST Framework + React (Vite)**

A full-stack healthcare management system for managing **patients, doctors, and their assignments** using JWT-based authentication.

---

## 🚀 Features

### Authentication

* Register
* Login
* JWT based auth (access + refresh tokens)

### Patients

* Create patient
* List patients
* Update patient
* Delete patient

### Doctors

* Create doctor
* List doctors
* Update doctor
* Delete doctor

### Doctor ↔ Patient Assignments

* Assign doctors to patients
* Remove assignments
* View all assignments
* View all doctors for a specific patient
* Enforces **unique doctor-patient mapping**
* Automatically deletes mappings when doctor or patient is deleted

---

## 🧱 Tech Stack

### Backend

* Django 5+
* Django REST Framework
* PostgreSQL
* SimpleJWT (Authentication)

### Frontend

* React (Vite)
* React Router
* Fetch API
* CSS Variables (Dark/Light theme)

---
A cumulative setup script is given for reference purpose.

# 🛠️ Backend Setup

## 1️⃣ Clone the repo

```bash
git clone <your-repo-url>
cd healthcare_project
```

---

## 2️⃣ Create virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install backend dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Create PostgreSQL database

```bash
sudo -u postgres psql
CREATE DATABASE healthcare_db;
\q
```

---

## 5️⃣ Configure `.env`

Create `.env` in the root:

```env
SECRET_KEY=TestSecretKey
DEBUG=True
DB_NAME=healthcare_db
DB_USER=postgres-user
DB_PASSWORD=postgres-password
DB_HOST=localhost
DB_PORT=5432
```
Update the given values as required.

---

## 6️⃣ Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 7️⃣ Create superuser (optional)

```bash
python manage.py createsuperuser
```

---

## 8️⃣ Run backend

```bash
python manage.py runserver
```

Backend will be running at:

```
http://localhost:8000
```

API base:

```
http://localhost:8000/api/
```

---

# 🛠️ Frontend Setup

## 1️⃣ Go to frontend folder

```bash
cd healthcare-frontend
```

---

## 2️⃣ Install dependencies

```bash
npm install
```

---

## 3️⃣ Create `.env`

```bash
touch .env
```

Add:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 4️⃣ Run frontend

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns:

   * `access` token
   * `refresh` token
3. Tokens stored in `localStorage`
4. Every API request includes:

```
Authorization: Bearer <access_token>
```

---

# 📡 API Endpoints

## Auth

| Method | Endpoint              | Description |
| ------ | --------------------- | ----------- |
| POST   | `/api/auth/register/` | Register    |
| POST   | `/api/auth/login/`    | Login       |

---

## Patients

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/api/patients/`      |
| GET    | `/api/patients/`      |
| GET    | `/api/patients/{id}/` |
| PUT    | `/api/patients/{id}/` |
| PATCH  | `/api/patients/{id}/` |
| DELETE | `/api/patients/{id}/` |

---

## Doctors

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | `/api/doctors/`      |
| GET    | `/api/doctors/`      |
| GET    | `/api/doctors/{id}/` |
| PUT    | `/api/doctors/{id}/` |
| PATCH  | `/api/doctors/{id}/` |
| DELETE | `/api/doctors/{id}/` |

---

## Doctor ↔ Patient Mappings

| Method | Endpoint                              |
| ------ | ------------------------------------- |
| POST   | `/api/mappings/`                      |
| GET    | `/api/mappings/`                      |
| GET    | `/api/mappings/{id}/`                 |
| DELETE | `/api/mappings/{id}/`                 |
| GET    | `/api/mappings/patient/{patient_id}/` |

---

# 🧩 Data Integrity Rules

✔ Each doctor–patient pair is unique  
✔ Removing a doctor removes all their mappings  
✔ Removing a patient removes all their mappings  
✔ Duplicate assignment is blocked by backend  
---

# ✅ Final Notes

This system is fully CRUD-enabled, JWT-secured, and production-ready for:

* Clinics
* Hospitals
* Health startups
* Internal tools

---
