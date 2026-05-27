import { User } from "@supabase/supabase-js";

import { supabase } from "@/services/supabase";

export async function ensureUserProfile(user: User, displayName?: string) {
  if (!supabase) {
    return;
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("Failed to check profile:", error.message);
      return;
    }

    if (data) {
      return;
    }

    const fallbackName = user.email?.split("@")[0] ?? "Utilisateur";
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      display_name: displayName?.trim() || fallbackName,
    });

    if (insertError) {
      console.warn("Failed to create profile:", insertError.message);
    }
  } catch (error) {
    console.warn("Error ensuring profile:", error);
  }
}

export async function getProfileDisplayName(user: User) {
  if (!supabase) {
    return user.email?.split("@")[0] ?? "Utilisateur";
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.warn("Failed to get profile:", error.message);
      return user.user_metadata.display_name || user.email?.split("@")[0] || "Utilisateur";
    }

    return (
      data?.display_name ||
      user.user_metadata.display_name ||
      user.email?.split("@")[0] ||
      "Utilisateur"
    );
  } catch (error) {
    console.warn("Error fetching profile:", error);
    return user.user_metadata.display_name || user.email?.split("@")[0] || "Utilisateur";
  }
}
