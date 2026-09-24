import React, { useState } from 'react';
import { Image, Sparkles, Filter, X, ZoomIn, Camera, Plus } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { GalleryItem } from '../../types';

export const GalleryPage: React.FC = () => {
  const { gallery, navigate } = useSchool();
  const [selectedYear, setSelectedYear] = useState<number | 'Semua'>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const years = ['Semua', 2026, 2025];
  const categories = ['Semua', 'Sains', 'Keagamaan', 'Olahraga', 'Belajar', 'Seni', 'Sosial'];

  const filtered = gallery.filter((item) => {
    const matchYear = selectedYear === 'Semua' || item.year === selectedYear;
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    return matchYear && matchCat;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Image size={14} className="text-emerald-600" />
            <span>Dokumentasi Visual Aktivitas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Galeri Kegiatan Santri MI RPI Jakarta
          </h1>
          <p className="text-sm text-slate-600">
            Rekam visual keceriaan belajar, ibadah berjamaah, uji sains, kejuaraan olahraga sunnah, dan ekspresi seni budaya.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('portal-admin', { tab: 'media' })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <Camera size={15} />
              <span>Kelola & Unggah Foto Kegiatan Baru (Admin)</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Year Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1">Tahun:</span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                  selectedYear === y
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === c
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ZoomIn size={28} />
                </div>
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {item.category} • {item.year}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
              <div className="relative h-80 sm:h-96 w-full">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActivePhoto(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {activePhoto.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{activePhoto.year}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{activePhoto.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{activePhoto.caption}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
