import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Star, Briefcase, IndianRupee, MapPin } from "lucide-react";
import { useCaseFlowStore } from "@/features/useCaseFlowStore";
import { platformService } from "@/services/platform";

type SortBy = "experience" | "rating" | "price";

function parsePriceLow(range: string): number {
  const match = range.replace(/[₹,]/g, "").match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

export function LawyerMatchingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = useCaseFlowStore((s) => s.analysis);
  const setSelectedCaseId = useCaseFlowStore((s) => s.setSelectedCaseId);
  const title = location.state?.title || "Untitled Case";
  const description = location.state?.description || "";
  const [sortBy, setSortBy] = useState<SortBy>("experience");
  const [filterState, setFilterState] = useState<string>("");
  const [showRaiseTicket, setShowRaiseTicket] = useState<number | null>(null);
  const [expectedBudget, setExpectedBudget] = useState("");

  const { data: lawyers = [] } = useQuery({ queryKey: ["lawyers"], queryFn: platformService.getLawyers });

  const stateOptions = useMemo(() => {
    const states = lawyers.map((l: any) => l.state).filter(Boolean) as string[];
    return [...new Set(states)].sort();
  }, [lawyers]);

  const filteredLawyers = useMemo(() => {
    if (!filterState) return lawyers;
    return lawyers.filter((l: any) => l.state === filterState);
  }, [lawyers, filterState]);

  const sortedLawyers = useMemo(() => {
    return [...filteredLawyers].sort((a: any, b: any) => {
      if (sortBy === "experience") return (b.experience ?? 0) - (a.experience ?? 0);
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      return parsePriceLow(a.price_range || "") - parsePriceLow(b.price_range || "");
    });
  }, [filteredLawyers, sortBy]);

  const createCase = useMutation({
    mutationFn: ({ lawyerId, budget }: { lawyerId: number; budget: string }) =>
      platformService.createCase({ title, description, lawyer_id: lawyerId, expected_budget: budget || undefined }),
    onSuccess: (data) => { setSelectedCaseId(data.id); setShowRaiseTicket(null); setExpectedBudget(""); navigate("/client/my-cases"); },
  });

  return (
    <div className="space-y-6">
      {analysis && (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">AI Legal Analysis</h2>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Category</span><p className="mt-1 font-semibold text-slate-800">{analysis.legal_category}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Complexity</span><p className="mt-1 font-semibold text-slate-800">{analysis.complexity}</p></div>
            <div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Lawyer Required</span><p className="mt-1 font-semibold text-primary">Yes</p></div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Recommended Lawyers</h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">State</span>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
            >
              <option value="">All States</option>
              {stateOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Sort by</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-primary">
              <option value="experience">Experience</option>
              <option value="rating">Rating</option>
              <option value="price">Price (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {sortedLawyers.length === 0 && (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-400">No lawyers found{filterState ? ` in ${filterState}` : ""}. Try changing your filters.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {sortedLawyers.map((lawyer: any) => (
          <div key={lawyer.id} className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{lawyer.name}</h3>
                <p className="mt-0.5 text-sm text-primary/80">{lawyer.specialization}</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-amber-700">{lawyer.rating}</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{lawyer.experience} yrs</span>
              <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />{lawyer.price_range}</span>
              {(lawyer.city || lawyer.state) && (
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{[lawyer.city, lawyer.state].filter(Boolean).join(", ")}</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => navigate(`/client/lawyers/${lawyer.id}`, { state: { title, description } })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">View Profile</button>
              <button onClick={() => setShowRaiseTicket(showRaiseTicket === lawyer.id ? null : lawyer.id)} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">Raise a ticket</button>
            </div>
            {showRaiseTicket === lawyer.id && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-2 text-sm text-slate-600">Typical range: <span className="font-semibold text-slate-800">{lawyer.price_range}</span></p>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Your budget expectation</span>
                  <input value={expectedBudget} onChange={(e) => setExpectedBudget(e.target.value)} placeholder="e.g. ₹20,000 - ₹40,000" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                </label>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => createCase.mutate({ lawyerId: lawyer.id, budget: expectedBudget })} disabled={createCase.isPending} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">Submit ticket</button>
                  <button onClick={() => { setShowRaiseTicket(null); setExpectedBudget(""); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
