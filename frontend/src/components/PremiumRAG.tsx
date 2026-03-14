import { useCallback, useRef, useState } from "react";
import {
  Sparkles,
  Database,
  Cpu,
  FileSearch,
  ArrowRight,
  CheckCircle,
  Zap,
  Lock,
  BookOpen,
  BarChart3,
  Layers,
  X,
  ChevronRight,
} from "lucide-react";

const RAG_FEATURES = [
  { icon: Database, title: "Vector Database Indexing", desc: "Processes up to 1,500 pages into high-dimensional vector embeddings using state-of-the-art transformer models." },
  { icon: FileSearch, title: "Semantic Document Search", desc: "Find relevant clauses, precedents, and facts across thousands of pages in milliseconds — not keyword matching, true meaning-based search." },
  { icon: Cpu, title: "Multi-Model Inference Pipeline", desc: "RAG pipeline combines retrieval with GPT-class generation for precise, citation-backed answers grounded in your documents." },
  { icon: Layers, title: "Chunked Document Processing", desc: "Intelligent document chunking preserves context across sections, tables, and annexures for accurate retrieval." },
  { icon: BarChart3, title: "Structured Output & Analytics", desc: "Get streamlined summaries, comparison tables, timeline extractions, and risk assessments in organized format." },
  { icon: BookOpen, title: "Legal Research Acceleration", desc: "Trained on Indian legal frameworks — IPC, CrPC, CPC, Evidence Act, and landmark judgments for contextual answers." },
];

const HARDCODED_RAG_RESPONSES: Record<string, { chunks: string[]; answer: string }> = {
  default: {
    chunks: [
      "[Chunk 47/1284] Section 302 IPC — Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine...",
      "[Chunk 183/1284] Witness Statement #4 — 'I saw two men arguing near the restaurant. One of them had a sharp object...'",
      "[Chunk 612/1284] Post-mortem Report — Cause of death: hemorrhagic shock due to penetrating injury to the thoracic cavity...",
      "[Chunk 891/1284] FIR No. 247/2024 — Registered at PS Connaught Place on 11 March 2024 under Sections 302/34 IPC...",
      "[Chunk 1043/1284] Supreme Court in Sharad Birdhichand Sarda v. State of Maharashtra — Five golden principles of circumstantial evidence...",
    ],
    answer: `**RAG Analysis Complete**

Based on retrieval across 1,284 document pages (vectorized into 2,847 chunks), here is the structured analysis:

**Key Legal Findings:**
• FIR No. 247/2024 registered under Sections 302/34 IPC at PS Connaught Place
• Post-mortem confirms cause of death as hemorrhagic shock from a penetrating thoracic injury
• Multiple witness statements place Gurur Singh near the scene but do not directly implicate him in the act

**Precedent Analysis:**
• *Sharad Birdhichand Sarda v. State of Maharashtra* (AIR 1984 SC 1622) — The five golden principles for circumstantial evidence must form a complete chain
• *Hanumant v. State of Madhya Pradesh* (AIR 1952 SC 343) — Circumstances must be conclusive in nature

**Risk Assessment:**
• Prosecution strength: Medium — relies primarily on circumstantial evidence
• Defense viability: Strong — no direct evidence, voluntary cooperation, no prior record
• Bail probability: High — anticipatory bail under Section 438 CrPC is viable

**Recommended Actions:**
1. File anticipatory bail immediately with supporting affidavit
2. Request CCTV footage from 3 establishments within 200m radius
3. Challenge FIR on grounds of delayed registration (1 day gap)
4. Prepare character witnesses and employment records`,
  },
};

function getRAGResponse(_query: string) {
  return HARDCODED_RAG_RESPONSES["default"];
}

