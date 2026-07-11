import { AdminGate } from "@/components/admin/admin-gate";

// Gate every /admin/* route behind the static password screen for the session.
export default function AdminLayout({ children }) {
  return <AdminGate>{children}</AdminGate>;
}
