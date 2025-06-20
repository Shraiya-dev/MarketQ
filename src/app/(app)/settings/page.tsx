
import { PageHeader } from "@/components/PageHeader";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your application settings and preferences."
        icon={Settings}
      />
      <div className="bg-card p-6 rounded-lg shadow">
        <p className="text-card-foreground">
          This is the settings page. More options will be available here soon.
        </p>
      </div>
    </div>
  );
}
