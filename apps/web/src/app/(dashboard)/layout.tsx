import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { Nav } from "@/components/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Nav />
      <main className="flex-1 p-8 bg-white m-4 rounded-xl shadow-sm border overflow-auto">
        {children}
      </main>
    </div>
  );
}
