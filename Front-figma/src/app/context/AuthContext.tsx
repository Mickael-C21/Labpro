import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

const API_BASE_URL = "http://127.0.0.1:8000";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from token on app load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/me`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem("access_token");
          }
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
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password, phone })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    const userData = await response.json();
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  const updateProfile = async (name: string, phone: string): Promise<void> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Not authenticated");

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, phone })
    });

    if (!response.ok) {
      throw new Error("Profile update failed");
    }

    const updatedUser = await response.json();
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
