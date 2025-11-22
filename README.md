# HelixRBAC - [Link](https://helixrbac.vercel.app/)

### **Secure. Scalable. Simple.**
*The ultimate starter kit for Role-Based Access Control in Next.js.*

---

Think of this project as the "digital traffic controller" for your team's workflow. In any growing application, you need to make sure the right people have access to the right things. You wouldn't want an intern accidentally deleting your entire database, right?

**HelixRBAC** solves this by implementing a robust **Role-Based Access Control (RBAC)** system right out of the box. It's a full-stack task and project management dashboard where:
*   **Admins** rule the world (manage users, view audit logs).
*   **Managers** run the show (create projects, assign tasks).
*   **Users** get work done (view tasks, update statuses).

Whether you're learning how to build secure apps or looking for a solid foundation for your next SaaS, you're in the right place.

---

    flowchart TD

    %% ---------- STYLES ----------
    classDef start fill:#f7e7ff,stroke:#7a1fa2,stroke-width:2px,color:#000
    classDef decision fill:#e6eeff,stroke:#4c6ef5,stroke-width:2px,color:#000
    classDef admin fill:#ffe5e5,stroke:#e03131,stroke-width:2px,color:#000
    classDef manager fill:#e8ffe8,stroke:#2f9e44,stroke-width:2px,color:#000
    classDef user fill:#e7f1ff,stroke:#1c7ed6,stroke-width:2px,color:#000
    classDef feature fill:#fff,stroke:#888,stroke-width:1px,color:#000

    %% ---------- MAIN FLOW ----------
    A[User Visits App]:::start --> B{Has Account?}:::decision

    B -- No --> C[Sign Up]:::feature
    B -- Yes --> D[Log In]:::feature

    D --> E{Check Role}:::decision

    %% ---------- ADMIN ----------
    E -- ADMIN --> F[Admin Dashboard]:::admin
    F --> F1[Manage Users]:::feature
    F --> F2[View Audit Logs]:::feature
    F --> F3[System Stats]:::feature

    %% ---------- MANAGER ----------
    E -- MANAGER --> G[Manager Dashboard]:::manager
    G --> G1[Create Projects]:::feature
    G --> G2[Assign Tasks]:::feature
    G --> G3[Track Progress]:::feature

    %% ---------- USER ----------
    E -- USER --> H[User Dashboard]:::user
    H --> H1[View My Tasks]:::feature
    H --> H2[Update Task Status]:::feature
    H --> H3[Profile Settings]:::feature


---

## Key Features

We've packed this with everything you need to hit the ground running:

*   **Secure Authentication:** Powered by NextAuth.js (Credentials & Google support).
*   **Role-Based Protection:** Middleware that actively guards routes based on user roles.
*   **User Management:** Admins can add, edit, delete, and view all users.
*   **Audit Logging:** Every critical action is recorded. Who did what, and when? You'll know.
*   **Project & Task Management:** Create projects, set priorities, and assign tasks to team members.
*   **Real-time Notifications:** Get alerted when a task is assigned to you.
*   **Data Export:** Admins can export user data to CSV with one click.
*   **Modern UI:** Built with Tailwind CSS and Radix UI for a sleek, accessible experience.

---

## The Tech Stack

