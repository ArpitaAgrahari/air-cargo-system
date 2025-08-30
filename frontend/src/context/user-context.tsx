"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "@/types/user";

export type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
  user: initialUser,
}: {
  children: ReactNode;
  user: User;
}) => {
  const [user, setUser] = useState(initialUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
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
