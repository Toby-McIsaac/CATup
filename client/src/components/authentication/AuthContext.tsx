import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  validateToken: () => Promise<void>;
  checkLoggedIn: () => string | null;
  login: (userInfo: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const checkLoggedIn = () => {
    return localStorage.getItem("token");
  };

  const validateToken = useCallback(async () => {
    const token = checkLoggedIn(); // Check token presence

    if (token && !user) {
      // Only call login if there's a token and no user is logged in
      await login({
        id: "test-id",
        name: "test-name",
        email: "test-email",
      });
    }
  }, [user]); // Depend on `user` so we don't trigger `login` repeatedly if the user is already logged in.

  useEffect(() => {
    const validate = async () => {
      const token = checkLoggedIn();
      if (token) {
        await validateToken(); // Validates the token only if a token is present
      }
    };

    validate();
  }, [validateToken]);

  const login = async (userInfo: User) => {
    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.statusText}`);
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem("token", data.token); // Store token
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Remove token on logout
  };

  return (
    <AuthContext.Provider
      value={{ user, validateToken, checkLoggedIn, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
