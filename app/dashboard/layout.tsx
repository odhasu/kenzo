import { getUserOrRedirect, getUserName } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserOrRedirect();
  const firstName = getUserName(user).split(" ")[0];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar firstName={firstName} />
      <main className="flex-1 ml-[260px] bg-gradient-to-br from-kenzo-deep via-kenzo-surface to-teal-950/20">
        {children}
      </main>
    </div>
  );
}
