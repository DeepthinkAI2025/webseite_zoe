import React, { useEffect, useRef, useState } from 'react';
import { X, Send, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SupportChatDrawer() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hallo! Ich bin Ihr ZOE Support. Wie kann ich helfen? (Technik, Angebot, Förderung, Termine …)' }
  ]);
  const [text, setText] = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener('open-support-chat', onOpen);
    window.addEventListener('close-support-chat', onClose);
    return () => {
      window.removeEventListener('open-support-chat', onOpen);
      window.removeEventListener('close-support-chat', onClose);
    };
  }, []);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const msg = text.trim();
    if (!msg) return;
    setText('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    try {
      const endpoint = import.meta.env.VITE_CHAT_ENDPOINT || '/api/chat';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: msg }] })
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data?.reply || 'Ich habe Ihre Anfrage verstanden. Möchten Sie mit unserer KI telefonieren oder ein Angebot erhalten?';
        setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: 'Danke! Ich melde mich umgehend. Alternativ können Sie direkt anrufen.' }]);
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Netzwerkproblem – bitte später erneut versuchen oder anrufen.' }]);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog" aria-label="Support-Chat">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div ref={panelRef} className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col">
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
      <div className="font-semibold text-gray-900 text-base sm:text-lg">Support-Chat</div>
      <div className="text-xs sm:text-sm text-gray-500">Gemini LLM über sicheren Proxy</div>
          </div>
          <button aria-label="Schließen" className="p-2 rounded hover:bg-gray-100" onClick={() => setOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

  <div className="flex-1 overflow-y-auto p-4 space-y-3 text-base sm:text-lg" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
              {m.content}
            </div>
          ))}
        </div>

  <div className="p-3 border-t border-gray-200 space-y-2 text-base sm:text-lg">
          <form onSubmit={sendMessage} className="flex items-center gap-2">
            <Input
              aria-label="Nachricht eingeben"
              placeholder="Frage eingeben…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" aria-label="Senden">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={() => (window.location.href = 'tel:+498009999999')}
          >
            <PhoneCall className="w-4 h-4 mr-2" /> Mit KI‑VoIP sprechen
          </Button>
        </div>
      </div>
    </div>
  );
}
