
# Pennywise — Expense Tracker

Pennywise is a personal expense tracking application built with Angular and Spring Boot. It helps users record everyday expenses, organize spending by category, and get a quick overview of their spending habits through a simple dashboard.

The project was built to practise full-stack development, REST API integration, and connecting a responsive frontend to a Java backend.

## Features

- **Dashboard overview:** View total spending, transaction count, and the highest-spending category.
- **Add expenses:** Record an expense with a description, amount, category, and date.
- **Transaction history:** View expenses in a table, ordered by date.
- **Category breakdown:** Compare spending across categories with a visual breakdown.
- **Delete expenses:** Remove transactions from the expense list.
- **Input validation:** Prevent invalid expense entries, including missing descriptions, non-positive amounts, and missing categories or dates.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular, TypeScript, HTML, CSS |
| Backend | Java, Spring Boot |
| API | REST, HTTP, JSON |
| Build tools | Angular CLI, npm, Maven Wrapper |

## Getting Started

### Prerequisites

Install the following before running the application:

- [Node.js and npm](https://nodejs.org/)
- [Java 17](https://adoptium.net/)
- Git

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd expense-tracker
```

### 2. Start the backend

Open a terminal and run:

```bash
cd backend
./mvnw spring-boot:run
```

The Spring Boot API will start at:

`http://localhost:8080`

### 3. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:4200` in your browser to use the application.

Keep both terminals running while using Pennywise.

## API Endpoints

The backend exposes the following REST endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Retrieve all expenses |
| `POST` | `/api/expenses` | Create a new expense |
| `DELETE` | `/api/expenses/{id}` | Delete an expense |
| `GET` | `/api/expenses/summary` | Retrieve total and category spending |

### Example: Create an expense

**Request** — `POST /api/expenses`

```json
{
  "description": "Coffee",
  "amount": 4.50,
  "category": "Food",
  "date": "2026-10-27"
}
```

The API validates the input and returns the created expense with its assigned ID.

## Project Structure

```text
expense-tracker/
├── frontend/       # Angular application
├── backend/        # Spring Boot REST API
├── .gitignore
└── README.md
```

## Current Limitations

- **In-memory storage:** Expenses are stored in backend memory and are lost when the backend restarts.
- **Local development:** The frontend and backend are configured to run locally.
- **Single-user prototype:** Authentication and user-specific expense records are not implemented.

## Future Improvements

- Add persistent storage using PostgreSQL.
- Introduce user authentication and individual expense accounts.
- Add expense editing, filtering, and date-range selection.
- Add monthly spending trends and budget tracking.
- Write automated unit and integration tests.
