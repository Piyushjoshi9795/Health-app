import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

/**
 * Advanced Firebase utilities for managing user profiles and roles
 * These are optional enhancements for production use
 */

// Get user profile from Firestore
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Create or update user profile
export async function saveUserProfile(uid: string, userData: Partial<User>): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, userData, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
}

// Update user role (admin only)
export async function updateUserRole(uid: string, role: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Get all users with a specific role
export async function getUsersByRole(role: string): Promise<User[]> {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('role', '==', role));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => doc.data() as User);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }
}

// Delete user profile
export async function deleteUserProfile(uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, { deletedAt: new Date() });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
}

// Example usage in a component:
/*
import { getUserProfile, saveUserProfile } from '../services/firebaseUtils';

export async function updateProfile(uid: string, displayName: string) {
  try {
    await saveUserProfile(uid, { displayName });
    alert('Profile updated successfully');
  } catch (error) {
    alert('Failed to update profile');
  }
}
*/
