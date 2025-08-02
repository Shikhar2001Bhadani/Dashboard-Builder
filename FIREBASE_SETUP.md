# Firebase Setup Guide

## 🔥 **Firebase Configuration Required**

The authentication system requires a valid Firebase project. Follow these steps to set up Firebase:

### **1. Create a Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "dashboard-app")
4. Follow the setup wizard

### **2. Enable Authentication**

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get started**
3. Go to the **Sign-in method** tab
4. Enable **Email/Password** authentication
5. Click **Save**

### **3. Create a Web App**

1. In your Firebase project, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "dashboard-web")
6. Copy the configuration object

### **4. Set Up Environment Variables**

Create a `.env` file in the `dashboard` folder with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id_here
```

### **5. Enable Firestore Database**

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location for your database
5. Click **Done**

### **6. Set Firestore Security Rules**

In Firestore Database > Rules, update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write dashboard data
    match /dashboards/{dashboardId} {
      allow read, write: if request.auth != null;
    }

    // Allow authenticated users to manage presence
    match /dashboards/{dashboardId}/presence/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 **Quick Start (Using Existing Config)**

If you want to test the app immediately, the current configuration uses a development Firebase project. You can:

1. **Sign up** with any email/password
2. **Sign in** with the same credentials
3. **Test all features** including real-time collaboration

## ⚠️ **Important Notes**

- **Environment Variables**: The app will use the existing Firebase project if no `.env` file is found
- **Security**: For production, always use your own Firebase project with proper security rules
- **Authentication**: Email/password authentication must be enabled in Firebase Console
- **Firestore**: The database must be created and rules must allow authenticated access

## 🔧 **Troubleshooting**

### **"API key not valid" Error**

- Make sure you've copied the correct API key from Firebase Console
- Check that the `.env` file is in the correct location (dashboard folder)
- Restart the development server after creating the `.env` file

### **"Permission denied" Error**

- Check that Firestore security rules allow authenticated access
- Ensure you're signed in before accessing the dashboard

### **Authentication not working**

- Verify that Email/Password authentication is enabled in Firebase Console
- Check that the Firebase project is properly configured
