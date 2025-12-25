'use client';

import React, {
  useMemo,
  type ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { FirebaseProvider, useUser } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { initiateAnonymousSignIn } from './non-blocking-login';
import { setDocumentNonBlocking } from './non-blocking-updates';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

function AuthGate({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { firestore } = initializeFirebase();
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  // Memoize the user document reference
  const userDocRef = useMemo(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'schools', 'school-1', 'users', user.uid);
  }, [firestore, user]);

  // Effect to create user profile if it doesn't exist
  const createProfileIfNeeded = useCallback(async () => {
    if (!userDocRef || !user) return;

    try {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        // Set a basic user profile. The `setDocumentNonBlocking` will handle
        // the security rule error if the write fails, but we need this
        // document to exist for our read rules to pass.
        setDocumentNonBlocking(
          userDocRef,
          {
            id: user.uid,
            schoolId: 'school-1',
            role: 'guest', // Assign a default guest role
            email: user.email,
          },
          { merge: true }
        );
      }
    } catch (error) {
      console.error('Error checking/creating user profile:', error);
    }
  }, [userDocRef, user]);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      const { auth } = initializeFirebase();
      initiateAnonymousSignIn(auth);
    } else {
      createProfileIfNeeded();
    }
  }, [isUserLoading, user, createProfileIfNeeded]);

  // Effect to listen for profile creation
  useEffect(() => {
    if (!userDocRef) return;

    // Reset profile status if user changes
    setIsProfileCreated(false);

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setIsProfileCreated(true); // Profile is confirmed to exist
          unsubscribe(); // Stop listening once we've confirmed existence
        }
      },
      (error) => {
        // This could happen if rules temporarily deny read access, we'll retry
        console.error('Snapshot listener error on user profile:', error);
        setIsProfileCreated(false);
      }
    );

    return () => unsubscribe();
  }, [userDocRef]);

  // The gate: wait for auth and for the profile to be created
  if (isUserLoading || !user || !isProfileCreated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Initializing...</p>
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
