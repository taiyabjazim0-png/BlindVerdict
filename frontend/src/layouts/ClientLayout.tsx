import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

const items = [
  { label: "Home", to: "/client/dashboard" },
  { label: "Submit Legal Issue", to: "/client/submit-issue" },
  { label: "My Cases", to: "/client/my-cases" },
  { label: "Lawyer Review", to: "/client/lawyer-review" },
  { label: "Profile", to: "/client/profile" },
  { label: "Logout", to: "/logout" },
];

export function ClientLayout() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar items={items} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
