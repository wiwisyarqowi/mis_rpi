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
  ArrowRight,
} from 'lucide-react';
import { initialPrograms } from '../../data/initialData';
import { useSchool } from '../../context/SchoolContext';

export const ProgramsPreviewSection: React.FC = () => {
  const { navigate } = useSchool();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Pendidikan Karakter', 'Keagamaan Unggulan', 'Sains & Riset', 'Olahraga Sunnah', 'Kurikulum Merdeka'];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck size={22} />;
      case 'Sparkles': return <Sparkles size={22} />;
      case 'Compass': return <Compass size={22} />;
      case 'BookOpenCheck': return <BookOpenCheck size={22} />;
      case 'Library': return <Library size={22} />;
      case 'Atom': return <Atom size={22} />;
      case 'Code2': return <Code2 size={22} />;
      case 'Palette': return <Palette size={22} />;
      case 'Target': return <Target size={22} />;
      case 'Swords': return <Swords size={22} />;
      case 'Flame': return <Flame size={22} />;
      case 'Music2': return <Music2 size={22} />;
      case 'SunMedium': return <SunMedium size={22} />;
      case 'Users': return <Users size={22} />;
      case 'Lightbulb':
      default:
        return <Lightbulb size={22} />;
    }
  };

  const filteredPrograms = selectedCategory === 'Semua'
    ? initialPrograms.slice(0, 6)
    : initialPrograms.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase())).slice(0, 6);

  return (
    <section className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
              <Sparkles size={14} className="text-amber-500" />
              <span>15 Program Unggulan Terpadu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mendidik Potensi Fitrah & Kecakapan Masa Depan
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Kurikulum terpadu yang memfasilitasi setiap anak tumbuh dengan karakter ramah, berakhlak mulia, cerdas dalam sains, dan fasih Al-Qur'an.
            </p>
          </div>

          <button
            onClick={() => navigate('program-unggulan')}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl border border-emerald-200 transition shrink-0"
          >
            <span>Lihat Semua 15 Program</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog) => (
            <div
              key={prog.id}
              className="bg-slate-50 hover:bg-white p-6 rounded-3xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    {getIcon(prog.icon)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-100">
                    {prog.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{prog.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{prog.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 text-[11px] text-slate-500">
                <p><strong className="text-slate-700">Tujuan:</strong> {prog.objective}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
