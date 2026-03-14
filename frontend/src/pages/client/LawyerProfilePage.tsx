import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Star, Briefcase, IndianRupee, MapPin } from "lucide-react";

import { platformService } from "@/services/platform";
import { useCaseFlowStore } from "@/features/useCaseFlowStore";

export function LawyerProfilePage() {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const location = useLocation();
  const setSelectedCaseId = useCaseFlowStore((s) => s.setSelectedCaseId);
  const title = location.state?.title || "Case Request";
  const description = location.state?.description || "Client requested legal assistance.";
  const [expectedBudget, setExpectedBudget] = useState("");
  const { data: lawyer } = useQuery({ queryKey: ["lawyer", id], queryFn: () => platformService.getLawyer(id) });

  const createCase = useMutation({
    mutationFn: () => platformService.createCase({ title, description, lawyer_id: Number(id), expected_budget: expectedBudget || undefined }),
    onSuccess: (data) => { setSelectedCaseId(data.id); navigate("/client/my-cases"); },
  });

  if (!lawyer) return <div className="rounded-2xl border border-slate-200/60 bg-white p-8 text-center shadow-sm"><p className="text-sm text-slate-400">Loading profile...</p></div>;

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lawyer.name}</h1>
            <p className="mt-1 text-sm text-primary/80">{lawyer.specialization}</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-amber-700">{lawyer.rating}</span>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">{lawyer.bio}</p>
        <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3"><Briefcase className="h-4 w-4 text-slate-400" /><span>{lawyer.experience} years experience</span></div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3"><IndianRupee className="h-4 w-4 text-slate-400" /><span>{lawyer.price_range}</span></div>
          {(lawyer.city || lawyer.state) && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3"><MapPin className="h-4 w-4 text-slate-400" /><span>{[lawyer.city, lawyer.state].filter(Boolean).join(", ")}</span></div>
          )}
          <div className="rounded-xl bg-slate-50 p-3">Cases handled: {lawyer.cases_handled}</div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="mb-3 text-sm text-slate-600">This lawyer typically charges: <span className="font-semibold text-slate-800">{lawyer.price_range}</span></p>
          <label className="block">
            <span className="mb-1 block text-xs text-slate-500">Your budget expectation</span>
            <input value={expectedBudget} onChange={(e) => setExpectedBudget(e.target.value)} placeholder="e.g. ₹20,000 - ₹40,000" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button onClick={() => createCase.mutate()} disabled={createCase.isPending} className="mt-3 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
            {createCase.isPending ? "Submitting..." : "Raise Case Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
