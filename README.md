# Mechanic Village - Premium Auto Parts Marketplace

Mechanic Village is a modern, responsive single-page application (SPA) designed as a marketplace for automotive parts and services. It is built with vanilla HTML, CSS, and JavaScript, and powered by Google Firebase for its backend services.

## ✨ Features

-   **User Authentication**: Secure signup and login for customers and mechanics using Firebase Authentication.
-   **Dynamic Product Listings**: Browse, search, and filter a wide range of auto parts.
-   **Mechanic Directory**: Find and view profiles of qualified mechanics, filterable by specialization, location, and experience.
-   **AI-Powered Diagnosis**: An intelligent tool on the homepage to help users diagnose car problems and get part recommendations.
-   **Real-time Inventory**: The application reflects inventory levels in real-time, leveraging Firestore for data storage.
-   **Direct Purchase Flow**: A streamlined "Buy Now" feature for quick and easy transactions.
-   **User Profiles**: Dedicated profile pages for users to manage their account information and view purchase history.
-   **Responsive Design**: A clean UI that works seamlessly across desktops, tablets, and mobile devices.
-   **Customer Support Chatbot**: An integrated chatbot to assist users with common questions.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
-   **Backend**: Google Firebase
    -   **Firestore**: For database and real-time data synchronization.
    -   **Firebase Authentication**: For user management.
    -   **Firebase Hosting**: For deployment.

## 🚀 Getting Started

### Prerequisites

-   A modern web browser that supports JavaScript.
-   A local web server to run the project (due to browser security policies with `file://` URLs). Python's built-in HTTP server is a great option.

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Start a local web server:**
    If you have Python 3 installed, you can run the following command from the project's root directory:
    ```bash
    python -m http.server
    ```
    This will start a server, typically on `http://localhost:8000`.

3.  **Open the application:**
    Open your web browser and navigate to `http://localhost:8000`. The application should now be running.

## 🔧 Firebase Configuration

The Firebase project configuration is already included in the `script.js` file. The application is connected to a live Firebase project (`mechanic-db779`) and requires no additional setup for the frontend to function.

```javascript
// Firebase configuration in script.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  // ... and other keys
};
```

## ☁️ Deployment

This project is configured for deployment with **Firebase Hosting**.

1.  **Install the Firebase CLI:**
    If you don't have it installed, follow the official instructions to install the [Firebase Command Line Interface](https://firebase.google.com/docs/cli).

2.  **Login to Firebase:**
    ```bash
    firebase login
    ```

3.  **Deploy the site:**
    Run the following command from the project's root directory:
    ```bash
    firebase deploy --only hosting
    ```
    After the command completes, the Firebase CLI will provide you with the URL for your live site.

## 📄 License

This project is licensed under the MIT License.