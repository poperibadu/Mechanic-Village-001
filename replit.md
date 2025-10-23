# Mechanic Village - Auto Parts Marketplace

## Overview
Mechanic Village is a modern, responsive single-page application (SPA) designed as a marketplace for automotive parts and services. It is built with vanilla HTML, CSS, and JavaScript, and powered by Google Firebase for backend services.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Google Firebase
  - Firestore: Database and real-time data synchronization
  - Firebase Authentication: User management
  - Firebase Hosting: Deployment (optional)
- **Server**: Python 3.11 HTTP server for local development

## Project Structure
- `index.html` - Main HTML file with all page sections
- `style.css` - All styles for the application
- `script.js` - JavaScript logic, Firebase integration, and interactivity
- `firebase.json` - Firebase hosting configuration
- `server.py` - Python HTTP server with cache control for development

## Key Features
- User Authentication (signup/login)
- Dynamic Product Listings with filters
- Mechanic Directory
- AI-Powered Car Diagnosis
- Real-time Inventory via Firestore
- Shopping Cart and Purchase Flow
- User Profiles
- Responsive Design (mobile/tablet/desktop)
- Customer Support Chatbot

## Firebase Configuration
The Firebase project is already configured in `script.js`. The application connects to the live Firebase project `mechanic-db779`.

**Note**: Firebase API keys in client-side code are public by design. Security is enforced through Firebase Security Rules on the backend, not by hiding the API key.

## Development Setup
The application runs on a Python HTTP server on port 5000 with cache control headers to ensure changes are immediately visible during development.

## Recent Changes (October 23, 2025)
- Imported from GitHub
- Set up Python HTTP server with no-cache headers for Replit environment
- Configured workflow for automatic server startup
- Added .gitignore for Python and Firebase files
- Server configured to bind to 0.0.0.0:5000 for Replit compatibility

## Architecture Notes
- Single-page application with client-side routing
- Firebase handles all backend operations (auth, database)
- Static file serving with cache control for development
- No build step required - pure HTML/CSS/JS
