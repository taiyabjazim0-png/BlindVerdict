import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";

const items = [
  { label: "Home", to: "/lawyer/dashboard" },
  { label: "Inbox", to: "/lawyer/inbox" },
  { label: "Active Cases", to: "/lawyer/active-cases" },
  { label: "History", to: "/lawyer/history" },
  { label: "Document Vault", to: "/lawyer/vault" },
  { label: "Client Review", to: "/lawyer/client-review" },
  { label: "Profile", to: "/lawyer/profile" },
  { label: "Logout", to: "/logout" },
];

export function LawyerLayout() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar items={items} />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
