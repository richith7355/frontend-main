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

The Render backend needs an externally hosted MySQL database; Render's managed
database offering is PostgreSQL, which this project does not use. Do not use a
local MySQL address such as `localhost` for the deployed database.

1. In Render, create a Blueprint from this repository using `render.yaml`.
   Set `SPRING_DATASOURCE_URL` to the MySQL JDBC URL, and provide its username
   and password as the requested secret environment variables.
2. In Vercel, import the repository and set the project root to `frontend`.
   Set `VITE_API_URL` to the deployed Render service URL followed by `/api`
   (for example, `https://your-service.onrender.com/api`) before deploying.
3. Set `APP_CORS_ALLOWED_ORIGINS` on Render to the Vercel site origin, without
   a trailing slash (for example, `https://your-site.vercel.app`). Redeploy the
   Render service after setting it.

The Vercel configuration serves the Vite single-page app, and the Render
configuration builds and runs the Spring Boot backend. Render's free web
services may spin down when idle.

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
