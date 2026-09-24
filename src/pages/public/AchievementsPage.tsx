import React, { useState } from 'react';
import { Trophy, Award, Sparkles, Medal, Search } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const AchievementsPage: React.FC = () => {
  const { achievements } = useSchool();
  const [filterCat, setFilterCat] = useState('Semua');
  const [search, setSearch] = useState('');

  const categories = ['Semua', 'Akademik', 'Keagamaan', 'Teknologi', 'Olahraga', 'Seni'];

  const filtered = achievements.filter((a) => {
    const matchesCat = filterCat === 'Semua' || a.category.toLowerCase() === filterCat.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.studentName.toLowerCase().includes(search.toLowerCase()) ||
      a.competition.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Trophy size={14} className="text-amber-600" />
            <span>Hall of Fame & Prestasi Siswa</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Prestasi Membanggakan MI RPI Jakarta
          </h1>
          <p className="text-sm text-slate-600">
            Apresiasi dedikasi santri dan pembina dalam berbagai kejuaraan sains, musabaqah tahfiz, kompetisi robotika, seni tradisi, dan kejuaraan olahraga.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  filterCat === c
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari prestasi / nama santri..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Grid of achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Medal size={24} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                    {item.category}
                  </span>
                </div>

                <div className="inline-block bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-md mb-2">
                  {item.rank}
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug mb-2">
                  {item.title}
                </h3>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p>👤 Santri: <strong className="text-slate-900">{item.studentName}</strong> ({item.className})</p>
                <p>🏛️ Ajang: <span>{item.competition}</span></p>
                <p className="text-[11px] text-slate-400">Penyelenggara: {item.organizer} • {item.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
