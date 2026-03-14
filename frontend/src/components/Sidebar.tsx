import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";

interface Item { label: string; to: string }

export function Sidebar({ items }: { items: Item[] }) {
  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-col border-r border-slate-200/60 bg-white">
      <div className="flex h-16 items-center px-6">
        <span className="text-lg font-bold tracking-tight text-primary">BlindVerdict</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all",
                isActive
                  ? "bg-primary/5 text-primary"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-100 px-4 py-3">
        <p className="text-[11px] text-slate-400">BlindVerdict v1.0</p>
      </div>
    </aside>
  );
}
