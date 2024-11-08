# VX-Auth Frontend

This is the frontend application for the VX-Auth project, built with React and Vite.

## Prerequisites

- Node.js (v14 or later)
- npm

## Setup

1. Navigate to the frontend directory:
   ```
   cd vx-auth/vaultbox-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Change the login email and password according to your choice 
   ```
   
   ```
    

## Running the Application

Start the development server: npm run dev


The application will be available at http://localhost:5173.


## Project Structure

- `src/`: Source files
  - `components/`: React components
  - `pages/`: Page components
  - `services/`: API and authentication services
  - `assets/`: Static assets like images and icons
- `public/`: Public assets

## Customization

- To change the application title, modify the `<title>` tag in `index.html`
- To update styles, modify `src/index.css` or the respective component's CSS file
- To add new routes, update the routing configuration in `src/App.jsx`

## Environment Variables

- `VITE_API_URL`: The URL of the backend API

Make sure to update the `.env` file if you change the backend URL or port.

## Notes for Developers

- This project uses Vite for fast development and building
- Tailwind CSS is used for styling
- The application uses React Router for navigation
- API calls are made using Axios

## Security Considerations

- Ensure that sensitive information is not stored in the frontend code
- Use HTTPS in production to secure data in transit
- Implement proper authentication and authorization checks