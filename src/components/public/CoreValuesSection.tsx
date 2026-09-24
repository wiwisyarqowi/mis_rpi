import React, { useState } from 'react';
import {
  HeartHandshake,
  BookOpen,
  BookMarked,
  Microscope,
  Laptop,
  Compass,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { initialCoreValues } from '../../data/initialData';

export const CoreValuesSection: React.FC = () => {
  const [activeValue, setActiveValue] = useState<number>(1);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake':
        return <HeartHandshake size={28} />;
      case 'BookOpen':
        return <BookOpen size={28} />;
      case 'BookMarked':
        return <BookMarked size={28} />;
      case 'Microscope':
        return <Microscope size={28} />;
      case 'Laptop':
        return <Laptop size={28} />;
      case 'Compass':
      default:
        return <Compass size={28} />;
    }
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden border-b border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-2xs">
            <Sparkles size={14} className="text-amber-500" />
            <span>Karakter & Nilai Luhur MI RPI</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Akhlak Mulia & Menguasai Teknologi Digital
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Enam pilar pembentukan karakter santri MI RPI Jakarta yang menyeimbangkan kecerdasan spiritual, intelektual, dan ketangkasan digital.
          </p>
        </div>

        {/* 6 Interactive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialCoreValues.map((val) => {
            const isSelected = activeValue === val.id;
            return (
              <div
                key={val.id}
                onClick={() => setActiveValue(val.id)}
                className={`cursor-pointer rounded-3xl p-7 transition-all duration-300 border ${
                  isSelected
                    ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-700/10 ring-2 ring-emerald-500/20 translate-y--1'
                    : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-200 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {getIcon(val.icon)}
                  </div>
                  <span className="text-xs font-serif font-bold text-slate-400 font-arabic text-sm">
                    {val.arabic}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center">
                      {val.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isSelected ? 'Pilar Aktif' : 'Klik untuk fokus'}
                  </span>
                  <ArrowRight
                    size={14}
                    className={`transition-transform duration-200 ${
                      isSelected ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
