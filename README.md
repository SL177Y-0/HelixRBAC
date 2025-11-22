# HelixRBAC

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

##  How It Works (The Flow)

Here is a simple visualization of how our security logic works. No complex jargon, just a clear path for every user.

```mermaid
graph TD
    A[User Visits App] --> B{Has Account?}
    B -- No --> C[Sign Up]
    B -- Yes --> D[Log In]
    D --> E{Check Role}
    
    E -- "ADMIN" --> F[Admin Dashboard]
    F --> F1[Manage Users]
    F --> F2[View Audit Logs]
    F --> F3[System Stats]
    
    E -- "MANAGER" --> G[Manager Dashboard]
    G --> G1[Create Projects]
    G --> G2[Assign Tasks]
    G --> G3[Track Progress]
    
    E -- "USER" --> H[User Dashboard]
    H --> H1[View My Tasks]
    H --> H2[Update Task Status]
    H --> H3[Profile Settings]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:2px
    style F fill:#ff9999,stroke:#333,stroke-width:2px
    style G fill:#99ff99,stroke:#333,stroke-width:2px
    style H fill:#99ccff,stroke:#333,stroke-width:2px
```

---

##  Key Features

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

## 🚀 Getting Started & Deployment

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

##  System Architecture

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

## Contributing

Found a bug? Want to add a cool feature? We love contributions!
1.  Fork the repo.
2.  Create a new branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes.
4.  Push to the branch.
5.  Open a Pull Request.

---

