import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Briefcase, Clock, CheckCircle, ArrowRight } from "lucide-react";

import { platformService } from "@/services/platform";

export function ClientDashboardPage() {
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: platformService.listCases });
  const active = cases.filter((c: any) => c.status === "Accepted");
  const pending = cases.filter((c: any) => c.status === "Pending");
  const closed = cases.filter((c: any) => c.status === "Closed" || c.status === "Rejected");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your legal cases</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-2xl font-bold text-slate-900">{active.length}</p><p className="text-xs text-slate-500">Active Cases</p></div>
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
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Quick Actions</h3>
          <Link to="/client/submit-issue" className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Submit Issue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Recent Cases</h3>
        {cases.length === 0 && <p className="py-4 text-center text-sm text-slate-400">No cases yet. Submit a legal issue to get started.</p>}
        <div className="space-y-2">
          {cases.slice(0, 5).map((c: any) => (
            <Link key={c.id} to="/client/my-cases" className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 transition hover:bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-800">{c.title}</p>
                {c.lawyer_name && <p className="mt-0.5 text-xs text-slate-400">Lawyer: {c.lawyer_name}</p>}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.status === "Accepted" ? "bg-emerald-50 text-emerald-700" : c.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
