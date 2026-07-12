# Concert Ticketing System

Concert Ticketing system featuring a Next.js frontend and a NestJS/PostgreSQL backend. It handles secure JWT authentication, role-based access control (Admin/User), and race-condition-proof seat reservations.

---

## 🚀 Prerequisites
* **Docker & Docker Compose**
* **Node.js** (v20.9.0+)
* **pnpm** (v8+)

### Environment Setup
Create a `.env` file in the **root** of your project and add the following:
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=password123
POSTGRES_DB=concert_tickets
JWT_SECRET=super_secret_concert_key_123
```

### 💻 Development Setup (Local Testing)
Clone the repository:

```Bash
git clone https://github.com/Puriwat-dev/concert-ticketing-app.git
cd concert-ticketing-app

```

Create a .env file inside the backend directory with the following variables:
```Bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=password123
DB_NAME=concert_tickets

JWT_SECRET=super_secret_concert_key_123
```

1. Start the Database:
```Bash
docker compose up db -d
```
2. Start the Backend:
Open a new terminal window:

```Bash
cd backend
pnpm install
pnpm migration:run
pnpm start:dev
```

3. Start the Frontend:
Open a third terminal window:

```Bash
cd frontend
pnpm install
pnpm dev
```
Your development environment is now live at http://localhost:3001.


### 🌍 Production Setup

1. Build and start all services (Database, Backend, Frontend):
```bash
docker-compose up -d --build
```

2. Run Database Migrations (Execute inside the backend container):
```
docker-compose exec backend pnpm migration:run
```

Access the Application:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000


### 🏛️ Architecture & Project Structure

Folder Structure
```
Plaintext

concert-ticketing-app/
├── docker-compose.yml          # Docker deployment config (DB, Backend, Frontend)
├── .env                        # Shared root environment variables
│
├── backend/                    # NestJS API
│   ├── Dockerfile              # Production-ready Node 20 image
│   ├── .env                    # Internal DB connection and JWT variables
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts             # Entry point, Global Pipes, and CORS setup
│       ├── app.module.ts       # Root application module
│       ├── data-source.ts      # TypeORM configuration for migrations
│       │
│       ├── auth/               # Authentication & Authorization
│       │   ├── auth.controller.ts      
│       │   ├── auth.controller.spec.ts # Tests login role fallbacks
│       │   ├── auth.service.ts         
│       │   ├── auth.service.spec.ts    # Tests JWT generation & password hashing
│       │   ├── auth.module.ts
│       │   ├── dto/                    # RegisterDto, LoginDto, LoginQueryDto
│       │   └── guards/                 # JwtAuthGuard, RolesGuard
│       │
│       ├── users/              # User Management
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   ├── users.module.ts
│       │   ├── dto/   
│       │   └── entities/
│       │       └── user.entity.ts      # User schema & UserRole Enum (ADMIN/USER)
│       │
│       ├── concerts/           # Concert CRUD & Seating
│       │   ├── concerts.controller.ts
│       │   ├── concerts.controller.spec.ts 
│       │   ├── concerts.service.ts     
│       │   ├── concerts.service.spec.ts # Tests creation & availableSeats logic
│       │   ├── concerts.module.ts
│       │   ├── dto/                    # CreateConcertDto
│       │   └── entities/
│       │       └── concert.entity.ts   # Schema with totalSeats & availableSeats
│       │
│       ├── reservations/       # Event-Sourced Ledger Booking System
│       │   ├── reservations.controller.ts
│       │   ├── reservations.service.ts # Pessimistic Locking & Transaction logic
│       │   ├── reservations.service.spec.ts # Tests 1-seat limit & full capacity
│       │   ├── reservations.module.ts
│       │   ├── dto/                    # CreateReservationDto
│       │   └── entities/
│       │       └── reservation.entity.ts # Ledger schema & ReservationAction Enum
│       │
│       ├── common/             # Shared utilities
│       │   └── decorators/
│       │       └── roles.decorator.ts  # Custom @Roles() decorator for endpoints
│       │
│       └── migrations/         # TypeORM generated schema updates
│           └── *-InitialSchema.ts      # Consolidated database generation file
│
└── frontend/                   # Next.js Client
    ├── Dockerfile              # Production-ready Node 20 image (Exposes Port 3001)
    ├── .dockerignore           # Prevents local node_modules from caching
    ├── package.json
    ├── pnpm-lock.yaml
    └── src/
        ├── app/                # App Router routes (/(auth), /(dashboard))
        ├── components/         # Reusable UI components (Cards, Modals, Forms)
        └── lib/                # API fetchers, custom hooks, Zod validation
```

Frontend (Next.js App Router)
Routing & RBAC: Custom hooks decode JWTs to dynamically adapt the UI and protect routes.

Data Flow: A custom fetcher intercepts API errors (e.g., 400 Bad Request) and translates them into standard UI Toast notifications.

Libraries: Next.js, Tailwind CSS, React Hook Form, Zod (strict payload validation), React Hot Toast.

Backend (NestJS Clean Architecture)
Layered Pattern: Controllers (Routing/Validation), Services (Business Logic), and DTOs (Type-checking).

Libraries: NestJS, TypeORM, PostgreSQL, Passport/JWT, Bcrypt, Class Validator, Jest.

### 🧪 Test Execution Commands
The backend includes a comprehensive test suite (Jest) covering CRUD handlers, reservation edge cases, and JWT authentication logic.

```Bash
cd backend
pnpm test
```


### From Bonus Tasks
##### Performance Optimization:
To handle massive scale across the stack, I would implement:
Database Indexing: Add B-Tree indexes on frequent foreign keys (concertId, userId) and action columns.

##### Concurrency Control:
Backend (Pessimistic Locking): When a user books a seat, the backend initiates a TypeORM transaction with a pessimistic_write lock (SELECT ... FOR UPDATE). This queues all 1,000 simultaneous requests   sequentially at the database row level. Once availableSeats drops to 0, the lock forces the remaining 990 requests to read the updated capacity, safely rejecting them.
