import { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`User context must inside the user Provider`)
  }

  return context
}