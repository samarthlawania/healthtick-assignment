## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.


### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/samarthlawania/healthtick-assignment
    cd healthtick-assignment/health-tick-assignment-samarth
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Firebase Setup

1.  **Create a Firebase Project:**
    * Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Enable Firestore Database:**
    * In your Firebase project, navigate to "Firestore Database" and create a new database. Choose "Start in production mode" (or "test mode" for initial development, but remember to secure your rules later).
3.  **Enable Firebase Authentication:**
    * In your Firebase project, navigate to "Authentication" and enable the desired sign-in providers (e.g., Anonymous, Email/Password, Google, etc.). The current application uses anonymous authentication for generating a `userId`.
4.  **Get Firebase Configuration:**
    * In your Firebase project settings, find your web app's configuration (usually under "Project settings" > "Your apps" > "Web"). It will look something like this:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };
    ```
5.  **Create `.env` file:**
    * In the root of your project, create a file named `.env` (or `.env.local` for local development).
    * Add your Firebase configuration variables to this file, prefixed with `REACT_APP_` (if using Create React App) or `VITE_` (if using Vite), etc., depending on your build tool.

    ```
    REACT_APP_FIREBASE_API_KEY="YOUR_API_KEY"
    REACT_APP_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    REACT_APP_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    REACT_APP_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    REACT_APP_FIREBASE_APP_ID="YOUR_APP_ID"
    VITE_PUBLIC_FIREBASE_MEASUREMENT_ID"YOUR_MEASUREMENT_ID"
    ```


## Usage

1.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will typically open the application in your browser at `http://localhost:5173/` 

2.  **Interact with the Calendar:**
    * Use the navigation buttons (Previous Day, Next Day, Today) to change the displayed date.
    * Click on the "Date Picker" button to open a calendar and select a specific date.
    * Click on an empty time slot in the calendar to open the booking modal and create a new booking.
    * Click on an existing booking to edit its details.
    * Use the delete button on a booking to remove it.
    * Use the today button to get directly on today date.
