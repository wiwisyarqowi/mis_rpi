import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSchool();

  const handleOpenWhatsApp = () => {
    const rawNumber = settings.whatsapp || '6281234567890';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent("Assalamu'alaikum, saya ingin mendapatkan informasi tentang MI RPI Jakarta.");
    const url = `https://wa.me/${cleanNumber}?text=${message}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      <div className="hidden sm:block mr-3 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat WhatsApp Resmi MI RPI
      </div>
      <button
        onClick={handleOpenWhatsApp}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/35 hover:scale-110 active:scale-95 transition duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Hubungi WhatsApp MI RPI Jakarta"
      >
        <MessageCircle size={28} className="fill-white/20 stroke-white" />
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>
      </button>
    </div>
  );
};
