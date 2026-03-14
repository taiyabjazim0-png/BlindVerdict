import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import { platformService } from "@/services/platform";

export function LawyerReviewPage() {
  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: platformService.listCases });
  const activeCases = useMemo(() => cases.filter((c: any) => c.status === "Accepted"), [cases]);
  const [selectedCaseId, setSelectedCaseId] = useState<number>(0);
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const currentCase = activeCases.find((c: any) => c.id === selectedCaseId);

  const reviewMutation = useMutation({
    mutationFn: () => platformService.submitReview({ case_id: selectedCaseId, target_user_id: currentCase?.lawyer_id || 0, score, feedback }),
    onSuccess: () => { setSubmitted(true); setFeedback(""); },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Lawyer Review</h1>
        <p className="mt-1 text-sm text-slate-500">Rate your assigned lawyer. Visible only to administrators for flagging.</p>
      </div>
      <select value={selectedCaseId} onChange={(e) => { setSelectedCaseId(Number(e.target.value)); setSubmitted(false); }} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary">
        <option value={0}>Select a case</option>
        {activeCases.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      {selectedCaseId > 0 && currentCase && (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Review Lawyer</h3>
          <div className="mt-4 space-y-4">
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">Rating</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button key={v} onClick={() => setScore(v)} className="p-1 transition hover:scale-110">
                    <Star className={`h-6 w-6 ${v <= score ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                  </button>
                ))}
              </div>
              <p className="mt-1 text-sm text-slate-500">{score} / 5</p>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Feedback (internal only)</span>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} placeholder="Optional feedback..." className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </label>
            <button onClick={() => reviewMutation.mutate()} disabled={reviewMutation.isPending || submitted} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50">
              {submitted ? "Review submitted" : "Submit review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
