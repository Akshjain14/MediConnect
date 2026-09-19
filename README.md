# MediConnect

MediConnect is a full-stack healthcare appointment management platform that connects patients with doctors through an easy-to-use web application.

The application allows users to discover doctors, view their profiles and specializations, register/login, and manage appointments.

## Live Demo

🌐 **Live Website:**  
https://mediconnect-frontend-vmmp.onrender.com/

## GitHub Repository

https://github.com/Akshjain14/MediConnect

## Features

- User registration and login
- Doctor directory
- Search doctors by name, specialization, and location
- Filter doctors by specialization
- Doctor profile and availability
- Appointment booking and management
- Patient management
- Doctor management
- Admin functionality
- REST API based communication between frontend and backend
- Responsive and user-friendly interface

## Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Axios
- Vite

### Backend
- Java
- Spring Boot
- Spring Data JPA
- REST APIs
- Maven

### Database
- PostgreSQL

### Deployment
- Render

## Project Structure

```text
MediConnect/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── run-mediconnect.bat
└── stop-mediconnect.bat

Application Architecture
React.js Frontend
        │
        │ REST API / Axios
        ▼
Spring Boot Backend
        │
        │ JPA / Hibernate
        ▼
PostgreSQL Database

API Integration
React.js Frontend
        │
        │ REST API / Axios
        ▼
Spring Boot Backend
        │
        │ JPA / Hibernate
        ▼
PostgreSQL Databas

The frontend communicates with the Spring Boot backend using Axios.
Example:
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

Getting Started
1. Clone the Repository
git clone https://github.com/Akshjain14/MediConnect.git
cd MediConnect
2. Run Backend

Navigate to the backend directory:
cd backend

Run the Spring Boot application using Maven:
mvn spring-boot:run

The backend will run on:
http://localhost:8080
3. Run Frontend

Open another terminal:
cd frontend
npm install
npm run dev

The frontend will be available at:
http://localhost:5173

Environment Variables
Frontend

Create a .env file inside the frontend directory:
VITE_API_URL=http://localhost:8080

For production, configure the deployed backend URL in the Render environment variables.

Deployment
The application is deployed using Render.

Frontend: Render Static Site
Backend: Render Web Service
Database: PostgreSQL
Future Improvements
Online payment integration
Email/SMS appointment notifications
Doctor availability calendar
Patient medical history
Prescription management
Improved admin dashboard

Author
Aksh Jain
B.Tech Computer Science and Engineering
DIT University, Dehradun
