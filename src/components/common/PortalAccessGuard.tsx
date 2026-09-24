import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn, KeyRound } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

interface PortalAccessGuardProps {
  requiredRole: UserRole | UserRole[];
  portalName: string;
  loginTab: 'GURU' | 'ORANG_TUA' | 'SISWA' | 'ADMIN';
  children: React.ReactNode;
}

export const PortalAccessGuard: React.FC<PortalAccessGuardProps> = ({
  requiredRole,
  portalName,
  loginTab,
  children,
}) => {
  const { currentUser, currentRole, navigate, logout } = useSchool();

  // If not logged in at all
  if (!currentUser) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-3xl">
            🔒
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Autentikasi Diperlukan
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Silakan Masuk ke {portalName}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda belum login atau telah keluar dari sesi sebelumnya. Masuk menggunakan akun terdaftar untuk mengakses dashboard ini.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => navigate('login', { role: loginTab })}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={15} />
              <span>Buka Halaman Login {portalName}</span>
            </button>

            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda Utama</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check role match
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasAccess =
    allowedRoles.includes(currentUser.role) ||
    (allowedRoles.includes('GURU') && currentUser.role === 'WALI_KELAS') ||
    currentUser.role === 'SUPER_ADMIN' ||
    (allowedRoles.includes('ADMIN') && currentUser.role === 'ADMIN');

  if (!hasAccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center text-3xl">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
              Hak Akses Terbatas
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Peran Akun Tidak Sesuai
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda saat ini sedang masuk sebagai{' '}
              <strong className="text-slate-900">{currentUser.name}</strong> (Peran:{' '}
              <span className="font-semibold text-rose-700">{currentUser.role}</span>). Portal ini dikhususkan untuk <strong>{portalName}</strong>.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                logout();
                navigate('login', { role: loginTab });
              }}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-700/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound size={15} />
              <span>Ganti Akun & Masuk sebagai {portalName}</span>
            </button>

            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Kembali ke Beranda Utama</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
