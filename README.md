# Lock-In

A secure, full-stack Kanban-style task management application with JWT authentication. Organize your work across three columns — **To Do**, **Doing**, and **Done** — with priority levels, due dates, and full CRUD operations.

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Frontend | Vue.js 3 (Composition API)  |
| Styling  | Tailwind CSS                |
| State    | Pinia                       |
| Router   | Vue Router 4                |
| Backend  | Node.js + Express.js        |
| Database | MySQL                       |
| Auth     | JWT (jsonwebtoken) + bcrypt |

## Prerequisites

- **Node.js** v18 or later
- **MySQL** 8.0 or later
- A MySQL client (e.g., MySQL Workbench, TablePlus, or the `mysql` CLI)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd lockin
```

### 2. Create the MySQL database

Open your MySQL client and run the schema:

```bash
mysql -u root -p < backend/db/schema.sql
```

Or copy-paste the contents of `backend/db/schema.sql` into your MySQL client.

### 3. Configure the backend environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and fill in your values:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=lockin
JWT_SECRET=change_this_to_a_long_random_secret
PORT=3000
```

> **Important:** Change `JWT_SECRET` to a long, random string before deploying to production.

### 4. Start the backend server

```bash
cd backend
npm install
node server.js
```

The API will be available at `http://localhost:3000`.

### 5. Start the frontend dev server

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Route              | Auth Required | Description             |
| ------ | ------------------ | :-----------: | ----------------------- |
| POST   | /api/auth/register |      No       | Register a new user     |
| POST   | /api/auth/login    |      No       | Login and receive a JWT |
| GET    | /api/tasks         |      Yes      | Get all tasks for user  |
| POST   | /api/tasks         |      Yes      | Create a new task       |
| PATCH  | /api/tasks/:id     |      Yes      | Update an existing task |
| DELETE | /api/tasks/:id     |      Yes      | Delete a task           |

Protected routes require the `Authorization: Bearer <token>` header.

---

## Project Structure

```
lockin/
├── backend/
│   ├── server.js               # Express app entry point
│   ├── .env                    # Environment variables (not committed)
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   ├── db/
│   │   ├── connection.js       # MySQL connection pool
│   │   └── schema.sql          # Database schema
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── controllers/
│   │   ├── authController.js   # Register/login logic
│   │   └── taskController.js   # CRUD task logic
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   └── tasks.js            # Task routes (protected)
│   └── utils/
│       ├── hash.js             # bcrypt helpers
│       └── jwt.js              # JWT helpers
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.js             # App entry point
│       ├── App.vue             # Root component
│       ├── style.css           # Tailwind directives
│       ├── api/
│       │   └── axios.js        # Axios instance with interceptors
│       ├── router/
│       │   └── index.js        # Vue Router with auth guards
│       ├── stores/
│       │   ├── authStore.js    # Pinia auth store
│       │   └── taskStore.js    # Pinia task store
│       ├── views/
│       │   ├── LoginView.vue
│       │   ├── RegisterView.vue
│       │   └── DashboardView.vue
│       └── components/
│           ├── NavBar.vue
│           ├── KanbanBoard.vue
│           ├── KanbanColumn.vue
│           ├── TaskCard.vue
│           └── TaskModal.vue
│
└── README.md
```

## Features

- **JWT Authentication** — Secure register/login with tokens stored in localStorage
- **Kanban Board** — Three columns: To Do, Doing, Done
- **Task Management** — Create, edit, delete, and move tasks between columns
- **Priority Levels** — Low (green), Medium (yellow), High (red)
- **Due Dates** — Optional date picker per task
- **Ownership Enforcement** — Users can only access their own tasks
- **Responsive Design** — Works on mobile and desktop
- **SQL Injection Prevention** — All queries use parameterized placeholders
