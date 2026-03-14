import { api } from "./api";

export const platformService = {
  analyzeIssue: async (description: string, language: string) => {
    const { data } = await api.post("/ai/analyze", { description, language });
    return data;
  },
  getLawyers: async () => (await api.get("/lawyers")).data,
  getLawyer: async (id: string) => (await api.get(`/lawyers/${id}`)).data,
  createCase: async (payload: { title: string; description: string; lawyer_id?: number; expected_budget?: string }) =>
    (await api.post("/cases", payload)).data,
  listCases: async () => (await api.get("/cases")).data,
  updateCase: async (id: number, payload: { status?: string; lawyer_id?: number; next_hearing_date?: string }) =>
    (await api.patch(`/cases/${id}`, payload)).data,
  uploadDocument: async (caseId: number, file: File) => {
    const fd = new FormData();
    fd.append("case_id", String(caseId));
    fd.append("file", file);
    return (await api.post("/documents/upload", fd)).data;
  },
  listDocuments: async (caseId: number) => (await api.get(`/documents/${caseId}`)).data,
  downloadDocumentUrl: (docId: number) => {
    const token = api.defaults.headers.common.Authorization?.toString().replace("Bearer ", "") || "";
    return `${api.defaults.baseURL}/documents/download/${docId}?token=${token}`;
  },
  timeline: async (description: string) => (await api.post("/ai/timeline", { description })).data,
  research: async (case_id: number, query: string) => (await api.post("/research", { case_id, query })).data,
  aiChat: async (case_id: number, question: string) => (await api.post("/ai/chat", { case_id, question })).data,
  summarizeMessages: async (case_id: number) => (await api.post("/ai/summarize-messages", { case_id })).data,
  sendMessage: async (case_id: number, content: string) => (await api.post("/messages", { case_id, content })).data,
  listMessages: async (caseId: number) => (await api.get(`/messages/${caseId}`)).data,
  getCaseLogs: async (caseId: number) => (await api.get(`/caselogs/${caseId}`)).data,
  submitReview: async (payload: { case_id: number; target_user_id: number; score: number; feedback: string }) =>
    (await api.post("/reviews", payload)).data,
  getReviews: async (caseId: number) => (await api.get(`/reviews/${caseId}`)).data,
};
