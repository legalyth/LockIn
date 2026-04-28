# Lock-In

A secure, full-stack Kanban-style task management application with JWT authentication. Organize your work across three columns — **To Do**, **Doing**, and **Done** — with priority levels, due dates, tags, and full CRUD operations.

## Tech Stack

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Frontend         | Vue.js 3 (Composition API)  |
| Styling          | Tailwind CSS                |
| State            | Pinia                       |
| Router           | Vue Router 4                |
| Build Tool       | Vite                        |
| HTTP Client      | Axios                       |
| Backend          | Node.js + Express.js        |
| Database         | MySQL 8.0                   |
| Auth             | JWT (jsonwebtoken) + bcrypt |
| Security Headers | Helmet.js                   |
| Rate Limiting    | express-rate-limit          |

## Prerequisites

- **Node.js** v18 or later
- **MySQL** 8.0 or later
- A MySQL client (e.g., MySQL Workbench, TablePlus, or the `mysql` CLI)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/legalyth/LockIn.git
cd lockin
```

### 2. Install all dependencies

```bash
# Root dependencies (concurrently)
npm install

# Backend dependencies
cd backend && npm install && cd ..

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Create the MySQL database

Open your MySQL client and run the schema:

```bash
mysql -u root -p < backend/db/schema.sql
```

Or copy-paste the contents of `backend/db/schema.sql` into your MySQL client.

### 4. Configure the backend environment

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
CLIENT_ORIGIN=http://localhost:5173
```

> **Important:** Change `JWT_SECRET` to a long, random string before deploying to production.

### 5. Start the application

**Option A — Both servers at once (recommended):**

```bash
# From the project root
npm run dev
```

**Option B — Separately:**

```bash
# Terminal 1 — Backend API (http://localhost:3000)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## API Endpoints

| Method | Route              | Auth Required | Description                 |
| ------ | ------------------ | :-----------: | --------------------------- |
| POST   | /api/auth/register |      No       | Register a new user         |
| POST   | /api/auth/login    |      No       | Login and receive a JWT     |
| PATCH  | /api/auth/profile  |      Yes      | Update username or password |
| GET    | /api/tasks         |      Yes      | Get all tasks for the user  |
| POST   | /api/tasks         |      Yes      | Create a new task           |
| PATCH  | /api/tasks/:id     |      Yes      | Update an existing task     |
| DELETE | /api/tasks/:id     |      Yes      | Delete a task               |

Protected routes require the `Authorization: Bearer <token>` header.

---

## Project Structure

```
lockin/
├── package.json                # Root — concurrently script
├── backend/
│   ├── server.js               # Express app entry point
│   ├── .env                    # Environment variables (not committed)
│   ├── .env.example            # Environment variable template
│   ├── package.json
│   ├── db/
│   │   ├── connection.js       # MySQL connection pool (mysql2/promise)
│   │   └── schema.sql          # Database schema (users + tasks)
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── controllers/
│   │   ├── authController.js   # register(), login(), updateProfile()
│   │   └── taskController.js   # getTasks(), createTask(), updateTask(), deleteTask()
│   ├── routes/
│   │   ├── auth.js             # POST /api/auth/register, /login, PATCH /api/auth/profile
│   │   └── tasks.js            # GET/POST/PATCH/DELETE /api/tasks (protected)
│   └── utils/
│       ├── hash.js             # bcrypt helpers: hashPassword(), verifyPassword()
│       └── jwt.js              # JWT helpers: generateToken(), verifyToken()
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
│       │   └── axios.js        # Axios instance with auth interceptors
│       ├── router/
│       │   └── index.js        # Vue Router with auth guards
│       ├── stores/
│       │   ├── authStore.js    # Auth: login/register/logout, token management
│       │   ├── taskStore.js    # Tasks: CRUD, search, filter, sort
│       │   ├── themeStore.js   # Dark mode toggle with localStorage persistence
│       │   └── toastStore.js   # Global toast notification queue
│       ├── views/
│       │   ├── LoginView.vue
│       │   ├── RegisterView.vue
│       │   ├── DashboardView.vue
│       │   ├── ProfileView.vue
│       │   └── NotFoundView.vue
│       └── components/
│           ├── NavBar.vue
│           ├── KanbanBoard.vue
│           ├── KanbanColumn.vue
│           ├── TaskCard.vue
│           ├── TaskModal.vue
│           ├── ConfirmModal.vue
│           └── ToastContainer.vue
│
└── README.md
```

## Features

- **JWT Authentication** — Register, login, logout with tokens stored in localStorage or sessionStorage ("Remember me")
- **Session Management** — 24h token expiry, 5-minute warning toast, auto-logout on expiry, 401 interception
- **Profile Editing** — Update username and password from the profile page
- **Kanban Board** — Three columns: To Do, Doing, Done
- **Task Management** — Full CRUD: create, edit, delete, and move tasks between columns
- **Task Attributes** — Title, description, status, priority (low/medium/high), due date, tags
- **Real-time Search & Filter** — Filter by title/description, priority, sort by newest/due date/priority
- **Overdue Detection** — Red border and badge on overdue cards, overdue counter in stats banner
- **Statistics Banner** — Total, done, doing, overdue counts with a progress bar
- **Dark Mode** — Full Tailwind dark mode toggle persisted in localStorage
- **Toast Notifications** — Success/error/info toasts with auto-dismiss
- **Delete Confirmation** — Modal dialog before destructive delete actions
- **Responsive Design** — Single column on mobile, three-column grid on desktop
- **Security** — bcrypt password hashing, JWT signing, parameterized SQL queries, Helmet.js headers, rate limiting, CORS restriction, ownership enforcement on all task queries
