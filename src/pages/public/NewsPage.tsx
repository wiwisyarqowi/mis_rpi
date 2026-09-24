import React, { useState } from 'react';
import { Newspaper, Calendar, User, Tag, Share2, ArrowLeft, Search } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { NewsItem } from '../../types';

export const NewsPage: React.FC = () => {
  const { news, viewParams, navigate } = useSchool();
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  // Check if viewing a specific article
  const currentSlug = viewParams?.slug;
  const activeArticle: NewsItem | undefined = currentSlug
    ? news.find((n) => n.slug === currentSlug)
    : undefined;

  const categories = ['Semua', 'Berita Madrasah', 'Kegiatan Siswa', 'Kegiatan Keislaman', 'Prestasi', 'Pengumuman'];

  const filteredNews = news.filter((n) => {
    const matchCat = activeCategory === 'Semua' || n.category === activeCategory;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      const waUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${window.location.href}`)}`;
      window.open(waUrl, '_blank');
    }
  };

  if (activeArticle) {
    return (
      <div className="bg-slate-50 min-h-screen py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <button
            onClick={() => navigate('berita')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 transition bg-white px-4 py-2 rounded-xl border shadow-xs"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Indeks Berita</span>
          </button>

          <article className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="h-72 sm:h-96 w-full overflow-hidden relative">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                {activeArticle.category}
              </span>
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 text-xs text-slate-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {activeArticle.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User size={14} />
                    {activeArticle.author}
                  </span>
                </div>

                <button
                  onClick={() => handleShare(activeArticle.title)}
                  className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold"
                >
                  <Share2 size={14} />
                  <span>Bagikan</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {activeArticle.title}
              </h1>

              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
                <p className="font-semibold text-slate-800 italic border-l-4 border-emerald-500 pl-4 py-1">
                  {activeArticle.summary}
                </p>
                <p>{activeArticle.content}</p>
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
                {activeArticle.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Newspaper size={14} className="text-emerald-600" />
            <span>Warta Madrasah & Informasi Publik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kabar & Dokumentasi MI RPI Jakarta
          </h1>
          <p className="text-sm text-slate-600">
            Ikuti informasi terkini seputar dinamika belajar, pembiasaan karakter, prestasi santri, dan pengumuman resmi madrasah.
          </p>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  activeCategory === c
                    ? 'bg-emerald-600 text-white shadow-xs'
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
              placeholder="Cari warta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate('berita', { slug: item.slug })}
              className="cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {item.category}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-[11px] text-slate-400 font-semibold mb-2">{item.date} • {item.author}</p>
                  <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 text-xs font-bold text-emerald-700 flex items-center justify-between">
                <span>Baca Lengkap →</span>
                <span className="text-slate-300 text-[10px]">MI RPI Media</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
