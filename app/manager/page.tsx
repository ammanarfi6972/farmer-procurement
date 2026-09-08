import { getManagerDashboardData } from "@/lib/manager/actions";
import { ManagerDashboardClient } from "./dashboard-client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function ManagerPage() {
  const data = await getManagerDashboardData();

  if (!data || !data.centre) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Alert variant="destructive" className="bg-red-950 border-red-900 text-red-200">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            You are not assigned to any active procurement centre. Please contact the administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <ManagerDashboardClient initialData={data} />;
}
