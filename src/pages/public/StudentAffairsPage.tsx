import React from 'react';
import { Sparkles, HeartHandshake, ShieldCheck, SunMedium, Compass, Award } from 'lucide-react';

export const StudentAffairsPage: React.FC = () => {
  const habits = [
    { title: 'Sambut Senyum Santri Pagi', desc: 'Guru menyambut murid di gerbang madrasah dengan senyum, sapa, dan doa keberkahan.', time: '06.30 - 07.00 WIB' },
    { title: 'Shalat Dhuha Berjamaah & Zikir', desc: 'Membiasakan shalat sunnah Dhuha 4 rakaat dilanjutkan doa pembuka pintu rezeki ilmu.', time: '07.00 - 07.30 WIB' },
    { title: 'Halaqah Tahsin & Tahfiz Quran', desc: 'Bimbingan intensif makharijul huruf dan setoran hafalan mutqin Juz 30/29.', time: '07.30 - 08.00 WIB' },
    { title: 'Shalat Dzuhur Berjamaah', desc: 'Membina adab shaf shalat berjamaah, muadzin cilik, dan kultum santri.', time: '12.00 - 12.45 WIB' },
    { title: 'Makan Siang Beradab & Gotong Royong', desc: 'Makan bersama dengan adab Rasulullah (tangan kanan, duduk, tidak bersisa) dan membersihkan meja.', time: '12.45 - 13.15 WIB' },
  ];

  const excur = [
    { name: 'Klub Robotik & Coding Scratch', category: 'Teknologi', icon: '🤖', desc: 'Membangun logika komputasi anak dengan membuat game Islami dan robot sederhana.' },
    { name: 'Panahan Sunnah (Archery)', category: 'Olahraga', icon: '🏹', desc: 'Melatih konsentrasi, ketenangan emosi, dan ketepatan fokus bidikan.' },
    { name: 'Pencak Silat Tradisi', category: 'Bela Diri', icon: '🥋', desc: 'Membina ketangkasan gerak, perlindungan diri, dan sportivitas ksatria.' },
    { name: 'Seni Hadrah & Marawis', category: 'Seni Religi', icon: '🥁', desc: 'Menghidupkan mahabbah shalawat Nabi dengan alunan tabuhan rebana harmonis.' },
    { name: 'Tari Saman Nusantara', category: 'Seni Tradisi', icon: '🪕', desc: 'Melatih kedisiplinan gerak sinkron cepat dan syair zikir puji-pujian.' },
    { name: 'Pramuka Siaga & Penggalang', category: 'Kepanduan', icon: '⚜️', desc: 'Keterampilan survival, simpul tali, kemandirian, dan bakti peduli sesama.' },
    { name: 'Klub Sains Cilik (STEM)', category: 'Sains', icon: '🔬', desc: 'Eksperimen alam, roket air, eko-enzim, dan observasi botani madrasah.' },
    { name: 'Kaligrafi Arab & Desain', category: 'Seni Rupa', icon: '✒️', desc: 'Menulis indah khat Naskhi dan Riq\'ah serta ornamen geometri Islami.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <HeartHandshake size={14} className="text-emerald-600" />
            <span>Kesiswaan & Pembiasaan Karakter</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tumbuh Ceria, Santun, dan Berprestasi
          </h1>
          <p className="text-sm text-slate-600">
            Ekosistem kesiswaan yang ramah anak, bebas perundungan (anti-bullying), dan kaya ruang eksplorasi bakat minat santri.
          </p>
        </div>

        {/* Pembiasaan Harian */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <SunMedium size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pembiasaan Adab & Ibadah Harian</h2>
              <p className="text-xs text-slate-500">Rangkaian rutinitas harian yang membentuk kesadaran spiritual tanpa paksaan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            {habits.map((h, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  {h.time}
                </span>
                <h4 className="font-bold text-sm text-slate-900 pt-1">{h.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ekstrakurikuler */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Compass size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Ekstrakurikuler Pilihan</h2>
              <p className="text-xs text-slate-500">Wadah aktualisasi minat, bakat, kepemimpinan, dan sportivitas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            {excur.map((ex, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition">
                <span className="text-3xl mb-2 block">{ex.icon}</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  {ex.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-2 mb-1">{ex.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
