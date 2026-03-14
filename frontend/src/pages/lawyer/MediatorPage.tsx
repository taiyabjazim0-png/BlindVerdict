import { useNavigate, useParams } from "react-router-dom";

import { Card } from "@/components/Card";
import { getMediatorForCase } from "@/features/mediators";

export function MediatorPage() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const mediator = getMediatorForCase(Number(caseId) || 0);

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h1 className="text-2xl font-semibold text-slate-900">Mediator Assigned</h1>
        <p className="mt-1 text-sm text-slate-600">
          A mediator has been assigned to coordinate between you and the client. They will contact both parties shortly.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
              {mediator.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{mediator.name}</p>
              <p className="text-sm text-slate-600">{mediator.specialization}</p>
              <p className="text-sm text-slate-500">Phone: {mediator.phone}</p>
              <p className="text-sm text-slate-500">Email: {mediator.email}</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          The mediator only knows your contact number and the client's contact number. They will help finalize case details before you begin.
        </p>

        <button
          onClick={() => navigate(`/lawyer/payment/${caseId}?redirect=/lawyer/active-cases&role=lawyer`)}
          className="mt-6 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Continue to Payment
        </button>
      </Card>
    </div>
  );
}
