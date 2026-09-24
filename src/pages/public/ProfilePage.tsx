import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Building,
  Users,
  Target,
  FileText,
  CheckCircle,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const ProfilePage: React.FC = () => {
  const { settings, teachers, gallery } = useSchool();
  const [activeTab, setActiveTab] = useState<'profil' | 'gtk' | 'sarpras' | 'legalitas'>('profil');

  const facilities = [
    { title: 'Laboratorium Komputer & Koding', desc: 'Dilengkapi PC modern, jaringan internet serat optik aman anak, dan kit robotika Scratch.', icon: '💻' },
    { title: 'Musholla Madrasah Ramah Anak', desc: 'Pusat pembiasaan shalat berjamaah Dhuha & Dzuhur serta halaqah tahfiz harian.', icon: '🕌' },
    { title: 'Perpustakaan Digital (E-Library)', desc: 'Koleksi ribuan buku fiksi, ensiklopedia sains Islami, dan akses baca e-book terpadu.', icon: '📚' },
    { title: 'Smart Classroom Interaktif', desc: 'Ruang kelas ber-AC, proyektor interaktif, audio visual, dan tata ruang ergonomis.', icon: '🏫' },
    { title: 'Area Olahraga & Panahan', desc: 'Lapangan serbaguna untuk upacara, senam pagi bersama, pencak silat, dan panahan sunnah.', icon: '🏹' },
    { title: 'UKS Ramah Anak & Ruang Konseling', desc: 'Fasilitas kesehatan dasar anak dengan tenaga medis dan ruang bimbingan SEL.', icon: '🏥' },
    { title: 'Kantin Sehat & Halal', desc: 'Penyedia makanan bergizi higienis tanpa pengawet sintetis dan bebas plastik sekali pakai.', icon: '🥗' },
    { title: 'Area Bermain & Taman Literasi', desc: 'Ruang terbuka hijau asri di tengah kawasan Kuningan untuk relaksasi motorik anak.', icon: '🌳' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <Sparkles size={14} className="text-emerald-600" />
            <span>Tentang MI RPI Jakarta</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Profil Madrasah Ibtidaiyah RPI Jakarta
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Menyelenggarakan pendidikan dasar Islami unggulan yang mengedepankan pembentukan budi pekerti luhur serta penguasaan sains teknologi masa depan.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl shadow-xs border border-slate-200 inline-flex flex-wrap gap-1">
            {[
              { id: 'profil', label: 'Visi, Misi & Sejarah' },
              { id: 'gtk', label: 'Pimpinan & Guru (GTK)' },
              { id: 'sarpras', label: 'Sarana & Prasarana' },
              { id: 'legalitas', label: 'Legalitas & Akreditasi' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: VISI, MISI, SEJARAH */}
        {activeTab === 'profil' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* VISI BESAR & ELEGAN */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-emerald-700/40">
              <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
                  Visi Madrasah
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-emerald-50 leading-relaxed">
                  "{settings.vision}"
                </h2>

                <p className="text-xs text-emerald-300 font-medium">
                  Landasan filosofis pembinaan generasi Rabbani yang beradab dan adaptif di era kemajuan digital.
                </p>
              </div>
            </div>

            {/* MISI & TUJUAN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Misi */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Target size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Misi Madrasah</h3>
                </div>
                <div className="space-y-3 pt-2">
                  {settings.missions.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tujuan */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Tujuan Madrasah</h3>
                </div>
                <div className="space-y-3 pt-2">
                  {settings.goals.map((g, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                      <CheckCircle size={16} className="text-teal-600 shrink-0 mt-0.5" />
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEJARAH MADRASAH */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Building size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Sejarah & Rekam Jejak MI RPI</h3>
                    <p className="text-xs text-slate-500">Yayasan Rumah Pendidikan Islam (Kuningan, Jakarta Selatan)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 self-start sm:self-auto">
                  <img
                    src="/images/logo-yayasan-rpi.svg"
                    alt="Logo Yayasan RPI"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <p className="text-[11px] font-bold text-emerald-950">Yayasan RPI</p>
                    <p className="text-[10px] text-emerald-700">Logo Resmi Lembaga</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-emerald text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
                <p>
                  Madrasah Ibtidaiyah RPI Jakarta didirikan di bawah naungan <strong>Yayasan Rumah Pendidikan Islam (RPI)</strong> dengan tekad kuat menghadirkan oase pendidikan Islam berkualitas di jantung kota Jakarta Selatan. Berlokasi di kawasan strategis Jl. HR. Rasuna Said Kav. X2-2, Kuningan Timur, madrasah ini tumbuh dan berkembang seiring dinamika peradaban ibu kota.
                </p>
                <p>
                  Sejak masa pendiriannya, MI RPI berikhtiar memadukan kedalaman nilai-nilai keagamaan dengan keunggulan akademik sains. Berbekal komitmen dewan pendiri, para asatidz, dan dukungan penuh orang tua, MI RPI secara konsisten mempertahankan <strong>Akreditasi A (Unggul)</strong> dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M).
                </p>
                <p>
                  Menapaki era digital, MI RPI bertransformasi menjadi <em>Smart Madrasah</em> terintegrasi melalui konsep Super School Platform, penerapan kurikulum ramah anak (Social Emotional Learning), pembelajaran komputasi cilik (Scratch & Robotika), serta penguatan hafalan Al-Qur'an bersanad.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GURU & TENAGA KEPENDIDIKAN */}
        {activeTab === 'gtk' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Kepala Madrasah Card */}
            <div className="bg-white p-8 rounded-3xl border border-emerald-200 shadow-sm max-w-2xl mx-auto text-center space-y-4">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Kepala Madrasah
              </span>
              <div className="w-28 h-28 mx-auto rounded-full bg-slate-200 overflow-hidden border-4 border-emerald-100 shadow-md">
                <img
                  src={settings.principalPhotoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80"}
                  alt="Kepala Madrasah"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{settings.principalName}</h3>
                <p className="text-xs text-slate-500 font-medium">Pemimpin Pembelajaran MI RPI Jakarta</p>
              </div>
              <p className="text-xs text-slate-600 italic max-w-lg mx-auto">
                "Kami berkomitmen mendidik setiap anak dengan cinta, keteladanan akhlak mulia, dan rasa ingin tahu ilmiah yang tinggi."
              </p>
            </div>

            {/* Direktori Dewan Guru */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users size={18} className="text-emerald-700" />
                <span>Pendidik & Tenaga Kependidikan Profesional</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teachers.map((tch) => (
                  <div
                    key={tch.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 text-center space-y-3"
                  >
                    <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden bg-slate-100 border-2 border-emerald-100">
                      <img src={tch.photoUrl} alt={tch.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{tch.name}</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold">{tch.title}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                      <p className="truncate">Mapel: <strong>{tch.subject}</strong></p>
                      <p className="text-[10px] text-slate-400">{tch.education}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SARANA PRASARANA */}
        {activeTab === 'sarpras' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-slate-900">Sarana & Prasarana Ramah Anak</h3>
              <p className="text-xs text-slate-500 mt-1">
                Fasilitas lengkap dan terstandar untuk mendukung kenyamanan tumbuh kembang seluruh siswa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-3xl mb-3 block">{fac.icon}</span>
                    <h4 className="font-bold text-sm text-slate-900 mb-1.5">{fac.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{fac.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    Terawat & Terstandarisasi
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LEGALITAS & AKREDITASI */}
        {activeTab === 'legalitas' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Dokumen Legalitas Formal</h3>
                  <p className="text-xs text-slate-500">Kementerian Agama RI & BAN-S/M</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[11px]">NPSN Resmi:</span>
                  <span className="text-slate-900 font-bold text-sm">{settings.npsn}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[11px]">Kode Registrasi Madrasah:</span>
                  <span className="text-slate-900 font-bold text-sm">{settings.madrasahCode}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[11px]">Status Akreditasi:</span>
                  <span className="text-emerald-800 font-bold text-sm">Akreditasi A (Predikat Unggul)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[11px]">Yayasan Penyelenggara:</span>
                  <span className="text-slate-900 font-bold text-sm">{settings.foundation}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[11px]">Naungan Lembaga:</span>
                  <span className="text-slate-900 font-bold text-sm">Kementerian Agama RI (Kemenag)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-400 block font-semibold text-[11px]">Bentuk Pendidikan:</span>
                  <span className="text-slate-900 font-bold text-sm">Madrasah Ibtidaiyah (MI)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
