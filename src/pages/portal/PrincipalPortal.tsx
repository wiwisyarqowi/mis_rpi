import React from 'react';
import {
  TrendingUp,
  Users,
  Award,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const PrincipalPortal: React.FC = () => {
  const { settings, spmbApplications, payments, complaints, students, teachers } = useSchool();

  const totalSpmb = spmbApplications.length;
  const acceptedSpmb = spmbApplications.filter((s) => s.status === 'Diterima').length;
  const totalPayments = payments.reduce((acc, p) => (p.status === 'Lunas' ? acc + p.amount : acc), 0);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Principal */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="bg-purple-950/70 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-500/30 uppercase tracking-wider">
              Executive Dashboard
            </span>
            <h1 className="text-2xl font-black mt-1">Dashboard Kepala Madrasah</h1>
            <p className="text-xs text-purple-200">
              {settings.schoolName} • Tahun Ajaran {settings.academicYear} • Akreditasi {settings.accreditation}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-purple-950/60 px-4 py-2 rounded-2xl border border-purple-500/30 text-xs">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>Status Mutu: Unggul (BAN-S/M)</span>
          </div>
        </div>

        {/* Executive KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Tingkat Kehadiran</span>
              <Users size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">98.4%</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">↑ Sangat Disiplin (Rata-rata 6 Kelas)</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pendaftar SPMB 26/27</span>
              <Award size={18} className="text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{totalSpmb} Calon Murid</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">{acceptedSpmb} Telah Diterima</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Realisasi SPP Bulan Ini</span>
              <CreditCard size={18} className="text-teal-600" />
            </div>
            <p className="text-2xl font-black text-emerald-800">Rp {totalPayments.toLocaleString('id-ID')}</p>
            <p className="text-[11px] text-teal-600 font-semibold mt-1">Tercatat Lunas di Rekening BSI</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Suara Warga Masuk</span>
              <MessageSquare size={18} className="text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{complaints.length} Aspirasi</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">100% Ditindaklanjuti Humas</p>
          </div>
        </div>

        {/* Monitoring Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SPMB Monitoring */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Monitoring SPMB 2027/2028</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {spmbApplications.map((s) => (
                <div key={s.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{s.studentName}</h4>
                    <p className="text-slate-500">{s.programChosen} • Asal: {s.previousSchool}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    s.status === 'Diterima' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suara Warga Monitoring */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Monitoring Suara Warga & Komite</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {complaints.map((c) => (
                <div key={c.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.senderName} ({c.category})</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold">{c.status}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">"{c.message}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
