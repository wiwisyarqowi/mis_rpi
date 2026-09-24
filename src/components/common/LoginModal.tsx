import React, { useState } from 'react';
import { X, Lock, ShieldCheck, UserCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { navigate, currentUser } = useSchool();
  const [selectedRole, setSelectedRole] = useState<UserRole>('SISWA');

  if (!isOpen) return null;

  const demoAccounts: { role: UserRole; tab: 'SISWA' | 'ORANG_TUA' | 'GURU' | 'ADMIN'; title: string; name: string; desc: string; icon: string }[] = [
    { role: 'SISWA', tab: 'SISWA', title: 'Portal Siswa (LMS & CBT)', name: 'Muhammad Al Fatih', desc: 'Kelas 4A • Tugas, Kuis CBT, Jurnal Ibadah & E-Library', icon: '👦' },
    { role: 'ORANG_TUA', tab: 'ORANG_TUA', title: 'Portal Orang Tua / Wali', name: 'Wali Murid Al Fatih', desc: 'Monitoring Presensi Real-Time, e-Rapor & Bayar SPP', icon: '👨‍👩‍👧' },
    { role: 'GURU', tab: 'GURU', title: 'Portal Pendidik (GTK)', name: 'Ustadz Ahmad Fauzi, S.Pd.I', desc: 'Input Nilai, Checklist Presensi, Poin Karakter & Bank Soal', icon: '👨‍🏫' },
    { role: 'KEPALA_MADRASAH', tab: 'ADMIN', title: 'Eksekutif Dashboard', name: 'Kepala Madrasah RPI', desc: 'Monitoring Kinerja Sekolah, Kehadiran, Keuangan & SPMB', icon: '🏛️' },
    { role: 'ADMIN', tab: 'ADMIN', title: 'Super Administrator', name: 'Admin Pusat Data RPI', desc: 'Pengaturan Sekolah (/admin/settings), SPMB & Suara Warga', icon: '⚙️' },
  ];

  const handleSelectRole = (tab: 'SISWA' | 'ORANG_TUA' | 'GURU' | 'ADMIN') => {
    navigate('login', { role: tab });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Lock size={12} className="text-amber-400" />
            <span>Single Sign-On (SSO) MI RPI</span>
          </div>
          <h2 className="text-xl font-bold">Masuk ke Portal Terpadu</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Pilih peran pengguna untuk masuk ke dashboard sistem Super School.
          </p>
        </div>

        {/* Roles Quick-Select List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pilih Portal Tujuan untuk Masuk:
          </p>

          <div className="space-y-2.5">
            {demoAccounts.map((acc) => (
              <div
                key={acc.role}
                onClick={() => handleSelectRole(acc.tab)}
                className="group cursor-pointer p-3.5 rounded-2xl border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/50 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {acc.icon}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800 transition">
                      {acc.title}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-700">{acc.name}</p>
                    <p className="text-[10px] text-slate-500 leading-snug">{acc.desc}</p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-400 flex items-center justify-center transition shrink-0">
                  <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Koneksi Aman Terenkripsi SSL</span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
