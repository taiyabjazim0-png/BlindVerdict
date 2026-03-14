import json
import os
import re
from typing import Any, Dict, List

import httpx


class AIService:
    def __init__(self) -> None:
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    async def _groq_chat(self, system: str, user_prompt: str, temperature: float = 0.3) -> str:
        if not self.api_key:
            return ""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temperature,
        }
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json=payload,
                )
                response.raise_for_status()
                return response.json()["choices"][0]["message"]["content"]
        except Exception:
            return ""

    def _extract_json(self, text: str) -> dict:
        try:
            match = re.search(r'\{[\s\S]*\}', text)
            if match:
                return json.loads(match.group())
        except (json.JSONDecodeError, AttributeError):
            pass
        return {}

    async def analyze_issue(self, description: str, language: str = "English") -> Dict[str, Any]:
        lang_note = f" The user's original language is {language}; the description may be transliterated." if language != "English" else ""
        system = (
            "You are an Indian legal expert. Analyze the legal issue and return ONLY valid JSON with these keys:\n"
            '- "legal_category": one of Criminal Law, Civil Litigation, Family Law, Property Law, Corporate Law, Labour Law, Taxation, General Advisory\n'
            '- "complexity": Low, Medium, or High\n'
            '- "lawyer_required": true or false\n'
            '- "steps": if lawyer_required is false, provide an array of 3-5 actionable steps the person can take themselves. If lawyer_required is true, set to null.\n'
            "Return ONLY the JSON object, no explanation."
        )
        prompt = f"Analyze this legal issue:{lang_note}\n\n{description}"
        llm_text = await self._groq_chat(system, prompt)

        parsed = self._extract_json(llm_text)
        if parsed and "legal_category" in parsed:
            return {
                "legal_category": parsed.get("legal_category", "General Advisory"),
                "complexity": parsed.get("complexity", "Medium"),
                "lawyer_required": bool(parsed.get("lawyer_required", True)),
                "steps": parsed.get("steps"),
            }

        desc_lower = description.lower()
        if any(w in desc_lower for w in ["divorce", "custody", "marriage", "domestic", "alimony"]):
            return {"legal_category": "Family Law", "complexity": "Medium", "lawyer_required": True, "steps": None}
        if any(w in desc_lower for w in ["property", "land", "tenant", "rent", "eviction"]):
            return {"legal_category": "Property Law", "complexity": "High", "lawyer_required": True, "steps": None}
        if any(w in desc_lower for w in ["murder", "theft", "assault", "fir", "bail", "arrest"]):
            return {"legal_category": "Criminal Law", "complexity": "High", "lawyer_required": True, "steps": None}
        if any(w in desc_lower for w in ["company", "startup", "contract", "compliance"]):
            return {"legal_category": "Corporate Law", "complexity": "Medium", "lawyer_required": True, "steps": None}
        if any(w in desc_lower for w in ["tax", "gst", "income tax"]):
            return {"legal_category": "Taxation", "complexity": "Medium", "lawyer_required": True, "steps": None}
        if any(w in desc_lower for w in ["labour", "employee", "wages", "termination", "workplace"]):
            return {"legal_category": "Labour Law", "complexity": "Medium", "lawyer_required": True, "steps": None}
        if any(w in desc_lower for w in ["licence", "license", "renewal", "passport", "ration card", "challan"]):
            return {
                "legal_category": "General Advisory",
                "complexity": "Low",
                "lawyer_required": False,
                "steps": [
                    "Gather relevant documents (ID proof, application form)",
                    "Visit the official government portal or nearest office",
                    "Submit the application with required fees",
                    "Track status online and collect the renewed document",
                ],
            }
        return {"legal_category": "Civil Litigation", "complexity": "Medium", "lawyer_required": True, "steps": None}

    async def summarize_and_categorize(self, file_name: str, content_hint: str) -> Dict[str, Any]:
        system = (
            "You are a legal document analyst. Given a document's name and partial content, return ONLY valid JSON with:\n"
            '- "summary": a 2-3 sentence summary of the document\n'
            '- "category": classify as one of: Identity Document, Court Order, Agreement/Contract, Evidence, Financial Record, Legal Notice, Affidavit, Medical Record, Police Report, Correspondence, Other\n'
            '- "tags": array of 3 relevant keyword tags\n'
            "Return ONLY the JSON."
        )
        prompt = f"Document: {file_name}\nContent preview:\n{content_hint[:1500]}"
        llm_text = await self._groq_chat(system, prompt)
        parsed = self._extract_json(llm_text)
        if parsed and "summary" in parsed:
            return {
                "summary": parsed["summary"][:500],
                "category": parsed.get("category", "Other"),
                "tags": parsed.get("tags", ["legal", "document", "uploaded"]),
            }
        return {
            "summary": f"{file_name} uploaded. Initial review indicates relevant legal content.",
            "category": "Other",
            "tags": ["uploaded", "legal", "review"],
        }

    async def generate_timeline(self, description: str) -> List[Dict[str, str]]:
        system = "Return ONLY a JSON array of 5 objects with keys: day, title, detail — for a legal case timeline."
        prompt = f"Create a timeline for this case: {description}"
        llm_text = await self._groq_chat(system, prompt)
        try:
            match = re.search(r'\[[\s\S]*\]', llm_text)
            if match:
                events = json.loads(match.group())
                if isinstance(events, list) and len(events) >= 3:
                    return events[:7]
        except (json.JSONDecodeError, AttributeError):
            pass
        return [
            {"day": "Day 1", "title": "Issue Intake", "detail": "Client case details submitted and recorded."},
            {"day": "Day 2", "title": "Legal Analysis", "detail": "AI categorizes the issue and scores complexity."},
            {"day": "Day 3", "title": "Lawyer Match", "detail": "Recommended specialists shared with client."},
            {"day": "Day 5", "title": "Case Acceptance", "detail": "Lawyer accepts and coordinator assigned."},
            {"day": "Day 7", "title": "Documentation", "detail": "Evidence uploaded and strategy draft prepared."},
        ]

    async def case_chat(self, question: str, case_description: str, doc_summaries: List[str], logs: List[str]) -> str:
        context_parts = [f"Case Description:\n{case_description}"]
        if doc_summaries:
            context_parts.append("Uploaded Documents:\n" + "\n".join(f"- {s}" for s in doc_summaries))
        if logs:
            context_parts.append("Activity Logs:\n" + "\n".join(f"- {l}" for l in logs[-20:]))
        context = "\n\n".join(context_parts)

        system = (
            "You are a legal research assistant for an Indian legal case. "
            "You have access to the case details, uploaded documents, and activity logs. "
            "Answer the user's question factually based on the available information. "
            "Do not pass judgement. Provide analysis and relevant legal context. "
            "If information is insufficient, say so clearly."
        )
        prompt = f"{context}\n\nQuestion: {question}"
        answer = await self._groq_chat(system, prompt, temperature=0.2)
        return answer or "I couldn't generate a response. Please ensure the Groq API key is configured."

    async def summarize_client_details(self, messages: List[str]) -> str:
        if not messages:
            return "No client details submitted yet."
        system = (
            "You are a legal assistant. Summarize the client's messages into a structured, bulleted sequence of events "
            "and key facts. Be concise and factual. Format with bullet points."
        )
        prompt = "Client messages:\n" + "\n".join(f"- {m}" for m in messages)
        result = await self._groq_chat(system, prompt)
        return result or "\n".join(f"• {m}" for m in messages)

    def search_documents(self, query: str, documents: List[Dict[str, str]]) -> List[Dict[str, str]]:
        q = query.lower().strip()
        if not q:
            return []
        ranked = []
        for doc in documents:
            haystack = f"{doc.get('summary', '')} {doc.get('tags', '')} {doc.get('category', '')}".lower()
            score = sum(1 for word in q.split() if word in haystack)
            if score > 0:
                ranked.append({
                    "file": doc.get("file_url", ""),
                    "excerpt": doc.get("summary", "Relevant legal excerpt found."),
                    "score": "High" if score >= 2 else "Medium",
                })
        ranked.sort(key=lambda x: x["score"], reverse=True)
        if ranked:
            return ranked
        return [{"file": "No direct match", "excerpt": "No high-confidence excerpt found.", "score": "Low"}]
