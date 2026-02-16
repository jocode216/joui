import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "user" | "teacher" | "admin";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  userName: string;
}

const RoleContext = createContext<RoleContextType>({
  role: "user",
  setRole: () => {},
  userName: "Joseph Teka",
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("user");
  const userName = role === "admin" ? "Admin" : role === "teacher" ? "Carol Williams" : "Alice Johnson";

  return (
    <RoleContext.Provider value={{ role, setRole, userName }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
