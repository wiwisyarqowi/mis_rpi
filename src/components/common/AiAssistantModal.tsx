import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  BrainCircuit,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AiAssistantModal: React.FC = () => {
  const { settings, navigate } = useSchool();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Assalamu'alaikum Warahmatullahi Wabarakatuh! 🌿
Saya adalah RPI Smart Assistant, asisten virtual resmi Madrasah Ibtidaiyah RPI Jakarta. 
Ada yang bisa saya bantu terkait SPMB 2027/2028, 15 Program Unggulan, kurikulum madrasah, atau jadwal kegiatan?`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Apa saja syarat pendaftaran SPMB 2027/2028?',
    'Di mana lokasi resmi MI RPI Jakarta?',
    'Apa saja 15 program unggulan madrasah?',
    'Bagaimana kurikulum pembelajaran digital & sains di sini?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        'Assalamu\'alaikum. Terima kasih atas pertanyaan Anda. Untuk informasi detail lebih lanjut silakan hubungi admin MI RPI Jakarta via menu Kontak.';

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: `Assalamu'alaikum. Mohon maaf, koneksi asisten sedang mengalami gangguan singkat. Anda dapat menemukan informasi resmi di menu Profil atau menghubungi kami via WhatsApp di pojok kanan bawah.`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button on bottom left */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center group">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center gap-2.5 shadow-xl shadow-emerald-900/30 hover:scale-105 active:scale-95 transition duration-200 border border-emerald-500/30 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
          aria-label="Buka RPI Smart Assistant"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-emerald-200">
            <BrainCircuit size={18} className="animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider leading-none">AI Smart School</p>
            <p className="text-xs font-bold leading-tight">Tanya RPI Assistant</p>
          </div>
        </button>
      </div>

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-start sm:p-6 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full sm:w-[420px] h-[85vh] sm:h-[600px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-emerald-100 animate-in fade-in slide-in-from-bottom-6 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-400/40 flex items-center justify-center text-amber-300 shadow-inner">
                  <Bot size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm">RPI Smart Assistant</h3>
                    <span className="bg-emerald-500/30 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                      Thinking AI
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200">Layanan Informasi Terpadu MI RPI Jakarta</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* AI Capability Note */}
            <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600" />
                Data resmi terverifikasi madrasah
              </span>
              <span className="text-[10px] font-semibold text-emerald-600">Model: Gemini 3.1 Pro (High Thinking)</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((msg) => {
                const isBot = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                      {isBot && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                          RPI
                        </div>
                      )}
                      <div>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                            isBot
                              ? 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-tl-none'
                              : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 rounded-tr-none font-medium'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className={`text-[10px] text-slate-400 mt-1 block px-1 ${isBot ? 'text-left' : 'text-right'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs shadow-xs">
                      RPI
                    </div>
                    <div className="p-3 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500 animate-spin" />
                      <span className="text-xs text-slate-500 italic">RPI Assistant sedang berpikir mendalam...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Question Chips */}
            <div className="p-2.5 bg-white border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">Pertanyaan Cepat:</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={loading}
                    className="text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full whitespace-nowrap border border-emerald-200 transition shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Ketik pertanyaan seputar MI RPI..."
                disabled={loading}
                className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center transition shrink-0 shadow-md shadow-emerald-600/20"
                aria-label="Kirim Pesan"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
