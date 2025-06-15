'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword as firebaseSignIn,
  sendSignInLinkToEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/language';
import { t } from '@/lib/translations';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOutUser: () => Promise<void>;
  isAdmin: boolean;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOutUser: async () => {},
  isAdmin: false,
  signInWithEmailAndPassword: async () => {},
  signInWithMagicLink: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user);

      // Check if user is admin (you can customize this based on your needs)
      if (user) {
        const token = await user.getIdTokenResult();
        setIsAdmin(token.claims.admin === true);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast.success(t('toast.signOutSuccess', language));
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('toast.failedSignOut', language));
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    try {
      await firebaseSignIn(auth, email, password);
      toast.success(t('toast.signInSuccess', language));
      router.push('/decks');
    } catch (error: unknown) {
      console.error('Error signing in:', error);
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/user-not-found') {
          toast.error(t('toast.noAccountFound', language));
        } else if (firebaseError.code === 'auth/wrong-password') {
          toast.error(t('toast.incorrectPassword', language));
        } else {
          toast.error(t('toast.signInFailed', language));
        }
      } else {
        toast.error(t('toast.signInFailed', language));
      }
      throw error;
    }
  };

  const signInWithMagicLink = async (email: string) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/verify`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      toast.success(t('toast.signInLinkSent', language));
    } catch (error: unknown) {
      console.error('Error sending sign in link:', error);
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if (firebaseError.code === 'auth/invalid-email') {
          toast.error(t('toast.invalidEmail', language));
        } else {
          toast.error(t('toast.failedToSendLink', language));
        }
      } else {
        toast.error(t('toast.failedToSendLink', language));
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOutUser,
        isAdmin,
        signInWithEmailAndPassword,
        signInWithMagicLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

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
