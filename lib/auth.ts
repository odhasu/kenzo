import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export async function getUserOrRedirect(): Promise<User> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

export function getUserName(user: User): string {
  return user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "there";
}
