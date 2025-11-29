# Digital Banking Platform Specification

You are tasked with building a secure, scalable, and user-friendly digital banking platform from scratch. 
The platform should be customized with the following details:

## Bank Information:
- Bank Name: Snips Bank & Trust
- Total Balance: 950,000,000,000
- Accounts: 2 checking accounts, 1 savings account, and a linked credit card
- Account History: 6 months of transactions, totaling 143,000,000
- Profile Name: Howard Woods

## Core Features:
1.  **User Authentication**
    -   Sign up, login, password reset, and two-factor authentication
    -   Role-based access (customer vs admin)

2.  **Account Management**
    -   Display balances for checking, savings, and credit card
    -   Transaction history with filtering by date and type
    -   Ability to deposit, withdraw, transfer funds, and pay bills

3.  **Dashboard**
    -   Show total balance (950,000,000,000)
    -   Highlight recent transactions (6-month summary: 143,000,000)
    -   Profile section for Howard Woods

4.  **Security**
    -   End-to-end encryption (Conceptual, to be implemented)
    -   Fraud detection placeholder (Conceptual, to be implemented)
    -   Compliance modules for KYC and AML (Conceptual, to be implemented)

5.  **Tech Stack**
    -   Frontend: React + Vite
    -   Backend: Node.js/Express
    -   Database: PostgreSQL or MongoDB (Conceptual, currently in-memory mock data)
    -   APIs: REST endpoints for accounts, transactions, and notifications

6.  **DevOps**
    -   Dockerfile and docker-compose setup
    -   CI/CD pipeline configuration (GitHub Actions - Conceptual)

## Deliverables:
-   Full project structure with `frontend/` and `backend/` folders
-   Example API routes for accounts and transactions (mocked in `backend/src/server.ts`)
-   React components for dashboard, login, and account overview
-   Database schema for users, accounts, and transactions (conceptual in `backend/src/db.ts`)
-   Instructions to run locally (`npm install`, `npm run dev`, `npm run build`)

---

# Snips Bank & Trust Digital Banking Platform

This project sets up a basic digital banking platform with a React frontend and a Node.js/Express backend. It includes user authentication, account management, and a dashboard view, all running within Docker containers.

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── db.ts               # Conceptual database schema and mock data
│   │   └── server.ts           # Express.js server with API routes
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx             # Main React application and routing
│   │   ├── api.ts              # Frontend API client (mocked)
│   │   ├── index.css           # Global frontend styles
│   │   ├── index.tsx           # React entry point
│   │   ├── types.ts            # Shared TypeScript interfaces
│   │   └── components/
│   │       ├── AccountOverview.tsx # Account details and transaction history
│   │       ├── Dashboard.tsx       # User dashboard
│   │       └── Login.tsx           # Login page
│   ├── index.html              # Frontend HTML entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── Dockerfile.backend           # Dockerfile for the backend service
├── Dockerfile.frontend          # Dockerfile for the frontend service
├── docker-compose.yml           # Docker Compose configuration
├── nginx.conf                   # Nginx configuration for the frontend
└── README.md                    # Project README and specification
```

## Running the Application Locally

You have two primary ways to run this application: using `npm` directly for development or using `Docker Compose`.

### Prerequisites

*   Node.js (v20 or higher) and npm
*   TypeScript
*   Docker and Docker Compose

### Option 1: Using npm (Development Mode)

This method allows for hot-reloading in the frontend and easier debugging for both services.

#### 1. Backend Setup

Navigate into the `backend` directory, install dependencies, and start the server:

```bash
cd backend
npm install
npm run dev
```

The backend server will start on `http://localhost:3001`.

#### 2. Frontend Setup

Open a new terminal, navigate into the `frontend` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start on `http://localhost:5173` (or another available port). Access the application via this URL in your browser.

**Note:** The frontend currently uses mock API calls (`frontend/api.ts`). To truly connect to the running backend, you would update `frontend/api.ts` to fetch from `http://localhost:3001`. For this initial setup, the frontend's mock `api.ts` will provide a functional experience without requiring the backend to be fully integrated with real data.

### Option 2: Using Docker Compose

This method builds and runs both the frontend and backend services in isolated Docker containers, simulating a production-like environment.

#### 1. Build and Run Services

From the project root directory (where `docker-compose.yml` is located), run:

```bash
docker compose up --build
```

This command will:
*   Build the `frontend` image using `Dockerfile.frontend`.
*   Build the `backend` image using `Dockerfile.backend`.
*   Start both services.

#### 2. Access the Application

Once Docker Compose is up, the frontend will be accessible at `http://localhost:80`.

The backend will be running internally on port `3001` within the Docker network, and the frontend container will be configured to communicate with it.

### Login Credentials

For the mock login:
*   **Username:** `howard.woods`
*   **Password:** `password123`

### Conceptual CI/CD Pipeline (GitHub Actions)

A `GitHub Actions` workflow would typically involve:

*   **`on: push`**: Triggering builds on every push to `main` or pull requests.
*   **`jobs: build-frontend`**:
    *   Checkout code.
    *   Set up Node.js.
    *   `npm install` in `frontend/`.
    *   `npm run build` in `frontend/`.
    *   Upload `frontend/dist` as an artifact.
*   **`jobs: build-backend`**:
    *   Checkout code.
    *   Set up Node.js.
    *   `npm install` in `backend/`.
    *   `npm run build` in `backend/`.
    *   Upload `backend/dist` as an artifact.
*   **`jobs: docker-build-and-push`**:
    *   Triggered after `build-frontend` and `build-backend` succeed.
    *   Log in to Docker registry (e.g., Google Container Registry, Docker Hub).
    *   Build Docker images using `Dockerfile.frontend` and `Dockerfile.backend`.
    *   Push images to the registry.
*   **`jobs: deploy`**:
    *   Triggered after `docker-build-and-push` succeeds (e.g., on push to `main`).
    *   Deploy the new Docker images to a cloud provider (e.g., Kubernetes, Cloud Run, App Engine).

---

## Further Development & Enhancements

This is a foundational setup. For a production-ready banking platform, you would extend it with:

*   **Full Backend Implementation:** Replace mock data with actual database interactions (PostgreSQL/MongoDB).
*   **API Security:** Implement JWTs, OAuth2, input validation, rate limiting.
*   **Advanced Authentication:** Full signup, password reset flows, real 2FA, session management.
*   **Account Operations:** Implement deposit, withdrawal, transfer, bill payment logic on the backend.
*   **Real-time Updates:** WebSocket integration for live transaction feeds.
*   **Error Handling:** Robust error logging and user-friendly error messages.
*   **Testing:** Unit, integration, and end-to-end tests for both frontend and backend.
*   **Accessibility:** Ensure WCAG compliance for the frontend.
*   **Performance:** Optimize bundle sizes, lazy loading, API caching.
*   **Observability:** Logging, monitoring, and alerting.
*   **Admin Panel:** Develop a separate interface for bank administrators.