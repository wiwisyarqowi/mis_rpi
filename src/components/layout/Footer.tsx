import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Youtube,
  Facebook,
  ShieldCheck,
  Award,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const Footer: React.FC = () => {
  const { settings, navigate, loginAsRole } = useSchool();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Identity & Motto */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-0.5 border border-emerald-500/40 flex items-center justify-center shadow-md shadow-emerald-500/10 shrink-0 overflow-hidden">
                <img
                  src={settings.logoUrl || "/images/logo-yayasan-rpi.svg"}
                  alt="Logo Resmi Yayasan Rumah Pendidikan Islam"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-extrabold text-base tracking-tight">{settings.schoolName}</h3>
                <p className="text-emerald-400 text-xs font-semibold">{settings.foundation}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              "{settings.tagline}"
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-800/60">
                <Award size={13} className="text-amber-400" />
                Akreditasi {settings.accreditation}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                <ShieldCheck size={13} className="text-emerald-400" />
                NPSN {settings.npsn}
              </span>
            </div>

            <div className="pt-3">
              <p className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mb-2">Media Sosial Resmi</p>
              <div className="flex items-center space-x-3">
                <a
                  href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <span className="text-xs text-slate-400 font-medium">{settings.instagram}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Menu Cepat */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Menu Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { id: 'profil', label: 'Profil & Sejarah Madrasah' },
                { id: 'akademik', label: 'Kurikulum & Akademik' },
                { id: 'program-unggulan', label: '15 Program Unggulan' },
                { id: 'kesiswaan', label: 'Kesiswaan & Pembiasaan' },
                { id: 'prestasi', label: 'Hall of Fame Prestasi' },
                { id: 'berita', label: 'Warta & Pengumuman' },
                { id: 'galeri', label: 'Dokumentasi & Galeri' },
                { id: 'spmb', label: 'SPMB 2027/2028 (PPDB)' },
                { id: 'kontak', label: 'Aspirasi "Suara Warga" & Kontak' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.id)}
                    className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-1.5"
                  >
                    <ArrowRight size={12} className="text-emerald-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-800 mt-4 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Pintu Masuk Portal:
              </span>
              <div className="flex flex-col space-y-1 text-xs">
                <button
                  onClick={() => loginAsRole('GURU')}
                  className="text-left text-slate-400 hover:text-blue-400 transition"
                >
                  👩‍🏫 Portal Guru & Asatidz
                </button>
                <button
                  onClick={() => loginAsRole('ORANG_TUA')}
                  className="text-left text-slate-400 hover:text-teal-400 transition"
                >
                  👨‍👩‍👧 Portal Orang Tua (Wali)
                </button>
                <button
                  onClick={() => loginAsRole('SISWA')}
                  className="text-left text-slate-400 hover:text-emerald-400 transition"
                >
                  👦 Portal Siswa & Santri
                </button>
                <button
                  onClick={() => navigate('login')}
                  className="text-left text-amber-400 hover:underline font-bold text-[11px] pt-1"
                >
                  🔑 Halaman Masuk Lengkap (SSO)
                </button>
              </div>
            </div>
          </div>

          {/* Col 3: Informasi Lembaga & Jam Sekolah */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Informasi Lembaga
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <span className="block text-slate-500 text-[11px] font-semibold">Naungan:</span>
                <span className="text-slate-200 font-medium">{settings.status} — Kementerian Agama RI</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px] font-semibold">Yayasan:</span>
                <span className="text-slate-200 font-medium">{settings.foundation}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px] font-semibold">Tahun Ajaran:</span>
                <span className="text-emerald-300 font-semibold">{settings.academicYear}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px] font-semibold">Jam Kegiatan Belajar Mengajar:</span>
                <span className="text-slate-300">{settings.schoolHours}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-[11px] font-semibold">Kepala Madrasah:</span>
                <span className="text-slate-300">{settings.principalName}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Alamat Terverifikasi & Kontak */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Alamat & Lokasi
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200 block">{settings.address}</strong>
                  RT {settings.rtRw}, {settings.subDistrict}, Kec. {settings.district}, {settings.city}, {settings.province} {settings.postalCode}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-teal-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-blue-400 shrink-0" />
                <span>{settings.email}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('kontak')}
                  className="w-full py-2 px-3 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-bold rounded-xl border border-emerald-700/60 transition text-center"
                >
                  Buka Peta & Petunjuk Arah
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{settings.footerText}</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate('profil')} className="hover:text-slate-400 transition">Kebijakan Privasi Siswa</button>
            <span>•</span>
            <button onClick={() => navigate('kontak')} className="hover:text-slate-400 transition">Pengaduan Suara Warga</button>
            <span>•</span>
            <button onClick={() => navigate('spmb')} className="text-emerald-400 hover:underline">PPDB 2026</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
