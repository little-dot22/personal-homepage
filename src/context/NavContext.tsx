import { createContext, useContext, useState, type ReactNode } from "react";

export interface NavItem {
  label: string;
  path: string;
  color: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "记忆碎片", path: "/memories", color: "#00e5ff" },
  { label: "无用之用", path: "/uselessness", color: "#b388ff" },
  { label: "赛博鱼缸", path: "/fishtank", color: "#00ffa3" }
];

interface NavContextValue {
  hovered: number | null;
  setHovered: (index: number | null) => void;
}

const NavContext = createContext<NavContextValue>({
  hovered: null,
  setHovered: () => {}
});

export function NavProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <NavContext.Provider value={{ hovered, setHovered }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  return useContext(NavContext);
}
