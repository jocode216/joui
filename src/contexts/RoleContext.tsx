import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "user" | "teacher" | "admin";

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isApproved: boolean;
}

interface RoleContextType {
  role: Role;
  userName: string;
  user: User | null;
  refreshUser: () => void;
}

const RoleContext = createContext<RoleContextType>({
  role: "user",
  userName: "Guest",
  user: null,
  refreshUser: () => {},
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>("user");

  const refreshUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Normalize role (handle uppercase from backend)
        let normalizedRole: Role = "user";
        const roleStr = String(parsedUser.role || "").toLowerCase();
        if (roleStr === "admin") normalizedRole = "admin";
        else if (roleStr === "teacher") normalizedRole = "teacher";
        else if (roleStr === "student" || roleStr === "user") normalizedRole = "user";
        
        console.log(`[RoleContext] User loaded. Role: ${normalizedRole}, Display Name: ${parsedUser.firstName} ${parsedUser.lastName}`);
        setUser(parsedUser);
        setRoleState(normalizedRole);
      } else {
        setUser(null);
        setRoleState("user");
      }
    } catch (err) {
      console.error("Error reading user from localStorage:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
    
    // Listen for storage changes (for multi-tab sync)
    window.addEventListener("storage", refreshUser);
    return () => window.removeEventListener("storage", refreshUser);
  }, []);

  const userName = user 
    ? `${user.firstName} ${user.lastName}` 
    : role === "admin" ? "Admin" : role === "teacher" ? "Teacher" : "Guest";

  return (
    <RoleContext.Provider value={{ role, userName, user, refreshUser }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