We use the latest and greatest tools to ensure performance and developer happiness.

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Auth:** [NextAuth.js](https://next-auth.js.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Components:** [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
*   **Validation:** [Zod](https://zod.dev/)

---

## Getting Started & Deployment

Ready to dive in? Follow these simple steps to get HelixRBAC running on your machine or deployed to production.

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/helix-rbac.git
cd helix-rbac
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory (or copy `.env.local`).

```env
# Database (PostgreSQL) - Local or Cloud (Neon/Railway/Supabase)
DATABASE_URL="postgresql://user:password@host:5432/helix_rbac?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000" # Use https://your-domain.com for production
NEXTAUTH_SECRET="your-super-secret-key-change-this"

# Optional: Google Auth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 3. Database Initialization
We use Prisma to manage our database schema.

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data (Admin, Manager, User)
npx prisma db seed
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 5. Production Deployment (Vercel)
1.  **Push to GitHub.**
2.  **Import to Vercel:** Select your repo.
3.  **Configure Env Vars:** Add `DATABASE_URL`, `NEXTAUTH_SECRET`, etc. in Vercel settings.
4.  **Deploy:** Vercel will build and deploy your app.
5.  **Post-Deploy:** Update `NEXTAUTH_URL` to your production domain and check Google OAuth redirect URIs.

---

## Project Structure

Here's a quick tour of how we organized the code:

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/          # Login & Signup pages
│   ├── api/             # Backend API routes
│   ├── dashboard/       # Protected dashboard routes (Admin/Manager/User)
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components
│   ├── ui/              # Basic building blocks (Buttons, Inputs, Cards)
│   └── layout/          # Sidebar, Navbar, etc.
├── lib/                 # Utility functions & configurations
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Database client
│   └── utils.ts         # Helper functions
├── middleware.ts        # The security guard (RBAC logic)
└── types/               # TypeScript type definitions
```

---

## System Architecture

### Authentication Flow
1.  **Login:** Users authenticate via Email/Password or Google OAuth (NextAuth.js).
2.  **Session:** A JWT session is created containing the user's ID and Role.
3.  **Protection:** Middleware checks the session token for protected routes.
4.  **RBAC:** Middleware and API routes verify the user's role against required permissions.

### Role-Based Access Control (RBAC)
*   **ADMIN:** Full system access, User management, System stats, Audit logs.
*   **MANAGER:** Project & Task management, Team progress tracking.
*   **USER:** View assigned tasks, Update task status, Profile management.

### Database Schema
Built on PostgreSQL and managed via Prisma. Key models:
*   **User:** Profile & Role info.
*   **Project:** Managed by Managers/Admins.
*   **Task:** Units of work assigned to Users.
*   **AuditLog:** Records critical actions.
*   **Notification:** System alerts.

### API Routes
*   **Auth:** `/api/auth/*` (Login, Logout, Session)
*   **Users:** `/api/users` (Admin only)
*   **Projects:** `/api/projects` (CRUD)
*   **Tasks:** `/api/tasks` (CRUD, Role-filtered)
*   **Admin:** `/api/admin/stats`, `/api/admin/audit-logs`

---

## Testing & QA Strategy

We ensure stability through a rigorous testing checklist covering all roles and features.

### Core Testing Areas
*   **Authentication:** Verify Login (Email/Google), Logout, Session persistence, and Route protection.
*   **Admin Role:** Test User management (CRUD), System stats, and Audit log access.
*   **Manager Role:** Verify Project creation, Task assignment, and Team oversight.
*   **User Role:** Ensure access is limited to assigned tasks and personal profile.
*   **UI/UX:** Check Dark mode, Mobile responsiveness, and Form validation.


---

## Development Workflow

We follow a structured Git workflow to ensure code quality and history cleanliness.

### Branching Strategy
*   `main`: Production-ready code.
*   `feature/*`: New features (e.g., `feature/task-management`).
*   `fix/*`: Bug fixes (e.g., `fix/login-error`).
*   `docs/*`: Documentation updates.

### Contribution Steps
1.  **Fork & Clone:** Get your own copy of the repo.
2.  **Create Branch:** `git checkout -b feature/amazing-feature`
3.  **Commit:** Use conventional commits (e.g., `feat: add user profile`).
4.  **Push:** `git push origin feature/amazing-feature`
5.  **Pull Request:** Open a PR against the `main` branch.

---

## Access & Usage Guide

Once the app is running, you can log in with these pre-configured test accounts to explore different roles.

### Admin Access
*   **Email:** `admin@helix.com`
*   **Password:** `password123`
*   **Capabilities:** Full system control, User management, Audit logs.

### Manager Access
*   **Email:** `manager@helix.com`
*   **Password:** `password123`
*   **Capabilities:** Create projects, Assign tasks, View team progress.

### User Access
*   **Email:** `user1@helix.com`
*   **Password:** `password123`
*   **Capabilities:** View assigned tasks, Update status, Edit profile.

> **Note:** If these credentials don't work, run `npx prisma db seed` to reset the database.

