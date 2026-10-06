import React from 'react';
import {
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { initialDimensions } from '../../data/initialData';

export const AcademicPage: React.FC = () => {
  const { dimensions: ctxDimensions } = useSchool();

  const dimensions = ctxDimensions && ctxDimensions.length > 0 ? ctxDimensions : initialDimensions;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <BookOpen size={14} className="text-emerald-600" />
            <span>Struktur Kurikulum & Akademik</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Kurikulum Merdeka Terintegrasi Keislaman & Digital
          </h1>
          <p className="text-sm text-slate-600">
            Menggabungkan kedalaman kurikulum keagamaan Kementerian Agama RI dengan Kurikulum Merdeka Nasional, diperkaya literasi koding dan pembiasaan adab Qurani.
          </p>
        </div>

        {/* 8 Dimensi Profil Lulusan */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Capaian Perkembangan Anak
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
              8 Dimensi Profil Lulusan Santri MI RPI
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Standar kompetensi holistik yang dicapai peserta didik setelah menyelesaikan jenjang 6 tahun pendidikan di MI RPI Jakarta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
            {dimensions.map((dim, idx) => (
              <div
                key={dim.id || idx}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div>
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mb-1.5">{dim.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{dim.desc}</p>
                </div>
                <div className="mt-4 pt-2 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle size={12} />
                  <span>Kompetensi Inti</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pendekatan Belajar & Karakter Keislaman */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-lg space-y-6">
          <div className="max-w-2xl">
            <span className="bg-emerald-800 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Metodologi Pembelajaran
            </span>
            <h3 className="text-2xl font-black mt-2">
              Pendekatan Terpadu: Agama, Nalar Kritis & Digital
            </h3>
            <p className="text-xs text-emerald-100/80 mt-1">
              Setiap capaian kurikulum dikontekstualisasikan dengan adab Qurani dan pemanfaatan teknologi secara berimbang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-2xl block">📖</span>
              <h4 className="font-bold text-sm text-white">Pembelajaran Berdiferensiasi</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Menyesuaikan kecepatan dan gaya belajar setiap anak melalui bimbingan personal guru dan asesmen berkala.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-2xl block">💡</span>
              <h4 className="font-bold text-sm text-white">Proyek Kolaboratif (P5-PPRA)</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Penguatan Profil Pelajar Pancasila dan Rahmatan Lil Alamin melalui karya nyata sosial, sains, dan kebaikan lingkungan.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 border border-white/10 space-y-2">
              <span className="text-2xl block">🛡️</span>
              <h4 className="font-bold text-sm text-white">Ekosistem Ramah Anak</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                Lingkungan kelas yang aman emosional, bebas perundungan, dan menumbuhkan rasa percaya diri santri.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
