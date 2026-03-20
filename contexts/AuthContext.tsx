import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, signInWithGoogle, logout, onAuthStateChanged, doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isApproved: boolean;
  role: 'admin' | 'user';
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        const isAdminEmail = auth.currentUser?.email === 'ahdanhqq1@gmail.com' || data.email === 'ahdanhqq1@gmail.com';
        
        // If it's the admin email but role or approval is wrong, update it
        if (isAdminEmail && (data.role !== 'admin' || !data.isApproved)) {
          const updatedProfile = { ...data, role: 'admin' as const, isApproved: true };
          await updateDoc(docRef, { role: 'admin', isApproved: true });
          setProfile(updatedProfile);
        } else {
          setProfile(data);
        }
      } else {
        // Create initial profile
        const isAdminEmail = auth.currentUser?.email === 'ahdanhqq1@gmail.com';
        const newProfile: UserProfile = {
          uid,
          email: auth.currentUser?.email || '',
          displayName: auth.currentUser?.displayName || null,
          photoURL: auth.currentUser?.photoURL || null,
          isApproved: isAdminEmail, // Auto approve admin email
          role: isAdminEmail ? 'admin' : 'user', // Set admin role for admin email
          createdAt: serverTimestamp(),
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
        
        // Listen for real-time updates to approval status
        const docRef = doc(db, 'users', currentUser.uid);
        const unsubscribeProfile = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          }
        });
        
        setLoading(false);
        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const signOutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      await fetchProfile(user.uid);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut: signOutUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
