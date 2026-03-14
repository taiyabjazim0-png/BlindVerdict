import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff } from "lucide-react";

import { platformService } from "@/services/platform";
import { useCaseFlowStore } from "@/features/useCaseFlowStore";

const LANGUAGES = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Bengali", label: "Bengali" },
  { value: "Marathi", label: "Marathi" },
  { value: "Telugu", label: "Telugu" },
  { value: "Tamil", label: "Tamil" },
];

const LANG_CODES: Record<string, string> = {
  English: "en-IN", Hindi: "hi-IN", Bengali: "bn-IN",
  Marathi: "mr-IN", Telugu: "te-IN", Tamil: "ta-IN",
};

export function SubmitIssuePage() {
  const navigate = useNavigate();
  const setAnalysis = useCaseFlowStore((s) => s.setAnalysis);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef("");

  const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) { alert("Speech recognition is not supported in your browser."); return; }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Recognition!() as SpeechRecognitionInstance;
    recognition.lang = LANG_CODES[language] || "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    baseTextRef.current = description;

    recognition.onresult = (e: any) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = 0; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + " ";
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      const combined = baseTextRef.current
        ? `${baseTextRef.current} ${finalTranscript}${interimTranscript}`.trim()
        : `${finalTranscript}${interimTranscript}`.trim();
      setDescription(combined);
    };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; };
    recognition.onerror = () => { setIsListening(false); recognitionRef.current = null; };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [language, SpeechRecognition, description]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { recognitionRef.current.stop(); recognitionRef.current = null; setIsListening(false); }
  }, []);

  const analyzeMutation = useMutation({
    mutationFn: () => platformService.analyzeIssue(description, language),
    onSuccess: (data) => {
      setAnalysis(data);
      if (data.lawyer_required) navigate("/client/lawyer-matching", { state: { title, description } });
      else navigate("/client/analysis-result", { state: { title, description, analysis: data } });
    },
  });

  return (
    <div className="max-w-3xl">
      <div className="rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Submit Legal Issue</h1>
        <p className="mt-1 text-sm text-slate-500">Describe your legal concern. You can type or use voice input in multiple languages.</p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief title for your issue" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-primary" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Description</span>
            <div className="relative">
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Describe your legal issue in detail..." className="w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-14 text-sm outline-none transition focus:border-primary" />
              <button type="button" onClick={isListening ? stopListening : startListening} className={`absolute right-3 top-3 rounded-xl p-2.5 transition ${isListening ? "bg-red-100 text-red-600 shadow-sm" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`} title={isListening ? "Stop recording" : "Start voice input"}>
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            </div>
            {isListening && <p className="mt-1 text-xs text-red-500 animate-pulse">Recording... Speak now.</p>}
            {!isListening && SpeechRecognition && <p className="mt-1 text-xs text-slate-400">Click the mic to speak. Supports Hindi, Bengali, Marathi, Telugu, Tamil.</p>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Language</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-primary">
              {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </label>

          <button onClick={() => analyzeMutation.mutate()} disabled={!description.trim() || analyzeMutation.isPending} className="w-full rounded-xl bg-primary py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50">
            {analyzeMutation.isPending ? "Analyzing with AI..." : "Analyze Issue"}
          </button>
          {analyzeMutation.isError && <p className="text-sm text-red-600">Analysis failed. Please try again.</p>}
        </div>
      </div>
    </div>
  );
}
