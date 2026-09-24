import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  Calendar,
  CreditCard,
  BookOpen,
  Award,
  HelpCircle,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { loginAsRole, settings, navigate, loginWithCredentials } = useSchool();
  const [activeTab, setActiveTab] = useState<'GURU' | 'ORANG_TUA' | 'SISWA' | 'ADMIN'>('GURU');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!identifier || !password) {
      setErrorMsg('Harap masukkan username/NIP/NISN dan kata sandi.');
      return;
    }
    const result = loginWithCredentials(identifier, password);
    if (!result.success) {
      setErrorMsg(result.message || 'Login gagal.');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-white rounded-2xl p-1 shadow-md border border-emerald-200 flex items-center justify-center">
            <img
              src={settings.logoUrl || '/images/logo-yayasan-rpi.svg'}
              alt="Logo Madrasah"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
            <Lock size={12} className="text-emerald-600" />
            <span>Single Sign-On (SSO) Ekosistem Digital MI RPI</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pusat Masuk Portal Madrasah
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Silakan pilih peran Anda sebagai <strong>Guru</strong>, <strong>Orang Tua</strong>, <strong>Siswa</strong>, atau <strong>Admin</strong> untuk mengakses dashboard layanan terpadu.
          </p>
        </div>

        {/* Main Card with Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-100/80 p-2 gap-1.5 border-b border-slate-200">
            {[
              { id: 'GURU', label: '👩‍🏫 Guru / Asatidz', sub: 'Input Nilai & Rapor' },
              { id: 'ORANG_TUA', label: '👨‍👩‍👧 Orang Tua / Wali', sub: 'Presensi & SPP' },
              { id: 'SISWA', label: '👦 Siswa / Santri', sub: 'LMS & Ujian CBT' },
              { id: 'ADMIN', label: '⚙️ Admin & Kamad', sub: 'Manajemen Sistem' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIdentifier('');
                  setPassword('');
                }}
                className={`py-3 px-3 rounded-2xl text-left transition flex flex-col justify-center ${
                  activeTab === tab.id
                    ? 'bg-white text-emerald-800 shadow-md font-bold'
                    : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                }`}
              >
                <span className="text-xs font-bold">{tab.label}</span>
                <span className="text-[10px] text-slate-400 mt-0.5">{tab.sub}</span>
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-10">
            {errorMsg && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-rose-800 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="font-bold text-rose-600 hover:text-rose-900 ml-4 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* ================= TAB 1: GURU ================= */}
            {activeTab === 'GURU' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Portal GTK & Asatidz
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Masuk sebagai Guru / Pendidik
                    </h3>
                    <p className="text-xs text-slate-500">
                      Gunakan NIP / Email terdaftar madrasah untuk masuk ke akun Anda.
                    </p>
                  </div>

                  <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        NIP / Email Guru *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 198804152014031002 atau ahmad.fauzi@mirpi.sch.id"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Kata Sandi / PIN *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 size={16} />
                      <span>Masuk ke Portal Guru</span>
                    </button>
                  </form>

                  {/* 1-Click Demo Login */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Atau Masuk Cepat (Akses Demonstrasi):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleQuickLogin('GURU')}
                        className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-emerald-900">Ustadz Ahmad Fauzi, S.Pd.I</p>
                          <p className="text-[10px] text-emerald-700">Wali Kelas 4A • Guru PAI</p>
                        </div>
                        <ArrowRight size={14} className="text-emerald-600" />
                      </button>

                      <button
                        onClick={() => handleQuickLogin('GURU')}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-slate-900">Ustadzah Siti Rahma, S.Pd.</p>
                          <p className="text-[10px] text-slate-500">Guru Sains & Robotika</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feature highlight card */}
                <div className="md:col-span-5 bg-gradient-to-br from-blue-900 to-slate-900 text-white p-6 rounded-3xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <GraduationCap size={22} className="text-amber-400" />
                  </div>
                  <h4 className="font-bold text-sm">Fasilitas di Portal Guru:</h4>
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Input Nilai Formatif & Sumatif Kurikulum Merdeka</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Cetak e-Rapor Kemenag Otomatis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Presensi Harian Santri & Poin Karakter 6 Dimensi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Generator Kisi-kisi Asesmen Otomatis</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ================= TAB 2: ORANG TUA ================= */}
            {activeTab === 'ORANG_TUA' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <span className="bg-teal-100 text-teal-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Portal Wali Murid
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Masuk sebagai Orang Tua / Wali Santri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pantau perkembangan putra-putri Anda, presensi kehadiran, e-Rapor, dan pembayaran SPP.
                    </p>
                  </div>

                  <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        NISN Santri atau Nomor WhatsApp Terdaftar *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 0092837190 atau 08123456789"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Kata Sandi / Tanggal Lahir Santri (DDMMYYYY) *
                      </label>
                      <input
                        type="password"
                        placeholder="Contoh: 15052014"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 size={16} />
                      <span>Masuk ke Portal Orang Tua</span>
                    </button>
                  </form>

                  {/* 1-Click Demo Login */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Atau Masuk Cepat (Akses Demonstrasi):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => handleQuickLogin('ORANG_TUA')}
                        className="p-3 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-left transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-teal-900">Ibu Fatimah Zahra, S.E.</p>
                          <p className="text-[10px] text-teal-700">Wali dari Muhammad Al Fatih (4A)</p>
                        </div>
                        <ArrowRight size={14} className="text-teal-600" />
                      </button>

                      <button
                        onClick={() => handleQuickLogin('ORANG_TUA')}
                        className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs text-slate-900">Bapak Hendra Pratama</p>
                          <p className="text-[10px] text-slate-500">Wali dari Aisyah Humaira (2B)</p>
                        </div>
                        <ArrowRight size={14} className="text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feature highlight card */}
                <div className="md:col-span-5 bg-gradient-to-br from-teal-900 to-emerald-950 text-white p-6 rounded-3xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users size={22} className="text-teal-300" />
                  </div>
                  <h4 className="font-bold text-sm">Fasilitas Portal Orang Tua:</h4>
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Notifikasi Presensi Masuk & Pulang Sekolah</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Lihat & Cetak e-Rapor Nilai Santri</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Bayar SPP Online via BSI / QRIS & Unduh Kuitansi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Jurnal Ibadah Shalat 5 Waktu & Mutaba'ah Tahfiz</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ================= TAB 3: SISWA ================= */}
            {activeTab === 'SISWA' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 space-y-6">
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Portal Santri
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      Masuk sebagai Siswa / Santri
                    </h3>
                    <p className="text-xs text-slate-500">
                      Akses jadwal pelajaran, tugas harian, ujian online CBT, dan perpustakaan digital.
                    </p>
                  </div>

                  <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">NISN Santri *</label>
                      <input
                        type="text"
                        placeholder="Contoh: 0092837190"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Kata Sandi *</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle2 size={16} />
                      <span>Masuk ke Portal Siswa</span>
                    </button>
                  </form>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleQuickLogin('SISWA')}
                      className="w-full p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs text-emerald-900">Masuk sebagai Muhammad Al Fatih</p>
                        <p className="text-[10px] text-emerald-700">Kelas 4A • Santri Teladan</p>
                      </div>
                      <ArrowRight size={14} className="text-emerald-600" />
                    </button>
                  </div>
                </div>

                <div className="md:col-span-5 bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-6 rounded-3xl space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <BookOpen size={22} className="text-emerald-300" />
                  </div>
                  <h4 className="font-bold text-sm">Fasilitas Portal Siswa:</h4>
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Jadwal Pelajaran Tematik & Keagamaan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Pengumpulan Tugas Online & Modul Digital</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Simulasi Ujian CBT Interaktif</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>E-Library & Peminjaman Buku Cerita Islami</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ================= TAB 4: ADMIN & KAMAD ================= */}
            {activeTab === 'ADMIN' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <div className="p-6 rounded-3xl border-2 border-emerald-500 bg-emerald-50/50 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      Administrator Sistem
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      Pusat Kendali Admin & Kelola Media
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Kelola logo sekolah, unggah foto banner & galeri kegiatan, verifikasi berkas pendaftaran santri baru (SPMB), dan respons suara warga madrasah.
                    </p>
                  </div>
                  <button
                    onClick={() => handleQuickLogin('ADMIN')}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Masuk ke Pusat Admin</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="p-6 rounded-3xl border border-purple-200 bg-purple-50/50 space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="bg-purple-200 text-purple-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      Pimpinan Madrasah
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      Dashboard Eksekutif Kepala Madrasah
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pantau ringkasan statistik kehadiran santri, grafik kelulusan tahfiz Al-Qur'an, rekapitulasi keuangan SPP, dan supervisi kinerja pendidik.
                    </p>
                  </div>
                  <button
                    onClick={() => handleQuickLogin('KEPALA_MADRASAH')}
                    className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Masuk sebagai Kepala Madrasah</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Card */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Akses terproteksi SSL dan enkripsi standar Kementerian Agama</span>
            </div>
            <button
              onClick={() => navigate('kontak')}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <HelpCircle size={14} />
              <span>Butuh Bantuan Akun? Hubungi Admin</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
