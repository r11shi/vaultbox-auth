# VX-Auth

VX-Auth is an authentication service for Vaultbox, consisting of a backend server and a frontend application.

## Project Structure

- `backend/`: Express.js server
- `frontend/`: React frontend application

## Prerequisites

- Node.js (v14 or later)
- npm

## Setup and Running

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1h
   RESEND_API_KEY=your_resend_api_key
   FRONTEND_URL=http://localhost:5173
   ```
   Replace `your_jwt_secret` and `your_resend_api_key` with actual values.

4. Start the server:
   ```
   npm run dev
   ```

The server will start on http://localhost:3000.

### Frontend

1. Navigate to the frontend directory:
   ```
   cd vaultbox-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at http://localhost:5173.

## Testing

You can use the following test credentials:

- Email: test@vaultbox.com
- Password: vaultbox123
- OTP: ABC123

## Note

This project is for demonstration purposes only. In a production environment, ensure proper security measures are in place.