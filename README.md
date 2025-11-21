# Helix RBAC

A production-ready, full-stack admin dashboard implementing comprehensive Role-Based Access Control (RBAC). Built with Next.js 15, TypeScript, Prisma, and PostgreSQL.

## Introduction

Helix RBAC is designed to serve as a robust foundation for enterprise-grade applications requiring granular access control. It provides a secure and scalable architecture for managing users, projects, and tasks across different authorization levels. The system distinguishes between three primary roles: Admin, Manager, and User, each with specific permissions and workflows.

## Architecture

The application follows a modern full-stack architecture leveraging the T3 stack principles for type safety and performance.

### Core Technologies

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript 5
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Authentication**: NextAuth.js (Auth.js)
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui (Radix UI)
*   **Deployment**: Vercel

### System Design

The project is structured around a modular architecture:

*   **Authentication Layer**: Handles secure user sessions using JWT strategy with support for Credentials and OAuth providers.
*   **Authorization Layer**: Middleware-based protection ensuring routes and API endpoints are accessible only to authorized roles.
*   **Data Layer**: Type-safe database interactions via Prisma Client, ensuring data integrity and efficient querying.
*   **Presentation Layer**: Server Components for performance and Client Components for interactivity, styled with utility-first CSS.

## Features

### Authentication and Security
*   Secure email and password login with bcrypt hashing.
*   Google OAuth integration.
*   Role-based middleware protection for routes and APIs.
*   Session management using JSON Web Tokens.

### Role-Based Access Control
*   **Admin**: Full system access, user management, system-wide reporting, and audit log viewing.
*   **Manager**: Project creation, task assignment, and team progress monitoring.
*   **User**: Personal task management, profile updates, and status reporting.

### Data Management
*   Comprehensive CRUD operations for Users, Projects, and Tasks.
*   Relational data modeling with foreign key constraints.
*   Automated audit logging for critical system actions.

### User Interface
*   Responsive design adapting to mobile, tablet, and desktop screens.
*   System-wide dark mode support.
*   Interactive data tables with search, filter, and pagination.
*   Real-time feedback via toast notifications.

## Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites

*   Node.js 18 or higher
*   npm or yarn package manager
*   PostgreSQL database (local or cloud-hosted)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/helix-rbac.git
    cd helix-rbac
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env.local` file in the root directory and add the following configuration:
    ```env
    DATABASE_URL="postgresql://username:password@host:port/database"
    NEXTAUTH_SECRET="your-secure-random-string"
    NEXTAUTH_URL="http://localhost:3000"
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"
    ```

4.  Initialize the database:
    ```bash
    npx prisma generate
    npx prisma db push
    npm run seed
    ```

5.  Start the development server:
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

### Default Credentials

Use the following credentials to test different roles:

*   **Admin**: admin@helix.com / password123
*   **Manager**: manager@helix.com / password123
*   **User**: user1@helix.com / password123

## Deployment

The project is optimized for deployment on Vercel.

1.  Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Import the project into Vercel.
3.  Configure the environment variables in the Vercel dashboard.
4.  Deploy.

For database hosting, services like Neon, Railway, or Supabase are recommended for PostgreSQL.

## Contributing

Contributions are welcome to improve the project. Please follow the standard fork-and-pull request workflow.

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewFeature`).
3.  Commit your changes (`git commit -m 'Add NewFeature'`).
4.  Push to the branch (`git push origin feature/NewFeature`).
5.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.