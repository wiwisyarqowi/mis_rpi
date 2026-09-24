import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
  Calendar,
  Newspaper,
  CheckCircle2,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { HeroSection } from '../../components/public/HeroSection';
import { DataStatsSection } from '../../components/public/DataStatsSection';
import { CoreValuesSection } from '../../components/public/CoreValuesSection';
import { ProgramsPreviewSection } from '../../components/public/ProgramsPreviewSection';
import { MapSection } from '../../components/public/MapSection';
import { FaqSection } from '../../components/public/FaqSection';
import { useSchool } from '../../context/SchoolContext';

export const HomePage: React.FC = () => {
  const { settings, news, achievements, events, navigate, currentUser } = useSchool();

  const handlePortalClick = (role: 'GURU' | 'ORANG_TUA' | 'SISWA') => {
    if (currentUser) {
      if (role === 'GURU' && (currentUser.role === 'GURU' || currentUser.role === 'WALI_KELAS')) {
        navigate('portal-guru');
        return;
      }
      if (role === 'ORANG_TUA' && currentUser.role === 'ORANG_TUA') {
        navigate('portal-ortu');
        return;
      }
      if (role === 'SISWA' && currentUser.role === 'SISWA') {
        navigate('portal-siswa');
        return;
      }
    }
    navigate('login', { role });
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Statistic Data Section */}
      <DataStatsSection />

      {/* 3. Core Values */}
      <CoreValuesSection />

      {/* 4. Visi & Misi Highlight Section (Besar & Elegan) */}
      <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white relative overflow-hidden">
        {/* Subtle geometric overlay */}
        <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-4 py-1 rounded-full text-xs font-bold mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <span>Visi Utama Madrasah</span>
          </div>

          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-serif italic font-normal text-emerald-50 leading-relaxed max-w-4xl mx-auto">
            "{settings.vision}"
          </blockquote>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1.5 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-700/50">
              <CheckCircle2 size={14} className="text-amber-400" />
              Kurikulum Merdeka Kemenag
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-700/50">
              <CheckCircle2 size={14} className="text-amber-400" />
              Social Emotional Learning (SEL)
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-700/50">
              <CheckCircle2 size={14} className="text-amber-400" />
              Literasi Digital & Koding
            </span>
          </div>

          <div className="mt-10">
            <button
              onClick={() => navigate('profil')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition duration-200 inline-flex items-center gap-2"
            >
              <span>Pelajari Profil Lengkap & Misi</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. 15 Programs Preview */}
      <ProgramsPreviewSection />

      {/* 5.5 Pintu Masuk Portal Mandiri Terpadu (Guru, Orang Tua, Siswa) */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Layanan Portal Mandiri Madrasah
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Akses Guru, Orang Tua, & Santri
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Satu klik untuk masuk ke dashboard digital terpadu MI RPI Jakarta sesuai peran Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Portal Guru */}
            <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 p-6 rounded-3xl transition duration-300 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  👩‍🏫
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                    Portal Guru & Asatidz
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Input nilai formatif & sumatif e-Rapor Kemenag, presensi santri, poin karakter, serta bank asesmen otomatis.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> e-Rapor Kurikulum Merdeka
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> Presensi Kelas Realtime
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> Bank Soal & Asesmen
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handlePortalClick('GURU')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk Portal Guru</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 2: Portal Orang Tua */}
            <div className="bg-slate-800/90 hover:bg-slate-800 border-2 border-emerald-500/80 p-6 rounded-3xl transition duration-300 flex flex-col justify-between space-y-6 group relative shadow-xl shadow-emerald-950/50">
              <span className="absolute -top-3 left-6 bg-amber-400 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Akses Wali Santri
              </span>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  👨‍👩‍👧
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                    Portal Orang Tua (Wali)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Pantau kehadiran santri realtime, unduh e-Rapor resmi, bayar SPP online (BSI/QRIS), dan mutaba'ah ibadah.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">✓</span> Notifikasi Kehadiran Anak
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">✓</span> Bayar SPP Online via BSI
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">✓</span> Lihat Transkrip Nilai e-Rapor
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handlePortalClick('ORANG_TUA')}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk Portal Orang Tua</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 3: Portal Siswa */}
            <div className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500 p-6 rounded-3xl transition duration-300 flex flex-col justify-between space-y-6 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  👦
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">
                    Portal Siswa & Santri
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Jadwal pelajaran harian, tugas digital, simulasi ujian CBT online, dan e-library perpustakaan madrasah.
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> Jadwal Pelajaran Digital
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> Simulasi Ujian CBT Interaktif
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> E-Library Perpustakaan
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handlePortalClick('SISWA')}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Masuk Portal Siswa</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('login')}
              className="text-xs text-emerald-300 hover:text-white font-bold inline-flex items-center gap-1.5 underline decoration-emerald-500/50"
            >
              <span>Lihat Halaman Masuk Portal Lengkap & Bantuan Akun</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. SPMB Banner Highlight */}
      <section className="py-14 bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <span>⚠️ Tempat Terbatas — TP 2027/2028</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Penerimaan Murid Baru (SPMB) MI RPI Jakarta
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-2xl">
              Daftarkan putra-putri tercinta untuk merasakan pengalaman belajar ramah anak dengan bimbingan tahfiz bersanad dan sains digital.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('spmb')}
              className="px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-2xl shadow-xl transition"
            >
              Daftar Online Sekarang
            </button>
            <button
              onClick={() => navigate('kontak')}
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl backdrop-blur-xs transition border border-white/30"
            >
              Konsultasi Panitia SPMB
            </button>
          </div>
        </div>
      </section>

      {/* 7. Berita Terkini & Prestasi */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Berita Madrasah */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Warta & Kegiatan Madrasah
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Informasi terbaru seputar dinamika MI RPI Jakarta</p>
                </div>
                <button
                  onClick={() => navigate('berita')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Semua Berita</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {news.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate('berita', { slug: item.slug })}
                    className="cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 overflow-hidden relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] text-slate-400 font-semibold mb-2">{item.date} • {item.author}</p>
                        <h4 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-1 text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Hall of Fame Prestasi */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Prestasi Terbaru
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Kebanggaan santri MI RPI</p>
                </div>
                <button
                  onClick={() => navigate('prestasi')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Hall of Fame
                </button>
              </div>

              <div className="space-y-3">
                {achievements.slice(0, 3).map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Trophy size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          {ach.rank}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{ach.year}</span>
                      </div>
                      <h5 className="font-bold text-xs text-slate-900 mt-1 truncate">{ach.title}</h5>
                      <p className="text-[11px] text-slate-500 truncate">{ach.studentName} ({ach.className})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Map & Lokasi */}
      <MapSection />

      {/* 9. FAQ Section */}
      <FaqSection />
    </div>
  );
};
