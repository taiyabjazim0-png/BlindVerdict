import { create } from "zustand";

interface CaseFlowState {
  analysis: {
    legal_category: string;
    complexity: string;
    lawyer_required: boolean;
    steps?: string[] | null;
  } | null;
  selectedCaseId: number | null;
  setAnalysis: (analysis: CaseFlowState["analysis"]) => void;
  setSelectedCaseId: (id: number | null) => void;
}

export const useCaseFlowStore = create<CaseFlowState>((set) => ({
  analysis: null,
  selectedCaseId: null,
  setAnalysis: (analysis) => set({ analysis }),
  setSelectedCaseId: (selectedCaseId) => set({ selectedCaseId }),
}));
