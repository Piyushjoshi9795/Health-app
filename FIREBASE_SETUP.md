# Firebase Authentication Setup Guide

This guide explains how to integrate Firebase Authentication into your Health SaaS application.

## Prerequisites

- Firebase CLI installed (`npm install -g firebase-tools`)
- A Google account
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "Health-SaaS")
4. Accept the terms and click "Create project"
5. Wait for the project to be created

## Step 2: Register Your Web App

1. In the Firebase Console, click the web icon `</>`
2. Enter your app name (e.g., "Health-SaaS-Web")
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase config provided

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Replace the placeholder values with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

## Step 4: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click "Email/Password" provider
3. Enable it and click "Save"

## Step 5: Create Test Users (Optional)

1. In Firebase Console, go to **Authentication** > **Users**
2. Click "Add user"
3. Enter email and password for test users
4. Click "Add user"

Example test users:
- admin@pulseos.health / admin123
- doctor@pulseos.health / doctor123
- nurse@pulseos.health / nurse123

## Step 6: Setup Firestore (For User Roles)

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location near you
5. Create a `users` collection with the following document structure:

```json
{
  "email": "admin@pulseos.health",
  "displayName": "Dr. Sarah Okonkwo",
  "role": "admin",
  "createdAt": "2024-04-28"
}
```

## Step 7: Update Firebase Service to Fetch User Roles

Modify `src/services/authService.ts` to fetch user role from Firestore:

```typescript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// In the signIn method, after successful authentication:
const userDocRef = doc(db, 'users', firebaseUser.uid);
const userDoc = await getDoc(userDocRef);
const userData = userDoc.data();

const user: User = {
  uid: firebaseUser.uid,
  email: firebaseUser.email || email,
  displayName: userData?.displayName || firebaseUser.displayName || 'User',
  role: userData?.role || 'doctor',
};
```

## Step 8: Security Rules

Set up Firestore security rules to protect your data:

1. Go to **Firestore** > **Rules**
2. Replace with these security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /patients/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 9: Update Authentication Redux Slice (Optional Enhancement)

The current setup uses mock auth as fallback. For production, update `src/store/slices/authSlice.ts` to listen to Firebase auth state:

```typescript
// Add this in your component or app initialization
import { authService } from '../../services/authService';

useEffect(() => {
  const unsubscribe = authService.onAuthStateChanged((user) => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setUser(null));
    }
  });

  return unsubscribe;
}, []);
```

## Step 10: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try logging in with:
   - Email: admin@pulseos.health
   - Password: admin123

3. Or use Firebase credentials if you created test users

## Troubleshooting

### "Firebase is not initialized" error
- Ensure `.env.local` has all required Firebase credentials
- Restart the development server after adding env variables

### "Cannot find module 'firebase'" error
- Run `npm install firebase`

### Auth state not persisting
- Ensure localStorage is not disabled in your browser
- Check browser console for any errors

### Users can't sign in
- Verify test user exists in Firebase Console > Authentication > Users
- Check email/password match exactly (case-sensitive)
- Ensure Email/Password auth provider is enabled

## Production Checklist

Before deploying to production:

- [ ] Set up Firebase security rules properly
- [ ] Enable user role management in Firestore
- [ ] Set up email verification
- [ ] Configure password reset emails
- [ ] Enable reCAPTCHA for protection against abuse
- [ ] Set environment variables in your hosting platform
- [ ] Test all authentication flows
- [ ] Set up analytics and monitoring

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
