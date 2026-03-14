import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Card } from "@/components/Card";
import { platformService } from "@/services/platform";

export function CaseRequestsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cases = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: platformService.listCases });
  const pendingCases = cases.filter((c: any) => c.status === "Pending");

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => platformService.updateCase(id, { status }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["lawyer-cases"] });
      if (vars.status === "Accepted") navigate("/lawyer/active-cases");
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Case Requests</h1>
      {pendingCases.map((item: any) => (
        <Card key={item.id}>
          <p className="font-semibold">{item.title}</p>
          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => updateMutation.mutate({ id: item.id, status: "Accepted" })}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Accept Case
            </button>
            <button
              onClick={() => updateMutation.mutate({ id: item.id, status: "Rejected" })}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium"
            >
              Reject Case
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
