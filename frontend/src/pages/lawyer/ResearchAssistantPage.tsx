import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Card } from "@/components/Card";
import { platformService } from "@/services/platform";

export function ResearchAssistantPage() {
  const [query, setQuery] = useState("");
  const [caseId, setCaseId] = useState<number | null>(null);
  const { data: cases = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: platformService.listCases });
  const activeCases = useMemo(() => cases.filter((c: any) => c.status === "Accepted"), [cases]);

  const researchMutation = useMutation({
    mutationFn: () => platformService.research(caseId || 0, query),
  });

  return (
    <Card>
      <h1 className="text-2xl font-semibold">AI Research Assistant</h1>
      <p className="mt-1 text-sm text-slate-600">Query case documents and retrieve relevant excerpts.</p>
      <div className="mt-5 space-y-3">
        <select
          value={caseId || ""}
          onChange={(e) => setCaseId(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Select active case</option>
          {activeCases.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search query"
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          onClick={() => researchMutation.mutate()}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Search
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {(researchMutation.data?.results || []).map((result: any, i: number) => (
          <div key={i} className="rounded-xl border border-slate-200 p-3">
            <p className="text-sm font-medium">{result.file}</p>
            <p className="text-sm text-slate-600">{result.excerpt}</p>
            <p className="text-xs text-slate-500">Confidence: {result.score}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
