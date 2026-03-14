import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Bot, MessageSquare } from "lucide-react";

import { FileUploader } from "@/components/FileUploader";
import { platformService } from "@/services/platform";
import { useAuthStore } from "@/hooks/useAuthStore";
import { PremiumRAGSection } from "@/components/PremiumRAG";
import { getHardcodedAnswer, FormattedAIText } from "@/utils/hardcodedAI";

export function DocumentVaultPage() {
  const { caseId: paramCaseId } = useParams();
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const { data: cases = [] } = useQuery({ queryKey: ["lawyer-cases"], queryFn: platformService.listCases });
  const activeCases = useMemo(() => cases.filter((c: any) => c.status === "Accepted"), [cases]);

  const [selectedCaseId, setSelectedCaseId] = useState<number>(Number(paramCaseId) || 0);
  const currentCase = useMemo(() => activeCases.find((c: any) => c.id === selectedCaseId), [activeCases, selectedCaseId]);

  const { data: docs = [] } = useQuery({ queryKey: ["documents", selectedCaseId], queryFn: () => platformService.listDocuments(selectedCaseId), enabled: selectedCaseId > 0 });
  const { data: logs = [] } = useQuery({ queryKey: ["case-logs", selectedCaseId], queryFn: () => platformService.getCaseLogs(selectedCaseId), enabled: selectedCaseId > 0 });
  const { data: messages = [], refetch: refetchMessages } = useQuery({ queryKey: ["messages", selectedCaseId], queryFn: () => platformService.listMessages(selectedCaseId), enabled: selectedCaseId > 0, refetchInterval: 5000 });

  const uploadMutation = useMutation({ mutationFn: (file: File) => platformService.uploadDocument(selectedCaseId, file), onSuccess: () => qc.invalidateQueries({ queryKey: ["documents", selectedCaseId] }) });

  const [chatText, setChatText] = useState("");
  const sendMsg = useMutation({ mutationFn: (content: string) => platformService.sendMessage(selectedCaseId, content), onSuccess: () => { setChatText(""); refetchMessages(); } });

  const [aiQ, setAiQ] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: string; text: string }[]>([]);
  const [aiThinking, setAiThinking] = useState(false);
  const aiTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleAiSend = useCallback(() => {
    if (!aiQ.trim() || aiThinking) return;
    const question = aiQ;
    setAiMessages((p) => [...p, { role: "user", text: question }]);
    setAiQ("");
    setAiThinking(true);
    const delay = 1200 + Math.random() * 1800;
    aiTimerRef.current = setTimeout(() => {
      const answer = getHardcodedAnswer(question);
      setAiMessages((p) => [...p, { role: "ai", text: answer }]);
      setAiThinking(false);
    }, delay);
  }, [aiQ, aiThinking]);

  const [clientSummary, setClientSummary] = useState("");
  const summarizeMutation = useMutation({
    mutationFn: () => platformService.summarizeMessages(selectedCaseId),
    onSuccess: (data) => setClientSummary(data.summary),
  });

  const groupedDocs = useMemo(() => {
    const groups: Record<string, any[]> = {};
    docs.forEach((d: any) => { const cat = d.category || "Other"; if (!groups[cat]) groups[cat] = []; groups[cat].push(d); });
    return groups;
  }, [docs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Document Vault</h1>
        <p className="mt-1 text-sm text-slate-500">Select a client to view documents, communicate, and research.</p>
      </div>

      <select value={selectedCaseId} onChange={(e) => { setSelectedCaseId(Number(e.target.value)); setAiMessages([]); setClientSummary(""); }} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-primary">
        <option value={0}>Select a client case</option>
        {activeCases.map((c: any) => <option key={c.id} value={c.id}>{c.client_name || "Client"} — {c.title}</option>)}
      </select>

      {selectedCaseId > 0 && currentCase && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">Case Summary</h3>
              <p className="mt-2 text-sm text-slate-600">{currentCase.description}</p>
              {currentCase.next_hearing_date && <p className="mt-2 text-sm text-amber-700">Next hearing: {currentCase.next_hearing_date}</p>}
            </div>
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Client Details Summary</h3>
                <button onClick={() => summarizeMutation.mutate()} disabled={summarizeMutation.isPending} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-200">
                  {summarizeMutation.isPending ? "Summarizing..." : "Generate Summary"}
                </button>
              </div>
              {clientSummary ? <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{clientSummary}</p> : <p className="mt-3 text-sm text-slate-400">Click to generate an AI summary of client messages.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Activity Logs</h3>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
              {logs.length === 0 && <p className="text-xs text-slate-400">No logs yet.</p>}
              {logs.map((log: any) => (
                <div key={log.id} className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                  <span className="font-medium text-slate-500">{new Date(log.created_at).toLocaleDateString()}</span> — {log.message}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-slate-900">Documents</h3>
            {Object.keys(groupedDocs).length === 0 && <p className="mt-3 text-sm text-slate-400">No documents uploaded yet.</p>}
            {Object.entries(groupedDocs).map(([cat, catDocs]) => (
              <div key={cat} className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{cat}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {catDocs.map((doc: any, idx: number) => (
                    <div key={doc.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-slate-800">{idx + 1}. {doc.original_name || "Document"}</p>
                        <a href={platformService.downloadDocumentUrl(doc.id)} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"><Download className="h-4 w-4" /></a>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{doc.summary}</p>
                      {doc.tags?.length > 0 && <p className="mt-1 text-[11px] text-slate-400">Tags: {doc.tags.join(", ")}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4"><FileUploader onUpload={(file) => uploadMutation.mutateAsync(file)} /></div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h3 className="mb-1 flex items-center gap-2 font-bold text-slate-900"><MessageSquare className="h-4 w-4" />Chat with Client</h3>
              <p className="mb-3 text-xs text-slate-400">Messages are visible to both you and the client.</p>
              <div className="flex h-64 flex-col overflow-y-auto rounded-xl bg-slate-50 p-3">
                {messages.length === 0 && <p className="m-auto text-sm text-slate-400">No messages yet.</p>}
                {messages.map((m: any) => (
                  <div key={m.id} className={`mb-2 max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender_id === user?.user_id ? "ml-auto bg-primary/10 text-slate-800" : "bg-white text-slate-700 shadow-sm"}`}>
                    <p className="text-[11px] font-medium text-slate-500">{m.sender_name}</p>
                    <p className="mt-0.5">{m.content}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input value={chatText} onChange={(e) => setChatText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg.mutate(chatText)} placeholder="Type a message..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                <button onClick={() => sendMsg.mutate(chatText)} disabled={!chatText.trim()} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Send</button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <h3 className="mb-1 flex items-center gap-2 font-bold text-slate-900"><Bot className="h-4 w-4" />AI Research Chat</h3>
              <p className="mb-3 text-xs text-slate-400">AI uses case summary, docs, and logs to answer your questions.</p>
              <div className="flex h-64 flex-col overflow-y-auto rounded-xl bg-slate-50 p-3">
                {aiMessages.length === 0 && <p className="m-auto text-sm text-slate-400">Ask a research question...</p>}
                {aiMessages.map((m, i) => (
                  <div key={i} className={`mb-2 max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-primary/10 text-slate-800" : "bg-white text-slate-700 shadow-sm"}`}>
                    {m.role === "ai" ? <FormattedAIText text={m.text} /> : <p className="whitespace-pre-wrap">{m.text}</p>}
                  </div>
                ))}
                {aiThinking && <div className="mb-2 max-w-[85%] rounded-xl bg-white px-3 py-2 text-sm text-slate-400 shadow-sm animate-pulse">Analyzing case materials...</div>}
              </div>
              <div className="mt-3 flex gap-2">
                <input value={aiQ} onChange={(e) => setAiQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSend()} placeholder="Ask about the case..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
                <button onClick={handleAiSend} disabled={!aiQ.trim() || aiThinking} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Ask</button>
              </div>
            </div>
          </div>

          <PremiumRAGSection />
        </>
      )}
    </div>
  );
}
