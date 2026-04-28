import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useStore';
import { setUser } from '../store/slices/authSlice';
import { authService } from '../services/authService';

/**
 * Hook to sync Firebase auth state with Redux store
 * Call this once in your App component to listen for auth changes
 */
export const useFirebaseAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChanged((authUser) => {
      dispatch(setUser(authUser));
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [dispatch]);

  return user;
};
