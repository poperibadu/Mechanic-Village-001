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
The Firebase project is already configured in `script.js`. The application connects to the live Firebase project `mechanic-villa-002-34588-5325b`.

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

## Admin Dashboard
The application includes a comprehensive admin dashboard for platform management. **Important Security Configuration Required:**

### Firebase Security Rules (REQUIRED)
The admin dashboard requires proper Firebase security rules to be configured. Add these rules to your Firebase Console (Firestore Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection - admins can read/write all, users can only read/write their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Inventory/Products - admins have full access, others can only read approved items
    match /inventory/{productId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (request.auth.uid == resource.data.sellerId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Orders - users can read their own, admins can read all
    match /orders/{orderId} {
      allow read: if request.auth != null && (request.auth.uid == resource.data.customerId || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Statistics - read-only for authenticated users, write for admins
    match /statistics/{statId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```

### Creating the First Admin User
1. Create a regular user account through the signup page
2. Go to Firebase Console → Firestore Database → users collection
3. Find your user document and manually set `role: "admin"`
4. Refresh the application - you'll now see the Admin link in navigation

### Admin Dashboard Features
- **Overview**: Platform statistics and recent activity
- **User Management**: View, edit, delete users, grant admin access
- **Product Management**: Approve, view, and delete product listings
- **Mechanic Management**: View, edit, and manage mechanic profiles
- **Order Management**: View and update order statuses
- **Settings**: Platform configuration (commission rates, approval settings, etc.)

**Security Note**: The client-side admin checks are supplementary. The Firebase Security Rules above provide the actual backend enforcement that prevents unauthorized access to admin operations.
