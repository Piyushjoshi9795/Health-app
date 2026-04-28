import { User } from '../types';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';

const SESSION_KEY = 'pulseos_session';

// Mock Firebase Auth — replace with actual Firebase in production
// To use real Firebase:
// import { initializeApp } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@pulseos.health': {
    password: 'admin123',
    user: {
      uid: 'u001',
      email: 'admin@pulseos.health',
      displayName: 'Dr. Sarah Okonkwo',
      role: 'admin',
    },
  },
  'doctor@pulseos.health': {
    password: 'doctor123',
    user: {
      uid: 'u002',
      email: 'doctor@pulseos.health',
      displayName: 'Dr. Marcus Chen',
      role: 'doctor',
    },
  },
  'nurse@pulseos.health': {
    password: 'nurse123',
    user: {
      uid: 'u003',
      email: 'nurse@pulseos.health',
      displayName: 'Nurse Patricia Hayes',
      role: 'nurse',
    },
  },
};

export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    try {
      // Use Firebase Authentication
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create a User object with Firebase data
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || 'User',
        role: 'doctor', // You should fetch this from Firestore user profile
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    } catch (error: unknown) {
      // Fallback to mock authentication for demo purposes
      console.warn('Firebase sign-in failed, using mock auth:', error);
      await new Promise((r) => setTimeout(r, 900));
      const record = MOCK_USERS[email.toLowerCase()];
      if (!record || record.password !== password) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
      localStorage.setItem(SESSION_KEY, JSON.stringify(record.user));
      return record.user;
    }
  },

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.warn('Firebase sign-out failed:', error);
    } finally {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  getSession(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Listen to Firebase auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'User',
          role: 'doctor', // Fetch from Firestore in production
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        callback(user);
      } else {
        localStorage.removeItem(SESSION_KEY);
        callback(null);
      }
    });

    return unsubscribe;
  },
};
