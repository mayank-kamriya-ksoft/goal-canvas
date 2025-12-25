import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface Session {
  token: string;
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

const SESSION_KEY = "visionboard_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      const storedSession = localStorage.getItem(SESSION_KEY);
      if (!storedSession) {
        setIsLoading(false);
        return;
      }

      try {
        const { token } = JSON.parse(storedSession);
        const { data, error } = await supabase.functions.invoke("auth-session", {
          body: { token },
        });

        if (error || !data?.valid) {
          localStorage.removeItem(SESSION_KEY);
          setIsLoading(false);
          return;
        }

        setUser(data.user);
        setSession({ token, expires_at: data.session.expires_at });
      } catch (err) {
        console.error("Session validation error:", err);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("auth-signup", {
        body: { email, password },
      });

      if (error) {
        return { error: "Failed to create account. Please try again." };
      }

      if (data?.error) {
        return { error: data.error };
      }

      // Store session
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token: data.session.token })
      );
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
      const { data, error } = await supabase.functions.invoke("auth-login", {
        body: { email, password },
      });

      if (error) {
        return { error: "Failed to log in. Please try again." };
      }

      if (data?.error) {
        return { error: data.error };
      }

      // Store session
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ token: data.session.token })
      );
      setUser(data.user);
      setSession(data.session);

      return {};
    } catch (err) {
      console.error("Login error:", err);
      return { error: "An unexpected error occurred" };
    }
  }, []);

  const logout = useCallback(async () => {
    if (session?.token) {
      try {
        await supabase.functions.invoke("auth-logout", {
          body: { token: session.token },
        });
      } catch (err) {
        console.error("Logout error:", err);
      }
    }

    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setSession(null);
  }, [session]);

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
