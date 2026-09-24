import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Compass,
  BookOpenCheck,
  Library,
  Atom,
  Code2,
  Palette,
  Target,
  Swords,
  Flame,
  Music2,
  SunMedium,
  Users,
  Lightbulb,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { initialPrograms } from '../../data/initialData';

export const ProgramsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('Semua');

  const categories = ['Semua', 'Pendidikan Karakter', 'Keagamaan Unggulan', 'Akademik & Literasi', 'Sains & Riset', 'Teknologi Informasi', 'Olahraga Sunnah', 'Seni & Budaya', 'Kurikulum Merdeka'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck size={28} />;
      case 'Sparkles': return <Sparkles size={28} />;
      case 'Compass': return <Compass size={28} />;
      case 'BookOpenCheck': return <BookOpenCheck size={28} />;
      case 'Library': return <Library size={28} />;
      case 'Atom': return <Atom size={28} />;
      case 'Code2': return <Code2 size={28} />;
      case 'Palette': return <Palette size={28} />;
      case 'Target': return <Target size={28} />;
      case 'Swords': return <Swords size={28} />;
      case 'Flame': return <Flame size={28} />;
      case 'Music2': return <Music2 size={28} />;
      case 'SunMedium': return <SunMedium size={28} />;
      case 'Users': return <Users size={28} />;
      case 'Lightbulb':
      default:
        return <Lightbulb size={28} />;
    }
  };

  const filtered = initialPrograms.filter((prog) => {
    const matchesCat = selectedCat === 'Semua' || prog.category.toLowerCase().includes(selectedCat.toLowerCase());
    const matchesSearch =
      prog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Sparkles size={14} className="text-emerald-600" />
            <span>15 Program Unggulan MI RPI Jakarta</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pilar Keunggulan Siswa Madrasah
          </h1>
          <p className="text-sm text-slate-600">
            Seluruh program dirancang sistematis untuk menyeimbangkan adab islami, kesehatan mental (SEL), wawasan sains, penguasaan bahasa, dan kecakapan komputasi.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCat === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari program unggulan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* 15 Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800 flex items-center justify-center shadow-xs">
                    {getIcon(prog.icon)}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {prog.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {prog.id}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">{prog.name}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">{prog.description}</p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">🎯 Tujuan:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{prog.objective}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">📸 Dokumentasi & Aktivitas:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{prog.documentation}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-[11px]">📈 Indikator Keberhasilan (KPI):</span>
                  <p className="text-emerald-700 font-medium text-[11px] mt-0.5">{prog.kpi}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
