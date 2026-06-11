"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "creator" | "b2b";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  accent: string;
}

export const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("creator");
  const accent = role === "creator" ? "#BF5AF2" : "#0A84FF";

  return (
    <RoleContext.Provider value={{ role, setRole, accent }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return ctx;
}
