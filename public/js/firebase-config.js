// ============================================================================
// CIC Competency Framework System - Firebase Configuration
// ============================================================================
// 
// IMPORTANT: Replace the placeholder values below with your actual Firebase
// project configuration. You can find these values in your Firebase Console:
// 
// 1. Go to https://console.firebase.google.com/
// 2. Select your project (or create a new one)
// 3. Click the gear icon (⚙️) next to "Project Overview"
// 4. Select "Project settings"
// 5. Scroll down to "Your apps" section
// 6. Click "Add app" and select Web (</>)
// 7. Copy the firebaseConfig object values
//
// For Firestore:
// 1. In Firebase Console, go to "Build" > "Firestore Database"
// 2. Click "Create database"
// 3. Choose "Start in test mode" for development
// 4. Select a Cloud Firestore location
//
// ============================================================================

// Firebase configuration - CIC Competency Framework
const firebaseConfig = {
    apiKey: "AIzaSyCyn6Oo-0QCnflcsmKVEeQLXEYynBbdx5E",
    authDomain: "competency-framework-9f1db.firebaseapp.com",
    projectId: "competency-framework-9f1db",
    storageBucket: "competency-framework-9f1db.firebasestorage.app",
    messagingSenderId: "1022002411416",
    appId: "1:1022002411416:web:a7ad21eba3c4db12fa5ded",
    measurementId: "G-M1R54NFV09"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Authentication
const auth = firebase.auth();

// Export for use in other modules
window.db = db;
window.auth = auth;

console.log('🔥 Firebase initialized successfully');
