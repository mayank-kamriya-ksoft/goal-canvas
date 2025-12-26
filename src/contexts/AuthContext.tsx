import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Session {
  expires_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount using httpOnly cookies
  useEffect(() => {
    const validateSession = async () => {
      try {
        // The cookie will be automatically sent with the request via credentials: 'include'
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-session`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            credentials: 'include', // Include cookies in the request
          }
        );

        const data = await response.json();

        if (!data?.valid) {
          setIsLoading(false);
          return;
        }

        setUser(data.user);
        setSession({ expires_at: data.session.expires_at });
      } catch (err) {
        console.error("Session validation error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          credentials: 'include', // Include cookies in the request
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to create account. Please try again." };
      }

      setUser(data.user);
      setSession(data.session);

      return {};
    } catch (err) {
      console.error("Signup error:", err);
      return { error: "An unexpected error occurred" };
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          credentials: 'include', // Include cookies in the request
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "Failed to log in. Please try again." };
      }

      setUser(data.user);
      setSession(data.session);

      return {};
    } catch (err) {
      console.error("Login error:", err);
      return { error: "An unexpected error occurred" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auth-logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          credentials: 'include', // Include cookies in the request
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    }

    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, signup, login, logout }}
    >
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
