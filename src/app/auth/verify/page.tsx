'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          // Get the email from localStorage
          let email = window.localStorage.getItem('emailForSignIn');

          if (!email) {
            // If email is not found in localStorage, prompt user
            email = window.prompt('Please provide your email for confirmation');
          }

          if (email) {
            await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn'); // Clean up
            toast.success('Successfully signed in!');
            router.push('/decks');
          } else {
            throw new Error('No email provided');
          }
        } else {
          throw new Error('Invalid sign-in link');
        }
      } catch (error) {
        console.error('Error signing in:', error);
        toast.error('Failed to sign in. Please try again.');
        router.push('/auth');
      } finally {
        setVerifying(false);
      }
    };

    void verify();
  }, [router]);

  if (verifying) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <h1 className="text-2xl font-bold">Verifying your email...</h1>
          <p className="text-muted-foreground">
            Please wait while we complete the sign-in process.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
