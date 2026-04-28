import { createContext, useEffect, useState } from "react";
import type { UserProps } from "../constant/user";

type userContextType = {
  user: UserProps | null;
  setUser: (user: UserProps | null) => void;
  isLoading: boolean;
};

export const UserContext = createContext<userContextType | null>(null);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let userCredential = localStorage.getItem("userCredential");

    if (!userCredential) {
      setIsLoading(false);
      return;
    }

    setUser(JSON.parse(userCredential));
    setIsLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
