"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Settings,
  Database,
  MessagesSquare,
  Play,
  Code,
  LogOut,
  Home,
  Users,
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  isAdmin?: boolean;
}

const navigation = [
  { name: "דשבורד", href: "/dashboard", icon: Home },
  { name: "הגדרות", href: "/dashboard/settings", icon: Settings },
  { name: "מאגר ידע", href: "/dashboard/knowledge", icon: Database },
  { name: "שיחות", href: "/dashboard/conversations", icon: MessagesSquare },
  { name: "בדיקה", href: "/dashboard/playground", icon: Play },
  { name: "הטמעה", href: "/dashboard/embed", icon: Code },
];

const adminNavigation = [
  { name: "ניהול משתמשים", href: "/dashboard/admin", icon: Users },
];

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  const allNavigation = user.isAdmin
    ? [...navigation, ...adminNavigation]
    : navigation;

  return (
    <div className="flex h-full w-64 flex-col border-l bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <MessageSquare className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold">ChatBot SaaS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {allNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="mb-3 flex items-center gap-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {(user.name || user.email || "U")[0].toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium truncate">{user.name || "משתמש"}</p>
              {user.isAdmin && (
                <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  מנהל
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          התנתק
        </Button>
      </div>
    </div>
  );
}
