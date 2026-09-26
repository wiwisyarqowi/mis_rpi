import React, { useState } from 'react';
import {
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Printer,
  Calendar,
  Users,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  Download,
  Filter,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PortalAccessGuard } from '../../components/common/PortalAccessGuard';
import { PaymentFinanceManager } from '../../components/admin/PaymentFinanceManager';

export const TreasurerPortal: React.FC = () => {
  const {
    settings,
    payments,
    students,
    classes,
    currentUser,
    logout,
    navigate,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'transactions' | 'classSummary' | 'settings'>('transactions');

  // Overall Financial Stats
  const totalInvoices = payments.length;
  const paidInvoices = payments.filter((p) => p.status === 'Lunas');
  const unpaidInvoices = payments.filter((p) => p.status === 'Belum Bayar');
  const totalCollected = paidInvoices.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalOutstanding = unpaidInvoices.reduce((acc, p) => acc + (p.amount || 0), 0);
  const paymentRate = totalInvoices > 0 ? Math.round((paidInvoices.length / totalInvoices) * 100) : 0;

  // Class Summary calculation
  const classSummaries = classes.map((cls) => {
    const classStudents = students.filter((s) => s.className === cls.name);
    const classPayments = payments.filter((p) => p.className === cls.name);
    const classPaid = classPayments.filter((p) => p.status === 'Lunas');
    const classUnpaid = classPayments.filter((p) => p.status === 'Belum Bayar');
    const collectedAmount = classPaid.reduce((acc, p) => acc + (p.amount || 0), 0);
    const outstandingAmount = classUnpaid.reduce((acc, p) => acc + (p.amount || 0), 0);
    const rate = classPayments.length > 0 ? Math.round((classPaid.length / classPayments.length) * 100) : 0;

    return {
      className: cls.name,
      homeroomTeacher: cls.homeroomTeacherName,
      totalStudents: classStudents.length,
      totalPayments: classPayments.length,
      paidCount: classPaid.length,
      unpaidCount: classUnpaid.length,
      collectedAmount,
      outstandingAmount,
      rate,
    };
  });

  return (
    <PortalAccessGuard
      requiredRole={['BENDAHARA', 'ADMIN', 'SUPER_ADMIN']}
      portalName="Portal Bendahara & Keuangan"
      loginTab="ADMIN"
    >
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Bendahara */}
          <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 bg-emerald-800/60 border border-emerald-600/40 text-emerald-200 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                <CreditCard size={12} className="text-amber-400" />
                <span>Otoritas Keuangan & Kas Syariah Madrasah</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Portal Bendahara Madrasah
              </h1>
              <p className="text-xs text-emerald-200 max-w-2xl">
                Pengelolaan mandiri iuran SPP, kas rekening Bank Syariah Indonesia (BSI), penerbitan tagihan bulanan, pencatatan loket madrasah, dan laporan keuangan komprehensif.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                <span className="bg-emerald-900/80 px-3 py-1 rounded-xl border border-emerald-700/50 text-emerald-100 flex items-center gap-1.5 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Petugas: {currentUser?.name || 'Hj. Siti Mutmainnah, S.E.'}
                </span>
                <span className="bg-emerald-900/80 px-3 py-1 rounded-xl border border-emerald-700/50 text-emerald-100 font-semibold">
                  Rekening: {settings.bankName || 'BSI'} • {settings.bankAccountNumber || '7182903842'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-end gap-2 relative z-10 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-emerald-900/80 px-4 py-2 rounded-2xl border border-emerald-600/40 text-xs text-white">
                <ShieldCheck size={16} className="text-amber-400" />
                <span className="font-bold">Kas Terverifikasi BSI</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('login', { role: 'ADMIN' });
                }}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Keluar Sesi
              </button>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-2">
            {[
              { id: 'transactions', label: '💳 Kelola SPP & Transaksi Kas', icon: CreditCard },
              { id: 'classSummary', label: '📊 Rekapitulasi per Kelas (1A - 6B)', icon: FileSpreadsheet },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: MANAJEMEN TRANSAKSI SPP LENGKAP */}
          {activeTab === 'transactions' && (
            <PaymentFinanceManager />
          )}

          {/* TAB 2: REKAPITULASI LAPORAN PER KELAS */}
          {activeTab === 'classSummary' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Laporan Tingkat Kelunasan SPP per Rombel / Kelas
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rekap kepatuhan iuran SPP untuk pelaporan kepada Kepala Madrasah dan Yayasan Rumah Pendidikan Islam.
                    </p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Printer size={14} />
                    <span>Cetak Laporan Rekap</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-3 px-3">Kelas</th>
                        <th className="py-3 px-3">Wali Kelas</th>
                        <th className="py-3 px-3 text-center">Jumlah Santri</th>
                        <th className="py-3 px-3 text-center">Tagihan Diterbitkan</th>
                        <th className="py-3 px-3 text-center">Lunas</th>
                        <th className="py-3 px-3 text-center">Tunggakan</th>
                        <th className="py-3 px-3">Total Terkumpul</th>
                        <th className="py-3 px-3">Tingkat Lunas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {classSummaries.map((c) => (
                        <tr key={c.className} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-3 font-bold text-slate-900">
                            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                              {c.className}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-medium">
                            {c.homeroomTeacher || 'Ustadz / Ustadzah'}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800">
                            {c.totalStudents} santri
                          </td>
                          <td className="py-3 px-3 text-center text-slate-700">
                            {c.totalPayments} invoice
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-700">
                            {c.paidCount}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-rose-700">
                            {c.unpaidCount}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-emerald-950">
                            Rp {c.collectedAmount.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-[11px] w-9">
                                {c.rate}%
                              </span>
                              <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="bg-emerald-600 h-1.5 rounded-full"
                                  style={{ width: `${c.rate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 font-bold border-t-2 border-slate-200 text-slate-900">
                        <td className="py-3 px-3" colSpan={2}>
                          Total Keseluruhan Madrasah
                        </td>
                        <td className="py-3 px-3 text-center">
                          {students.length} santri
                        </td>
                        <td className="py-3 px-3 text-center">
                          {totalInvoices} invoice
                        </td>
                        <td className="py-3 px-3 text-center text-emerald-700">
                          {paidInvoices.length}
                        </td>
                        <td className="py-3 px-3 text-center text-rose-700">
                          {unpaidInvoices.length}
                        </td>
                        <td className="py-3 px-3 font-mono text-emerald-950 text-sm">
                          Rp {totalCollected.toLocaleString('id-ID')}
                        </td>
                        <td className="py-3 px-3 text-emerald-800">
                          {paymentRate}%
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalAccessGuard>
  );
};
