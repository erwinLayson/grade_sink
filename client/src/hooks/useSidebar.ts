import { useContext } from "react";
import { SidebarContext } from "../context/sideBarContext";

export function useSideBar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("element must inside the provider");
  }

  return context
}