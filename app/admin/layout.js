import { AdminGate } from "@/components/admin/admin-gate";
import { ConsoleLayout } from "@/components/console/console-layout";

// Admin shares the Console sidebar with Studio; the static password screen still gates every /admin/* route.
export default function AdminLayout({ children }) {
  return (
    <ConsoleLayout>
      <AdminGate>{children}</AdminGate>
    </ConsoleLayout>
  );
}
