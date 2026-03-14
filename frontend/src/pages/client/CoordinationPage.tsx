import { useNavigate, useParams } from "react-router-dom";
import { Phone, Mail, User } from "lucide-react";

import { getMediatorForCase } from "@/features/mediators";

export function CoordinationPage() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const mediator = getMediatorForCase(Number(caseId) || 0);

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Coordination Step</h1>
        <p className="mt-2 text-sm text-slate-500">Your case has been accepted. A mediator has been assigned to facilitate initial coordination.</p>

        <div className="mt-6 rounded-xl border border-slate-200/60 bg-slate-50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <User className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{mediator.name}</p>
              <p className="text-sm text-primary/80">{mediator.specialization}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4 text-slate-400" />{mediator.phone}</div>
            <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4 text-slate-400" />{mediator.email}</div>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-500">The mediator knows only your contact number and the lawyer's contact number. They will reach out shortly to facilitate introductions.</p>

        <button onClick={() => navigate(`/client/payment/${caseId}?redirect=/client/workspace/${caseId}&role=client`)} className="mt-6 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
