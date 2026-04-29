import React, { createContext, useEffect, useState, useCallback } from "react";
import type { GetUserProps } from "../constant/getUser";
import axios from "axios";
import type { UserProps } from "../constant/user";

type userContextProps = {
  users: GetUserProps[] | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: GetUserProps[] | null) => void;
  refetchUsers: () => Promise<void>;
};

export const GetUserContext = createContext<userContextProps | null>(null);

export default function GetUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, setUser] = useState<GetUserProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await axios.get("http://localhost:7000/users", {
        withCredentials: true,
      });

      // Properly extract data from response
      const usersData = result.data?.data || result.data;

      if (!usersData || !Array.isArray(usersData)) {
        setUser([]);
        setError(null);
        return;
      }

      console.log("Users fetched:", usersData);
      setUser(usersData);
      setError(null);
    } catch (e) {
      let errorMessage = "Failed to fetch users";

      if (axios.isAxiosError(e)) {
        errorMessage = e.response?.data?.msg || e.message;
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }

      console.error("Error fetching users:", errorMessage);
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const userCredential = localStorage.getItem("userCredential");

    if (!userCredential) {
      setIsLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(userCredential) as UserProps;
      const canFetchUsers =
        parsedUser.role === "admin" || parsedUser.role === "super_admin";

      if (!canFetchUsers) {
        setIsLoading(false);
        return;
      }
    } catch {
      setIsLoading(false);
      return;
    }

    // Add small delay to ensure auth is set up before fetching users
    const timer = setTimeout(() => {
      fetchUsers();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchUsers]); // Empty dependency array - only run once on mount

  return (
    <GetUserContext.Provider
      value={{ users, setUser, isLoading, error, refetchUsers: fetchUsers }}
    >
      {children}
    </GetUserContext.Provider>
  );
}
