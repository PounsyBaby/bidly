import { Session, User } from "@supabase/supabase-js";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";

import { ensureUserProfile, getProfileDisplayName } from "@/services/profilesService";
import { supabase } from "@/services/supabase";

type AuthResult = {
  success: boolean;
  message: string;
};

type AuthContextValue = {
  user: User | null;
  displayName: string | null;
  session: Session | null;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getAuthErrorMessage(message: string) {
  if (message.toLowerCase().includes("email not confirmed")) {
    return "Email non confirmé. Confirmez votre email dans Supabase ou désactivez la confirmation email pour la démo.";
  }

  if (message.toLowerCase().includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }

  return message;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    // Timeout de 5 secondes pour ne pas bloquer indéfiniment
    const timeoutId = setTimeout(() => {
      setAuthLoading(false);
    }, 5000);

    supabase.auth.getSession().then(async ({ data }) => {
      clearTimeout(timeoutId);
      setSession(data.session);

      if (data.session?.user) {
        try {
          const name = await getProfileDisplayName(data.session.user);
          setDisplayName(name);
        } catch {
          setDisplayName(data.session.user.email?.split("@")[0] ?? "Utilisateur");
        }
      }

      setAuthLoading(false);
    }).catch(() => {
      clearTimeout(timeoutId);
      setAuthLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        setDisplayName(null);
      }
    });

    return () => {
      clearTimeout(timeoutId);
      data.subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) {
      return { success: false, message: "Configuration Supabase manquante." };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { success: false, message: getAuthErrorMessage(error.message) };
    }

    const { data } = await supabase.auth.getUser();

    if (data.user) {
      await ensureUserProfile(data.user);
      const name = await getProfileDisplayName(data.user);
      setDisplayName(name);
    }

    return { success: true, message: "Connexion réussie." };
  }

  async function signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResult> {
    if (!supabase) {
      return { success: false, message: "Configuration Supabase manquante." };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    if (error) {
      return { success: false, message: getAuthErrorMessage(error.message) };
    }

    if (!data.session) {
      return {
        success: true,
        message: "Compte créé. Vérifiez votre email si la confirmation est activée.",
      };
    }

    if (data.user) {
      await ensureUserProfile(data.user, displayName);
      const name = await getProfileDisplayName(data.user);
      setDisplayName(name);
    }

    return { success: true, message: "Compte créé." };
  }

  async function signOut() {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setDisplayName(null);
  }

  const value: AuthContextValue = {
    user: session?.user ?? null,
    displayName,
    session,
    authLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
