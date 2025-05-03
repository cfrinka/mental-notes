"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface User {
  uid: string;
  email: string | null;
  name: string | null;
  role: string | null;
  therapistId?: string;
}

interface UserContextType {
  userData: User | null;
  setUserData: (userData: User) => void;
  fetchUserData: () => Promise<void>;
  setUserFirestoreData: (userData: User) => Promise<void>;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserDataState] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData();
      } else {
        setUserDataState(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUserDataState(userData);
      }
    }
  };

  const setUserFirestoreData = async (userData: User) => {
    const userRef = doc(db, "users", userData.uid);
    await setDoc(userRef, userData, { merge: true });
    setUserDataState(userData);
  };

  const clearUserData = () => {
    setUserDataState(null);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData: setUserFirestoreData,
        fetchUserData,
        setUserFirestoreData,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
