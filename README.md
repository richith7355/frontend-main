# Online School Fee Management System

B.Tech mini/major project starter using **Spring Boot 3 + React + MySQL**.

## Features
- Student records: add, view, edit, delete
- Fee structure: create and view fee types
- Fee payment records: record a payment and view payment history
- Dashboard summary: total students, fee collected, outstanding balance
- React frontend with Students, Fee Structure, Payments and Dashboard screens
- REST API with request validation and basic error handling

> **Important:** The payment screen records a *demo payment only*. It does not collect money or integrate a real payment gateway. For production, add authentication/authorization, audit logs, HTTPS, CSRF protections as applicable, and a verified Razorpay/Stripe/etc. server-side payment flow.

## Requirements
- Java 17+
- Node.js 20+
- MySQL 8+
- Maven (or use your IDE's Maven support)

## 1. Create the database
Run in MySQL:
```sql
CREATE DATABASE school_fee_db;
```
The backend creates tables automatically on first run.

## 2. Configure backend
Edit `backend/src/main/resources/application.properties` and set your MySQL username/password.

From `backend`:
```bash
mvn spring-boot:run
```
Backend URL: `http://localhost:8080`

## 3. Start frontend
From `frontend`:
```bash
npm install
npm run dev
```
Open the Vite URL shown in terminal (usually `http://localhost:5173`).

## Deploy to Render and Vercel

### Architecture and prerequisites

- Frontend: React 18 + Vite in `frontend/`; Vercel build command `npm run build`,
  output directory `dist`, install command `npm install`.
- Backend: Spring Boot 3.3 + Java 17 + Maven in `backend/`; Render builds the
  Dockerfile at `backend/Dockerfile`. The container listens on Render's `PORT`.
- Database: MySQL 8. Render's managed database is PostgreSQL, so use a separate
  hosted MySQL provider. Do not point a deployed service at `localhost` or
  replace the production database URL with a PostgreSQL URL.
- This demo has no authentication or authorization. Do not enter real student
  or payment data.

The root `.env.example` documents placeholder values only. Configure each
variable in the named platform; do not commit a real `.env` file.

| Variable | Purpose | Configure in |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL for the hosted MySQL database | Render |
| `SPRING_DATASOURCE_USERNAME` | MySQL account name | Render |
| `SPRING_DATASOURCE_PASSWORD` | MySQL account password | Render secret |
| `APP_CORS_ALLOWED_ORIGINS` | Exact Vercel site origin(s), comma-separated, no trailing slash | Render |
| `VITE_API_URL` | Render backend URL followed by `/api` | Vercel |

### Deploy the backend first

1. Push the deployment changes to the GitHub repository's `main` branch.
   In Render, choose **New > Blueprint**, connect `richith7355/frontend-main`,
   and select `render.yaml`. The Blueprint creates the Docker web service.
2. Before deploying, provision a hosted MySQL 8 database with an externally
   reachable connection. In Render's service environment, set
   `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and
   `SPRING_DATASOURCE_PASSWORD` to the database provider's values. Use its
   documented TLS/JDBC connection options; keep the database password secret.
3. Deploy the service. Its health check is `GET /health`; after it passes,
   copy the service's public `https://…onrender.com` URL. The database must
   allow connections from Render. Do not reset or recreate an existing database.

### Deploy the frontend

1. In Vercel, import `richith7355/frontend-main` (or update the existing
   project connected to that repository). Set **Root Directory** to `frontend`.
   Use framework preset **Vite**, install command `npm install`, build command
   `npm run build`, and output directory `dist`. `frontend/vercel.json` already
   rewrites SPA routes to `index.html`.
2. Add `VITE_API_URL` with the Render URL plus `/api`, for example
   `https://your-service.onrender.com/api`, for Production (and Preview if
   preview deployments should use the same backend). Redeploy after adding it.
3. Copy the deployed Vercel site origin, for example
   `https://your-site.vercel.app`, into Render's `APP_CORS_ALLOWED_ORIGINS`
   (origin only, no path or trailing slash), then redeploy the backend.
   For multiple trusted origins, separate them with commas.

### Verify

- Open `https://your-service.onrender.com/health`; expect `{"status":"UP"}`.
- Open `https://your-service.onrender.com/api/dashboard`; expect a JSON
  summary. This endpoint also verifies the MySQL connection.
- Open the Vercel site, then inspect the browser Network/Console for successful
  `/api/` requests and CORS or database errors.
- Render's free web services may spin down when idle. This application does
  not use cookies, authentication, file uploads, or background workers.

## API endpoints
- `GET/POST /api/students`
- `GET/PUT/DELETE /api/students/{id}`
- `GET/POST /api/fee-structures`
- `GET/POST /api/payments`
- `GET /api/payments/student/{studentId}`
- `GET /api/dashboard`

## Example fee structure
Create a fee structure from the UI, then choose a student and fee type in Payments to record a demo payment.

## Project modules (for report)
1. Student Management
2. Fee Structure Management
3. Fee Payment and Receipt Reference
4. Dashboard and Outstanding Fee Calculation
5. MySQL Persistence through Spring Data JPA

## Notes
- This is a learning/demo starter, not a production-ready school finance system.
- Do not enter real student personal data.
- The current outstanding balance is calculated from active fee structures and all recorded payments; a payment is associated with a student and fee structure.
