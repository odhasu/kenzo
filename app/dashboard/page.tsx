import { createClient } from "@/lib/supabase/server";
import { getUserOrRedirect, getUserName } from "@/lib/auth";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getUserOrRedirect();
  const firstName = getUserName(user).split(" ")[0];

  const supabase = await createClient();
  const { data: funnels } = await supabase
    .from("funnels")
    .select("*")
    .order("created_at", { ascending: false });

  return <DashboardClient firstName={firstName} funnels={funnels ?? []} />;
}
