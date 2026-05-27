import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
const isWebServerRender = Platform.OS === "web" && typeof window === "undefined";
const canCreateSupabaseClient = isSupabaseConfigured && !isWebServerRender;
const canPersistSession = !isWebServerRender;

export const supabase = canCreateSupabaseClient
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
        persistSession: canPersistSession,
        storage: canPersistSession ? AsyncStorage : undefined,
      },
    })
  : null;
