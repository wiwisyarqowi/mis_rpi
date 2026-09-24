import React from 'react';
import {
  Award,
  FileBadge,
  GraduationCap,
  Building2,
  Landmark,
  MapPin,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const DataStatsSection: React.FC = () => {
  const { settings } = useSchool();

  const stats = [
    {
      label: 'Akreditasi',
      value: settings.accreditation,
      sub: 'BAN-S/M (Predikat Unggul)',
      icon: Award,
      color: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-100 text-amber-700',
    },
    {
      label: 'NPSN Resmi',
      value: settings.npsn,
      sub: `Kode Madrasah: ${settings.madrasahCode}`,
      icon: FileBadge,
      color: 'from-emerald-600 to-emerald-700',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Jenjang Pendidikan',
      value: 'Madrasah Ibtidaiyah (MI)',
      sub: 'Setara Sekolah Dasar (Kelas 1 - 6)',
      icon: GraduationCap,
      color: 'from-teal-600 to-teal-700',
      iconBg: 'bg-teal-100 text-teal-700',
    },
    {
      label: 'Status Lembaga',
      value: settings.status,
      sub: settings.foundation,
      icon: Building2,
      color: 'from-blue-600 to-blue-700',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Naungan Resmi',
      value: 'Kementerian Agama',
      sub: 'Direktorat KSKK Madrasah',
      icon: Landmark,
      color: 'from-indigo-600 to-indigo-700',
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
    {
      label: 'Lokasi Strategis',
      value: 'Kuningan Timur',
      sub: 'Setiabudi – Jakarta Selatan, DKI Jakarta',
      icon: MapPin,
      color: 'from-rose-600 to-rose-700',
      iconBg: 'bg-rose-100 text-rose-700',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-2xs">
            <Sparkles size={14} className="text-amber-500" />
            <span>Identitas Sekolah Resmi & Terverifikasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MI RPI Dalam Data
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Bukti legalitas formal, akreditasi mutu, dan tata kelola madrasah terpercaya di pusat Jakarta Selatan.
          </p>

          <div className="mt-4 inline-block bg-gradient-to-r from-emerald-800 to-teal-900 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
            Badge: "Madrasah Berbasis Nilai Islam & Teknologi"
          </div>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-slate-50 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-xs`}>
                      <Icon size={24} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-800 transition">
                    {item.value}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>{item.sub}</span>
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
