/// <reference types="vite/client" />

interface Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  onresult: (e: { results: SpeechRecognitionResultList }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}
