import { useContext } from "react";
import { GetUserContext } from "../context/getUserContext";

export default function useGetUser() {
  const context = useContext(GetUserContext);

  if (!context) {
    throw new Error(`useGetUser must be used inside the GetUserProvider`);
  }

  return context;
} 