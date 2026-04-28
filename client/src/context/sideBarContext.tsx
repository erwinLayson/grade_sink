import React, { createContext, useState } from "react";

type SideBarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsOpen: (value: boolean) => void;
};

export const SidebarContext = createContext<SideBarProps | null>(null);

export default function sideBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}
