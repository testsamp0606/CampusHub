'use client';

import React, { useMemo, type ReactNode, useEffect } from 'react';
import { FirebaseProvider, useUser } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from './non-blocking-login';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

function AuthGate({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { firestore } = initializeFirebase();

  useEffect(() => {
    if (!isUserLoading && !user) {
      const { auth } = initializeFirebase();
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user]);

  useEffect(() => {
    if (firestore && user && user.isAnonymous) {
      const userRef = doc(firestore, 'schools', 'school-1', 'users', user.uid);
      // Set a basic user profile. The `setDocumentNonBlocking` will handle
      // the security rule error if the write fails, but we need this
      // document to exist for our read rules to pass.
      setDocumentNonBlocking(
        userRef,
        {
          id: user.uid,
          schoolId: 'school-1',
          role: 'guest', // Assign a default guest role
          email: user.email,
        },
        { merge: true }
      );
    }
  }, [user, firestore]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      <AuthGate>{children}</AuthGate>
    </FirebaseProvider>
  );
}
