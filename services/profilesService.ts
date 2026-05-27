import { User } from "@supabase/supabase-js";

import { supabase } from "@/services/supabase";

export async function ensureUserProfile(user: User, displayName?: string) {
  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
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
    throw new Error(insertError.message);
  }
}

export async function getProfileDisplayName(user: User) {
  if (!supabase) {
    return user.email?.split("@")[0] ?? "Utilisateur";
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (
    data?.display_name ||
    user.user_metadata.display_name ||
    user.email?.split("@")[0] ||
    "Utilisateur"
  );
}
