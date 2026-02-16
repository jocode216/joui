import React, { useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedProps {
  children: ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/register");
    }
  }, [token, navigate]);

  if (!token) return null;

  return <>{children}</>;
};

export default Protected;
