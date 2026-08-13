import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiGet, apiPost, apiPut } from "../../../api";

interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: "client" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateProfile: (name: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await apiGet<User>("/me");
          setUser(userData);
        } catch (error) {
          console.error("Error restoring session:", error);
          localStorage.removeItem("access_token");
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const register = async (name: string, email: string, password: string, phone: string): Promise<void> => {
    interface AuthResponse { access_token: string; user: User }
    const data = await apiPost<AuthResponse>("/register", { name, email, password, phone });
    localStorage.setItem("access_token", data.access_token);
    setUser(data.user);
  };

  const login = async (email: string, password: string): Promise<void> => {
    interface AuthResponse { access_token: string; user: User }
    const data = await apiPost<AuthResponse>("/login", { email, password });
    localStorage.setItem("access_token", data.access_token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const updateProfile = async (name: string, phone: string): Promise<void> => {
    const updatedUser = await apiPut<User>("/me", { name, phone });
    setUser(updatedUser);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, isAdmin, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