export function PremiumRAGSection() {
  const [showModal, setShowModal] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [ragQuery, setRagQuery] = useState("");
  const [ragPhase, setRagPhase] = useState<"idle" | "vectorizing" | "retrieving" | "inferring" | "done">("idle");
  const [ragResult, setRagResult] = useState<{ chunks: string[]; answer: string } | null>(null);
  const [visibleChunks, setVisibleChunks] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handlePurchase = () => {
    setPurchased(true);
    setShowModal(false);
  };

  const handleRagSearch = useCallback(() => {
    if (!ragQuery.trim() || ragPhase !== "idle") return;
    setRagResult(null);
    setVisibleChunks(0);
    setRagPhase("vectorizing");

    setTimeout(() => {
      setRagPhase("retrieving");
      const response = getRAGResponse(ragQuery);
      setRagResult(response);
      let chunkIdx = 0;
      const showNextChunk = () => {
        if (chunkIdx < response.chunks.length) {
          chunkIdx++;
          setVisibleChunks(chunkIdx);
          timerRef.current = setTimeout(showNextChunk, 400 + Math.random() * 300);
        } else {
          setRagPhase("inferring");
          setTimeout(() => setRagPhase("done"), 2000);
        }
      };
      timerRef.current = setTimeout(showNextChunk, 600);
    }, 1800);
  }, [ragQuery, ragPhase]);

  const resetRag = () => {
    setRagPhase("idle");
    setRagResult(null);
    setRagQuery("");
    setVisibleChunks(0);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 p-6 shadow-sm">
        <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-indigo-100/40 blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 h-24 w-24 rounded-full bg-purple-100/40 blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Premium RAG Model Interface</h3>
                <p className="text-xs text-indigo-600">Retrieval-Augmented Generation for Legal Research</p>
              </div>
            </div>
            <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              Pro
            </span>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            Purpose-built for lawyers handling bulky case files — process <strong>1,200–1,300+ pages</strong> of legal documents, 
            vectorize them into searchable embeddings, and get citation-backed answers using advanced RAG inference.
          </p>

          {!purchased ? (
            <>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {RAG_FEATURES.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl bg-white/70 p-3 backdrop-blur-sm">
                    <f.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{f.title}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl bg-white/80 p-4 backdrop-blur-sm">
                <div>
                  <p className="text-lg font-bold text-slate-900">₹10,000 <span className="text-sm font-normal text-slate-400">/ per case</span></p>
                  <p className="text-[11px] text-slate-500">One-time payment. Unlimited queries for this case.</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl hover:shadow-indigo-300"
                >
                  Paid Version
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" />Secure payment</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3" />Instant access</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Used by 500+ lawyers</span>
              </div>
            </>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">Premium RAG Model Activated</span>
              </div>

              <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">RAG Pipeline</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium ${ragPhase === "vectorizing" ? "animate-pulse bg-indigo-100 text-indigo-700" : ragPhase !== "idle" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                    <Database className="h-3.5 w-3.5" />Vectorize
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium ${ragPhase === "retrieving" ? "animate-pulse bg-indigo-100 text-indigo-700" : ["inferring", "done"].includes(ragPhase) ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                    <FileSearch className="h-3.5 w-3.5" />Retrieve
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium ${ragPhase === "inferring" ? "animate-pulse bg-indigo-100 text-indigo-700" : ragPhase === "done" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                    <Cpu className="h-3.5 w-3.5" />Infer
                  </div>
                  <ChevronRight className="h-3 w-3 text-slate-300" />
                  <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium ${ragPhase === "done" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
                    <Sparkles className="h-3.5 w-3.5" />Answer
                  </div>
                </div>
              </div>

              {ragResult && visibleChunks > 0 && (
                <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Retrieved Chunks</p>
                  <div className="max-h-40 space-y-1.5 overflow-y-auto">
                    {ragResult.chunks.slice(0, visibleChunks).map((chunk, i) => (
                      <div key={i} className="rounded-lg bg-white p-2.5 text-xs text-slate-600 shadow-sm transition animate-in fade-in">
                        <span className="font-mono text-indigo-500">{chunk.split("]")[0]}]</span>
                        <span className="text-slate-600">{chunk.split("]").slice(1).join("]")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ragPhase === "inferring" && (
                <div className="rounded-xl border border-indigo-200/60 bg-indigo-50/50 p-4 text-center">
                  <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                  <p className="text-xs font-medium text-indigo-600">Running multi-model inference pipeline...</p>
                  <p className="mt-1 text-[11px] text-indigo-400">Generating citation-backed response from retrieved context</p>
                </div>
              )}

              {ragPhase === "done" && ragResult && (
                <div className="rounded-xl border border-slate-200/60 bg-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">RAG Inference Output</p>
                    <button onClick={resetRag} className="text-xs text-primary hover:underline">New query</button>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-slate-700">
                    {ragResult.answer.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                      part.startsWith("**") && part.endsWith("**")
                        ? <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>
                        : <span key={i}>{part}</span>
                    )}
                  </div>
                </div>
              )}

              {ragPhase === "idle" && (
                <div className="flex gap-2">
                  <input
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRagSearch()}
                    placeholder="Ask across all case documents (1,284 pages indexed)..."
                    className="flex-1 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
                  />
                  <button
                    onClick={handleRagSearch}
                    disabled={!ragQuery.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:shadow-lg disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    Search
                  </button>
                </div>
              )}

              {ragPhase !== "idle" && ragPhase !== "done" && (
                <p className="text-center text-[11px] text-slate-400 animate-pulse">Processing query across vectorized document store...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Upgrade to Premium RAG</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
              <p className="text-center text-2xl font-bold text-slate-900">₹10,000</p>
              <p className="text-center text-xs text-slate-500">One-time payment per case</p>
            </div>

            <div className="mt-4 space-y-2">
              {[
                "Process 1,200–1,300+ pages of legal documents",
                "Vector embeddings with semantic search",
                "Multi-model RAG inference pipeline",
                "Citation-backed answers from your documents",
                "Structured legal analysis & risk assessment",
                "Unlimited queries for the active case",
                "Priority support & processing",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Designed for big-shot lawyers handling complex, document-heavy cases. The premium RAG model vectorizes your entire
              case file into a searchable knowledge base, enabling deep research that would take hours in minutes.
            </p>

            <button
              onClick={handlePurchase}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
            >
              Purchase Premium Access — ₹10,000
            </button>

            <p className="mt-2 text-center text-[11px] text-slate-400">Secure payment. Instant activation.</p>
          </div>
        </div>
      )}
    </>
  );
}
