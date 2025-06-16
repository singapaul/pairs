'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

// Helper function to ensure auth is initialized
function getAuth() {
  if (!auth) throw new Error('Auth not initialized');
  return auth;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmailLink: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  signInWithEmailLink: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async user => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(getAuth());
      router.push('/');
      toast.success(t('toast.signedOut', language));
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('toast.errorSigningOut', language));
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      await firebaseSignIn(getAuth(), email, password);
      router.push('/decks');
      toast.success(t('toast.signedIn', language));
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(t('toast.errorSigningIn', language));
    }
  };

  const handleSignInWithEmailLink = async (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/verify`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(getAuth(), email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast.success(t('toast.checkEmail', language));
    } catch (error) {
      console.error('Error sending sign-in link:', error);
      toast.error(t('toast.errorSendingLink', language));
    }
  };

  const isAdmin = user?.email === 'paul.hardman@gmail.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        signInWithEmailLink: handleSignInWithEmailLink,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Custom hook for protected routes
export function useRequireAuth() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  return { user, loading };
}

// Custom hook for admin routes
export function useRequireAdmin() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
      toast.error(t('toast.noPermission', language));
    }
  }, [user, loading, isAdmin, router, language]);

  return { user, loading, isAdmin };
}
