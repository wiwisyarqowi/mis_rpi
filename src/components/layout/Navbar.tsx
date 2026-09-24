import React, { useState } from 'react';
import {
  GraduationCap,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Sparkles,
  Phone,
  LogIn,
  BookOpen,
  Award,
  Users,
  Compass,
  Calendar,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { settings, currentView, navigate, currentUser, currentRole, loginAsRole, logout } = useSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'akademik', label: 'Akademik' },
    { id: 'program-unggulan', label: 'Program Unggulan' },
    { id: 'kesiswaan', label: 'Kesiswaan' },
    { id: 'prestasi', label: 'Prestasi' },
    { id: 'berita', label: 'Berita' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'spmb', label: 'PPDB / SPMB', badge: 'Buka' },
    { id: 'kontak', label: 'Kontak' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    loginAsRole(role);
    setPortalDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getPortalName = (role: UserRole) => {
    switch (role) {
      case 'SISWA':
        return 'Portal Siswa';
      case 'ORANG_TUA':
        return 'Portal Orang Tua';
      case 'GURU':
      case 'WALI_KELAS':
        return 'Portal Guru';
      case 'KEPALA_MADRASAH':
        return 'Portal Kepala Madrasah';
      case 'ADMIN':
      case 'SUPER_ADMIN':
      default:
        return 'Portal Admin';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      {/* Top Banner Info / Ticker */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-emerald-100 text-xs px-4 py-1.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              NPSN: <strong className="text-white">{settings.npsn}</strong>
            </span>
            <span>•</span>
            <span>Kode Madrasah: <strong className="text-white">{settings.madrasahCode}</strong></span>
            <span>•</span>
            <span className="bg-emerald-700/60 text-amber-300 font-semibold px-2 py-0.5 rounded-full text-[11px] border border-amber-400/30">
              Akreditasi {settings.accreditation} (Unggul)
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-emerald-200">
              📍 {settings.subDistrict}, {settings.district}, {settings.city}
            </span>
            <span>•</span>
            <button
              onClick={() => loginAsRole('GURU')}
              className="text-emerald-200 hover:text-white font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <span>👩‍🏫 Portal Guru</span>
            </button>
            <span>•</span>
            <button
              onClick={() => loginAsRole('ORANG_TUA')}
              className="text-emerald-200 hover:text-white font-semibold transition cursor-pointer flex items-center gap-1"
            >
              <span>👨‍👩‍👧 Portal Ortu</span>
            </button>
            <span>•</span>
            <button
              onClick={() => {
                loginAsRole('ADMIN');
                navigate('portal-admin', { tab: 'media' });
              }}
              className="bg-amber-400/20 hover:bg-amber-400 text-amber-200 hover:text-slate-950 font-bold px-2 py-0.5 rounded-lg border border-amber-400/40 text-[10px] transition flex items-center gap-1 cursor-pointer"
              title="Ganti logo, banner, dan foto kegiatan madrasah"
            >
              <span>📸 Kelola Gambar</span>
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('spmb')}
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition"
            >
              <span>SPMB 2027/2028 Telah Dibuka</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-13 h-13 rounded-2xl p-0.5 bg-white border border-emerald-200/90 shadow-md shadow-emerald-900/10 group-hover:scale-105 group-hover:border-emerald-400 transition duration-300 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={settings.logoUrl || "/images/logo-yayasan-rpi.svg"}
                alt="Logo Resmi Yayasan Rumah Pendidikan Islam"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-extrabold text-slate-900 tracking-tight group-hover:text-emerald-700 transition">
                  MI RPI JAKARTA
                </span>
                <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                  Kemenag RI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Madrasah Unggul, Berakhlak Mulia, Era Digital
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`relative px-3 py-2 text-xs font-semibold rounded-lg transition duration-200 ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-400 text-slate-900 rounded-full animate-bounce">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => navigate('spmb')}
              className="px-4 py-2 text-xs font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 rounded-xl transition shadow-xs flex items-center gap-1.5 border border-emerald-200"
            >
              <Sparkles size={14} className="text-emerald-600" />
              <span>Daftar SPMB</span>
            </button>

            {/* Portal Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 rounded-xl transition shadow-md shadow-emerald-600/25 flex items-center gap-2"
              >
                <LogIn size={14} />
                <span>{currentUser ? getPortalName(currentRole) : 'Masuk Portal'}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${portalDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {portalDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pilih Portal Akses</p>
                    <p className="text-xs text-slate-600">Terintegrasi dalam 1 Ekosistem</p>
                  </div>

                  <div className="py-1 space-y-1">
                    <button
                      onClick={() => handleRoleSelect('SISWA')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">👨‍🎓</span>
                        <span>Portal Siswa</span>
                      </span>
                      <span className="text-[10px] text-slate-400">LMS & Tugas</span>
                    </button>

                    <button
                      onClick={() => handleRoleSelect('ORANG_TUA')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">👨‍👩‍👧</span>
                        <span>Portal Orang Tua</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Presensi & SPP</span>
                    </button>

                    <button
                      onClick={() => handleRoleSelect('GURU')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">👩‍🏫</span>
                        <span>Portal Guru</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Nilai & e-Rapor</span>
                    </button>

                    <button
                      onClick={() => handleRoleSelect('KEPALA_MADRASAH')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">🏛️</span>
                        <span>Kepala Madrasah</span>
                      </span>
                      <span className="text-[10px] text-slate-400">Executive</span>
                    </button>

                    <button
                      onClick={() => handleRoleSelect('ADMIN')}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">⚙️</span>
                        <span>Admin & Kelola Media</span>
                      </span>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">Ganti Foto</span>
                    </button>

                    <button
                      onClick={() => {
                        handleRoleSelect('ADMIN');
                        navigate('portal-admin', { tab: 'masterdata' });
                        setPortalDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">🎓</span>
                        <span>Edit Guru, Santri & Kelas</span>
                      </span>
                      <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-1.5 py-0.5 rounded">Biodata</span>
                    </button>

                    <button
                      onClick={() => {
                        handleRoleSelect('ADMIN');
                        navigate('portal-admin', { tab: 'users' });
                        setPortalDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">👥</span>
                        <span>Kelola Akun Guru & Ortu</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Password</span>
                    </button>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          navigate('login');
                          setPortalDropdownOpen(false);
                        }}
                        className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-[11px] transition flex items-center justify-center gap-1.5"
                      >
                        <Lock size={12} className="text-emerald-600" />
                        <span>Halaman Masuk Lengkap (SSO)</span>
                      </button>
                    </div>
                  </div>

                  {currentUser && (
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={logout}
                        className="w-full text-center px-3 py-1.5 text-xs text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition"
                      >
                        Keluar dari Akun
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => navigate('spmb')}
              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 rounded-lg"
            >
              SPMB
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-emerald-100 shadow-xl px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 py-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  navigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs font-semibold rounded-xl ${
                  currentView === link.id
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-slate-700 bg-slate-50 hover:bg-emerald-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Akses Portal Madrasah</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleRoleSelect('SISWA')}
                className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center border border-emerald-200"
              >
                👨‍🎓 Siswa
              </button>
              <button
                onClick={() => handleRoleSelect('ORANG_TUA')}
                className="p-2.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-xl text-center border border-teal-200"
              >
                👨‍👩‍👧 Orang Tua
              </button>
              <button
                onClick={() => handleRoleSelect('GURU')}
                className="p-2.5 bg-blue-50 text-blue-800 text-xs font-bold rounded-xl text-center border border-blue-200"
              >
                👩‍🏫 Guru
              </button>
              <button
                onClick={() => handleRoleSelect('ADMIN')}
                className="p-2.5 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl text-center border border-amber-200"
              >
                ⚙️ Admin
              </button>
            </div>

            <button
              onClick={() => {
                navigate('login');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 mt-2"
            >
              <Lock size={14} className="text-amber-400" />
              <span>Pusat Masuk Portal Lengkap</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
