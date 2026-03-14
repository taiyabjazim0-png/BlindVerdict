import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Briefcase, Clock, CheckCircle, Users, ArrowRight } from "lucide-react";

import { platformService } from "@/services/platform";

export function LawyerDashboardPage() {
  const { data: cases = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: platformService.listCases });
  const pending = cases.filter((c: any) => c.status === "Pending");
  const active = cases.filter((c: any) => c.status === "Accepted");
  const closed = cases.filter((c: any) => c.status === "Rejected" || c.status === "Closed");
  const clientNames = [...new Set(active.map((c: any) => c.client_name).filter(Boolean))] as string[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your practice</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{active.length}</p><p className="text-xs text-slate-500">Active</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50"><Clock className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{pending.length}</p><p className="text-xs text-slate-500">Pending</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"><Briefcase className="h-5 w-5 text-slate-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{closed.length}</p><p className="text-xs text-slate-500">Closed</p></div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50"><Users className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{clientNames.length}</p><p className="text-xs text-slate-500">Clients</p></div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Onboarded Clients</h3>
            <span className="text-xs text-slate-400">{clientNames.length} total</span>
          </div>
          <div className="mt-4 space-y-2">
            {clientNames.length === 0 && <p className="text-sm text-slate-400">No active clients yet.</p>}
            {clientNames.map((name) => (
              <div key={name} className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700">{name}</div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Activity</h3>
            <Link to="/lawyer/inbox" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">Inbox <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-4 space-y-2">
            {cases.slice(0, 5).map((c: any) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-100 p-3 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{c.title}</p>
                  {c.client_name && <p className="text-xs text-slate-400">{c.client_name}</p>}
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "Accepted" ? "bg-emerald-50 text-emerald-700" : c.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
