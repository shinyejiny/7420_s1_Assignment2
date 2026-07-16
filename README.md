# 🏥 Clinic Booking System

A full-stack web application for managing clinic appointments, built with **Django REST Framework** and **React JS**. Features a 3-role authentication system (Admin, Doctor, Patient) with complete booking management capabilities.
 
**Live Demo:** [clinic-frontend-sable.vercel.app](https://clinic-frontend-sable.vercel.app)  
**Backend API:** [7420-s1-assignment2.vercel.app](https://7420-s1-assignment2.vercel.app)

---

## Tech Stack

### Backend
- **Django 6** + **Django REST Framework**
- **Token Authentication** (DRF built-in)
- **Neon PostgreSQL** (cloud database)
- **Deployed on Vercel**

### Frontend
- **React 19** + **React Router v6**
- **Axios** for HTTP requests
- **Bootstrap 5** for styling
- **Deployed on Vercel**

---

##  User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system control — manage doctors, slots, appointments, patients |
| **Doctor** | Manage own slots, view patient appointments |
| **Patient** | Browse doctors, book/edit/cancel appointments |

---

## Features

### 🔐 Authentication
- Token-based authentication (login → token issued → stored in localStorage)
- 3-step login flow: token → userId → role check
- Role-based redirect (Admin → `/admin`, Doctor → `/doctor-dashboard`, Patient → `/doctors`)
- Secure logout (token deleted from DB)

### 👨‍💼 Admin Dashboard
- Add / Edit / Delete doctors (with login credentials)
- Add / Edit / Delete slots (with time restrictions)
- View and manage all appointments
- Create patient accounts
- Book appointments on behalf of patients
- Delete patient accounts

### 👨‍⚕️ Doctor Dashboard
- View own appointment slots
- Add / Delete slots
- View patient booking status in real-time

### 🧑‍🤝‍🧑 Patient Portal
- Browse all available doctors and slots
- Book appointments (double-booking prevented)
- Edit or cancel existing appointments
- View appointment status (booked / accepted / rejected)

###  Validation & Business Logic
- **Double booking prevention** — same time slot or same doctor on same day
- **Time restrictions** — slots only available 8:00 AM – 5:00 PM
- **Past date/time filtering** — cannot book past dates or times
- **Role-based data access** — patients only see their own appointments; admin sees all

---

## 🏗️ Project Structure

```
7420_s1_Assignment2/
│
├── ClinicAPI/                  # Django project settings
│   ├── settings.py             # DB, auth, CORS config
│   └── urls.py                 # Root URL configuration
│
├── accounts/                   # User management app
│   ├── models.py               # CustomUser (is_admin, is_doctor, is_patient)
│   ├── serializers.py          # RegisterSerializer
│   ├── views.py                # register, logout, get_auth_id
│   ├── viewsets.py             # UserViewSet
│   └── urls.py                 # accounts URLs + Router
│
├── clinic/                     # Core clinic app
│   ├── models.py               # Doctor, Slot, Appointment
│   ├── serializers.py          # With validation logic
│   ├── views.py                # @api_view functions
│   ├── viewsets.py             # ModelViewSets (CRUD)
│   └── urls.py                 # clinic URLs + Router
│
└── clinic-frontend/            # React frontend
    └── src/
        ├── api.js              # Base URL config (centralised)
        ├── App.js              # Routing
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── DoctorList.js
        │   ├── Appointments.js
        │   ├── AdminDashboard.js
        │   └── DoctorDashboard.js
        └── components/
            └── Navbar.js
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/` | Register new user |
| POST | `/auth/` | Login → get token |
| GET | `/auth/logout/` | Logout → delete token |
| GET | `/auth/get_auth_id/` | Get current user ID |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users_router/` | List all users (admin only) |
| GET | `/users_router/{id}/` | Get user detail |
| DELETE | `/users_router/{id}/` | Delete user |

### Doctors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/doctors/` | List all doctors |
| POST | `/doctors/create/` | Add doctor + create login |
| PUT | `/doctors/{id}/update/` | Update doctor |
| DELETE | `/doctors_router/{id}/` | Delete doctor |

### Slots
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/slots_router/` | List all slots |
| POST | `/slots_router/` | Create slot |
| PATCH | `/slots_router/{id}/` | Update slot |
| DELETE | `/slots_router/{id}/` | Delete slot |
| GET | `/doctor-slots/` | Doctor's own slots |
| POST | `/doctor-add-slot/` | Doctor adds own slot |

### Appointments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/appointments_router/` | List appointments (role-filtered) |
| POST | `/appointments_router/` | Create appointment |
| PATCH | `/appointments_router/{id}/` | Update appointment |
| DELETE | `/appointments_router/{id}/` | Cancel appointment |
| GET | `/doctor-appointments/` | Doctor's patient appointments |
| PATCH | `/doctor-appointments/{id}/update/` | Accept / Reject appointment |

##  Getting Started

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/shinyejiny/7420_s1_Assignment2.git
cd 7420_s1_Assignment2

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (.env)
DATABASE_URL=your_neon_postgresql_url
SECRET_KEY=your_secret_key
DEBUG=True

# Run migrations
python manage.py migrate

# Create admin account
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd clinic-frontend

# Install dependencies
npm install

# Start development server
npm start
```

---

##  Environment Variables

### Backend (.env)
```
SECRET_KEY=your_django_secret_key
DEBUG=False
DATABASE_URL=postgresql://...
```

---


