import { useState } from "react";

export function ChatPanel() {
  const [messages, setMessages] = useState<string[]>([
    "Coordinator: We will contact you shortly to help finalize the case details.",
  ]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, `You: ${text}`, "Assistant: Message received."]);
    setText("");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">Case Chat</h4>
      <div className="mb-3 h-40 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3 text-sm">
        {messages.map((m, i) => (
          <p key={i} className="text-slate-700">
            {m}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
        />
        <button onClick={send} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white">
          Send
        </button>
      </div>
    </div>
  );
}
