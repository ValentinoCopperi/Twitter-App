'use client';

import { User } from '@prisma/client';
// UserProvider.tsx
import React, { createContext, useContext, useState } from 'react';

export const UserContext = createContext<{
  user_data: User | null;
  isLoggedIn: boolean;
  setUserData: (userData: any) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}>({
  user_data: null,
  isLoggedIn: false,
  setUserData: () => {},
  setIsLoggedIn: () => {},
});

export const UserProvider = ({ 
  children, 
  initialUserData, 
  initialIsLoggedIn 
}: { 
  children: React.ReactNode;
  initialUserData: User | null;
  initialIsLoggedIn: boolean;
}) => {
  const [user_data, setUserData] = useState(initialUserData);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);

  return (
    <UserContext.Provider value={{ user_data, isLoggedIn, setUserData, setIsLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext)

  if(!context){
    throw new Error("Context must be wrapped into a UserContext")
  }

  return context
}