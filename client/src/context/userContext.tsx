import { createContext, useEffect, useState } from "react";
import axios from "axios";
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
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url ?? "";
        const isAuthRequest =
          requestUrl.includes("/auth") || requestUrl.includes("/login");

        if ((status === 401 || status === 403) && !isAuthRequest) {
          localStorage.removeItem("userCredential");
          setUser(null);

          if (window.location.pathname !== "/login") {
            window.location.replace("/login");
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  useEffect(() => {
    const validateSession = async () => {
      const userCredential = localStorage.getItem("userCredential");

      if (!userCredential) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(userCredential) as UserProps;

        // Try to verify with backend, but fall back to local data if verification fails
        try {
          const response = await axios.get(
            "http://localhost:7000/auth/verify",
            {
              withCredentials: true,
            },
          );
          const verifiedUser = response.data?.data ?? parsedUser;
          setUser(verifiedUser);
          localStorage.setItem("userCredential", JSON.stringify(verifiedUser));
        } catch (verifyError) {
          // If verification fails, still trust the local data for now
          // The interceptor will handle logout if needed on subsequent API calls
          console.log(
            "[UserContext] Auth verify failed, using local user data",
          );
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("[UserContext] Error parsing user credential:", error);
        localStorage.removeItem("userCredential");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}
