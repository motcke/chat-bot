import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // בדיקה אם המשתמש מאושר (מנהלים תמיד מאושרים)
  if (!user.isApproved && !user.isAdmin) {
    redirect("/pending-approval");
  }

  return (
    <div className="flex h-screen">
      <Sidebar
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
        }}
      />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
