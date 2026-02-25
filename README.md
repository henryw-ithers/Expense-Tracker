# Expense-Tracker
A full-stack personal finance tracking application that allows users to manage transactions and categories, track income and expenses, and view financial summaries.

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Maven
- RESTful API
- JPA / Hibernate
- H2 or PostgreSQL

### Frontend
- React
- TypeScript
- Vite
- Fetch API

---

## Features Implemented

### Backend
- Layered architecture:
  - Controller layer (REST endpoints)
  - Service layer (business logic)
  - Entity layer (data model)
- Transaction management:
  - Create transaction
  - Get all transactions
  - Request validation and error handling
- Category management:
  - Create category
  - Get categories
- Structured HTTP responses
- Proper status codes (`400 Bad Request` for invalid input)

### Frontend
- Structured React + TypeScript architecture
- Folder separation:
  - `types/` – shared TypeScript interfaces
  - `services/` – API communication layer
  - `hooks/` – reusable stateful logic
  - `components/` – reusable UI components
  - `pages/` – route-level screens
- Dashboard page
- Add Transaction page
- Service-based API calls
- Type-safe backend integration

---

## Planning & Design

### Domain Model
See the domain model diagram:
- [Domain Model](docs/domain-model.md)

### User Stories
See the user stories:
- [User Stories](docs/user-stories.md)

### Architecture Decisions
- Layered backend architecture (Controller → Service → Repository)
- Separation of frontend service layer from UI components
- DTO usage to prevent exposing internal entities

---

## Project Structure
### Backend
```text
backend/
├── .mvn/
├── mvnw
├── mvnw.cmd
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/withers/financetracker/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── model/
│   │   │       ├── repository/
│   │   │       ├── service/
│   │   │       └── FinanceTrackerApplication.java
│   │   └── resources/
│   └── test/
└── target/
```

### Frontend
```
frontend/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ ├── hooks/
│ ├── pages/
│ ├── services/
│ ├── types/
│ ├── App.tsx
│ └── main.tsx
├── package.json
└── vite.config.ts
```

---

## How to Run

### Prerequisites

- Java 17+
- Node.js 18+
- Maven (or use included Maven Wrapper)
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/henryw-ithers/Expense-Tracker.git
cd Expense-Tracker
```

## 2. Run the Backend
From the root directory:
```bash
cd backend
./mvnw spring-boot:run
```
The backend will start on: http://localhost:8080

## 3. Run the Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on: http://localhost:5173

## 4. API Base URL
The frontend expects the backend to be running at: http://localhost:8080
