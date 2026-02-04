"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, LogOut, RefreshCcw } from "lucide-react";

export default function PendingApprovalPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">ממתין לאישור</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            החשבון שלך ממתין לאישור מנהל המערכת.
            <br />
            תקבל גישה לאחר שמנהל יאשר את הבקשה שלך.
          </p>

          <div className="pt-4 space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleRefresh}
            >
              <RefreshCcw className="h-4 w-4 ml-2" />
              בדוק שוב
            </Button>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 ml-2" />
              התנתק
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
