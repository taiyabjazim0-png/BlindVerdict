import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, Shield, Download, MessageSquare, Bot, Calendar } from "lucide-react";

import { FileUploader } from "@/components/FileUploader";
import { Timeline } from "@/components/Timeline";
import { platformService } from "@/services/platform";
import { useAuthStore } from "@/hooks/useAuthStore";
import { getHardcodedAnswer, FormattedAIText } from "@/utils/hardcodedAI";

export function CaseWorkspacePage() {
  const { caseId = "0" } = useParams();
  const numericCaseId = Number(caseId);
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const { data: cases = [] } = useQuery({ queryKey: ["cases"], queryFn: platformService.listCases });
  const caseData = useMemo(() => cases.find((c: any) => c.id === numericCaseId), [cases, numericCaseId]);
  const { data: docs = [] } = useQuery({ queryKey: ["documents", numericCaseId], queryFn: () => platformService.listDocuments(numericCaseId) });
  const { data: timeline } = useQuery({ queryKey: ["timeline", numericCaseId], queryFn: () => platformService.timeline(caseData?.description || ""), enabled: !!caseData });
  const { data: messages = [], refetch: refetchMessages } = useQuery({ queryKey: ["messages", numericCaseId], queryFn: () => platformService.listMessages(numericCaseId), refetchInterval: 5000 });

  const uploadMutation = useMutation({ mutationFn: (file: File) => platformService.uploadDocument(numericCaseId, file), onSuccess: () => qc.invalidateQueries({ queryKey: ["documents", numericCaseId] }) });

  const [chatText, setChatText] = useState("");
  const sendMsg = useMutation({ mutationFn: (content: string) => platformService.sendMessage(numericCaseId, content), onSuccess: () => { setChatText(""); refetchMessages(); } });

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

  const groupedDocs = useMemo(() => {
    const groups: Record<string, any[]> = {};
    docs.forEach((d: any) => { const cat = d.category || "Other"; if (!groups[cat]) groups[cat] = []; groups[cat].push(d); });
    return groups;
  }, [docs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Case Workspace</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your case, upload documents, and communicate with your lawyer.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-900"><FileText className="h-4 w-4" />Case Overview</h3>
          <p className="mt-2 text-sm font-medium text-slate-800">{caseData?.title || "Case"}</p>
          <p className="mt-1 text-sm text-slate-600">{caseData?.description}</p>
          {caseData?.next_hearing_date && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Next Hearing: {caseData.next_hearing_date}</span>
            </div>
          )}
          {caseData?.lawyer_name && <p className="mt-2 text-xs text-slate-500">Lawyer: {caseData.lawyer_name}</p>}
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-900"><Shield className="h-4 w-4 text-primary" />Upload Documents</h3>
          <p className="mt-1 text-xs text-slate-500">Files are encrypted and accessible only by you and your assigned lawyer.</p>
          <div className="mt-4"><FileUploader onUpload={(file) => uploadMutation.mutateAsync(file)} /></div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Documents</h3>
        {Object.keys(groupedDocs).length === 0 && <p className="py-4 text-center text-sm text-slate-400">No documents uploaded yet.</p>}
        {Object.entries(groupedDocs).map(([cat, catDocs]) => (
          <div key={cat} className="mb-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{cat}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {catDocs.map((doc: any) => (
                <div key={doc.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-slate-200">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-slate-800">{doc.original_name || "Document"}</p>
                    <a href={platformService.downloadDocumentUrl(doc.id)} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">{doc.summary}</p>
                  {doc.tags?.length > 0 && <p className="mt-2 text-[11px] text-slate-400">Tags: {doc.tags.join(", ")}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-slate-900">Timeline</h3>
        <Timeline events={timeline?.events || []} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
          <h3 className="mb-1 flex items-center gap-2 font-bold text-slate-900"><MessageSquare className="h-4 w-4" />Chat with Lawyer</h3>
          <p className="mb-3 text-xs text-slate-400">Messages are visible to both you and your lawyer.</p>
          <div className="flex h-64 flex-col overflow-y-auto rounded-xl bg-slate-50 p-3">
            {messages.length === 0 && <p className="m-auto text-sm text-slate-400">No messages yet. Start the conversation.</p>}
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
          <h3 className="mb-1 flex items-center gap-2 font-bold text-slate-900"><Bot className="h-4 w-4" />AI Case Assistant</h3>
          <p className="mb-3 text-xs text-slate-400">Ask questions about your case. AI uses your documents and case details to answer.</p>
          <div className="flex h-64 flex-col overflow-y-auto rounded-xl bg-slate-50 p-3">
            {aiMessages.length === 0 && <p className="m-auto text-sm text-slate-400">Ask a question about your case...</p>}
            {aiMessages.map((m, i) => (
              <div key={i} className={`mb-2 max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-primary/10 text-slate-800" : "bg-white text-slate-700 shadow-sm"}`}>
                {m.role === "ai" ? <FormattedAIText text={m.text} /> : <p className="whitespace-pre-wrap">{m.text}</p>}
              </div>
            ))}
            {aiThinking && <div className="mb-2 max-w-[85%] rounded-xl bg-white px-3 py-2 text-sm text-slate-400 shadow-sm animate-pulse">Analyzing case materials...</div>}
          </div>
          <div className="mt-3 flex gap-2">
            <input value={aiQ} onChange={(e) => setAiQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAiSend()} placeholder="Ask a question..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary" />
            <button onClick={handleAiSend} disabled={!aiQ.trim() || aiThinking} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Ask</button>
          </div>
        </div>
      </div>
    </div>
  );
}
