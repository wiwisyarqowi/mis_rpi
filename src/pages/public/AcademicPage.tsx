import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  Award,
  CheckCircle,
  FileText,
  Laptop,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const AcademicPage: React.FC = () => {
  const { schedules, materials } = useSchool();
  const [activeDay, setActiveDay] = useState<'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat'>('Senin');

  const dimensions = [
    { title: 'Beriman & Bertaqwa kepada Allah SWT', desc: 'Memiliki akidah salimah, gemar beribadah fardhu & sunnah, serta mencintai Rasulullah SAW.' },
    { title: 'Berakhlak Mulia & Beradab', desc: 'Menerapkan 5S (Senyum, Salam, Sapa, Sopan, Santun) dan berbakti kepada orang tua serta guru.' },
    { title: 'Bernalar Kritis & Literat', desc: 'Mampu menganalisis masalah, gemar membaca buku, dan memiliki daya logika yang terstruktur.' },
    { title: 'Kreatif & Inovatif', desc: 'Menghasilkan ide orisinal dalam proyek sains sederhana, seni Islami, dan koding anak.' },
    { title: 'Bergotong Royong & Peduli', desc: 'Memiliki kepekaan sosial, empati kepada sesama teman, dan aktif dalam aksi sedekah berkah.' },
    { title: 'Mandiri & Tangguh', desc: 'Mampu mengurus perlengkapan pribadi, disiplin waktu belajar, dan pantang menyerah.' },
    { title: 'Berkebinekaan Global & Toleran', desc: 'Menghormati keragaman budaya bangsa dalam bingkai Islam Rahmatan Lil \'Alamin.' },
    { title: 'Cakap Digital & Beretika', desc: 'Menggunakan teknologi informasi secara produktif, bijak, dan aman dari pengaruh negatif.' },
  ];

  const subjects = [
    { category: 'Pendidikan Agama Islam (Kemenag)', items: ['Al-Qur\'an Hadits', 'Akidah Akhlak', 'Fikih Ibadah', 'Sejarah Kebudayaan Islam (SKI)', 'Bahasa Arab', 'Tahsin & Tahfiz Juz 30-29'] },
    { category: 'Mata Pelajaran Umum (Kemendikbudristek)', items: ['Pendidikan Pancasila', 'Bahasa Indonesia', 'Matematika Terpadu', 'IPAS (Ilmu Pengetahuan Alam & Sosial)', 'Seni Rupa & Budaya', 'Pendidikan Jasmani & Olahraga'] },
    { category: 'Muatan Lokal & Digital Unggulan RPI', items: ['Informatika & Logika Koding Cilik (Scratch)', 'Pramuka Siaga/Penggalang', 'Bahasa Inggris Dasar', 'Khat Kaligrafi Arab'] },
  ];

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
                key={idx}
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

        {/* Mata Pelajaran Terpadu */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers size={20} className="text-emerald-700" />
            <span>Mata Pelajaran & Beban Belajar</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((sub, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <h3 className="font-bold text-sm text-emerald-800 pb-2 border-b border-slate-200">
                  {sub.category}
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  {sub.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ChevronRight size={13} className="text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Pelajaran Interaktif */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Clock size={20} className="text-emerald-700" />
                <span>Simulasi Jadwal KBM Harian (Kelas 4A)</span>
              </h2>
              <p className="text-xs text-slate-500">Jadwal pembelajaran aktif seimbang antara sains, agama, dan istirahat</p>
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const).map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeDay === day
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Guru Pengampu</th>
                  <th className="py-3 px-4">Ruang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schedules
                  .filter((s) => s.day === activeDay)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{item.time}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.subject}</td>
                      <td className="py-3.5 px-4 text-slate-600">{item.teacherName}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md text-[11px]">
                          {item.room}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
