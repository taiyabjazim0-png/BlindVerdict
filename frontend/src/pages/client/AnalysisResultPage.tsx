import { useLocation, Link } from "react-router-dom";

import { Card } from "@/components/Card";

export function AnalysisResultPage() {
  const location = useLocation();
  const { title, description, analysis } = location.state || {};

  if (!analysis) {
    return (
      <Card>
        <p className="text-slate-600">No analysis data found.</p>
        <Link to="/client/submit-issue" className="mt-4 inline-block text-primary hover:underline">
          Submit a new issue
        </Link>
      </Card>
    );
  }

  const steps = analysis.steps || [];

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h1 className="text-xl font-semibold text-slate-900">Analysis Result</h1>
        <p className="mt-1 text-sm text-slate-600">A lawyer is not required for this issue. Follow the steps below.</p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <h3 className="text-sm font-medium text-slate-700">Category</h3>
          <p className="mt-1 text-slate-900">{analysis.legal_category}</p>
          <h3 className="mt-3 text-sm font-medium text-slate-700">Complexity</h3>
          <p className="mt-1 text-slate-900">{analysis.complexity}</p>
        </div>

        {steps.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-slate-800">Steps to resolve</h3>
            <ol className="mt-3 space-y-2">
              {steps.map((step: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Link to="/client/dashboard" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium">
            Back to Home
          </Link>
          <Link to="/client/submit-issue" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">
            Submit another issue
          </Link>
        </div>
      </Card>
    </div>
  );
}
