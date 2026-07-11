# FoodDelivery MERN Stack Workspace

This workspace contains the frontend and backend projects for the Food Delivery application.

## Project Structure

- **`frontend/`**: React SPA built with Vite, TypeScript, and TailwindCSS v4.
- **`backend/`**: Node.js + Express API server built with TypeScript, Mongoose, and a Mock database fallback.

## Getting Started

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Note: If no MongoDB connection URI is configured in `.env`, the server will gracefully fallback to an in-memory mock database.*

### 2. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
