import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Printer,
  Calendar,
  Building,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Sparkles,
  Trash2,
  Edit,
  FileSpreadsheet,
  X,
  User,
  Receipt,
  Download,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PaymentRecord } from '../../types';

export const PaymentFinanceManager: React.FC = () => {
  const {
    payments,
    addPaymentRecord,
    updatePaymentRecord,
    deletePaymentRecord,
    generateMonthlyInvoices,
    students,
    classes,
    settings,
    updateSettings,
  } = useSchool();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Lunas' | 'Belum Bayar'>('ALL');
  const [classFilter, setClassFilter] = useState<string>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('ALL');

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [printReceiptPayment, setPrintReceiptPayment] = useState<PaymentRecord | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Notice Toast
  const [notice, setNotice] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const showNotice = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotice({ message, type });
    setTimeout(() => setNotice(null), 4000);
  };

  // State for Generate Invoices
  const [generateMonth, setGenerateMonth] = useState('Oktober');
  const [generateYear, setGenerateYear] = useState(2026);

  // State for Manual Payment Form
  const [manualStudentId, setManualStudentId] = useState('');
  const [manualMonth, setManualMonth] = useState('September');
  const [manualYear, setManualYear] = useState(2026);
  const [manualAmount, setManualAmount] = useState(settings.monthlyTuitionFee || 650000);
  const [manualMethod, setManualMethod] = useState('Tunai di Loket Madrasah');
  const [manualStatus, setManualStatus] = useState<'Lunas' | 'Belum Bayar'>('Lunas');

  // State for Quick Finance Settings
  const [tempTuitionFee, setTempTuitionFee] = useState(settings.monthlyTuitionFee || 650000);
  const [tempBankName, setTempBankName] = useState(settings.bankName || 'Bank Syariah Indonesia (BSI)');
  const [tempAccountNo, setTempAccountNo] = useState(settings.bankAccountNumber || '7182903842');
  const [tempAccountHolder, setTempAccountHolder] = useState(settings.bankAccountHolder || 'Yayasan Rumah Pendidikan Islam - MI RPI');

  // Statistics calculation
  const totalInvoices = payments.length;
  const paidInvoices = payments.filter((p) => p.status === 'Lunas');
  const unpaidInvoices = payments.filter((p) => p.status === 'Belum Bayar');
  const totalCollected = paidInvoices.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalOutstanding = unpaidInvoices.reduce((acc, p) => acc + (p.amount || 0), 0);
  const paymentRate = totalInvoices > 0 ? Math.round((paidInvoices.length / totalInvoices) * 100) : 0;

  // Filtered payments list
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.className.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesClass = classFilter === 'ALL' || p.className === classFilter;
    const matchesMonth = monthFilter === 'ALL' || p.month === monthFilter;

    return matchesSearch && matchesStatus && matchesClass && matchesMonth;
  });

  const handleGenerateInvoices = () => {
    const count = generateMonthlyInvoices(generateMonth, generateYear);
    setIsGenerateModalOpen(false);
    if (count > 0) {
      showNotice(`Berhasil menerbitkan ${count} tagihan SPP baru untuk bulan ${generateMonth} ${generateYear}.`, 'success');
    } else {
      showNotice(`Seluruh santri sudah memiliki tagihan untuk bulan ${generateMonth} ${generateYear}.`, 'info');
    }
  };

  const handleCreateManualPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStudentId) {
      showNotice('Harap pilih santri/siswa terlebih dahulu.', 'error');
      return;
    }
    const student = students.find((s) => s.id === manualStudentId);
    if (!student) return;

    const randNum = Math.floor(1000 + Math.random() * 9000);
    const invoiceNum = `INV-${manualYear}${manualMonth.substring(0, 3).toUpperCase()}-${student.nisn?.slice(-4) || randNum}`;

    const newRec = addPaymentRecord({
      invoiceNumber: invoiceNum,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      month: manualMonth,
      year: manualYear,
      amount: Number(manualAmount) || settings.monthlyTuitionFee,
      status: manualStatus,
      paymentDate: manualStatus === 'Lunas' ? new Date().toISOString().split('T')[0] : undefined,
      paymentMethod: manualStatus === 'Lunas' ? manualMethod : undefined,
    });

    setIsManualPaymentModalOpen(false);
    showNotice(`Tagihan/Pembayaran SPP untuk ${student.name} berhasil dicatat (${manualStatus}).`, 'success');
  };

  const handleMarkAsPaid = (pay: PaymentRecord, method: string = 'Tunai di Loket Madrasah') => {
    updatePaymentRecord(pay.id, {
      status: 'Lunas',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: method,
    });
    showNotice(`Tagihan ${pay.invoiceNumber} (${pay.studentName}) berhasil ditandai Lunas via ${method}.`, 'success');
  };

  const handleMarkAsUnpaid = (pay: PaymentRecord) => {
    updatePaymentRecord(pay.id, {
      status: 'Belum Bayar',
      paymentDate: undefined,
      paymentMethod: undefined,
    });
    showNotice(`Tagihan ${pay.invoiceNumber} dikembalikan ke status Belum Bayar.`, 'info');
  };

  const handleSaveFinanceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      monthlyTuitionFee: Number(tempTuitionFee),
      bankName: tempBankName,
      bankAccountNumber: tempAccountNo,
      bankAccountHolder: tempAccountHolder,
    });
    setIsSettingsModalOpen(false);
    showNotice('Pengaturan tarif SPP & rekening kas madrasah berhasil diperbarui.', 'success');
  };

  const monthsList = [
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  ];

  return (
    <div className="space-y-6">
      {/* Notice Toast */}
      {notice && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in ${
            notice.type === 'success'
              ? 'bg-emerald-600 text-white'
              : notice.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-800 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-white/80 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Banner & Quick Stats */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full text-xs font-extrabold mb-1">
              <CreditCard size={12} className="text-emerald-700" />
              <span>Manajemen Keuangan & SPP Madrasah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Pusat Pengelolaan SPP & Kas Syariah
            </h2>
            <p className="text-xs text-slate-500">
              Pengaturan nominal iuran madrasah, penerbitan tagihan bulanan, pencatatan transaksi loket/digital, dan kwitansi resmi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Building size={14} className="text-slate-600" />
              <span>Atur Tarif & Rekening BSI</span>
            </button>

            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Terbitkan Tagihan Masal</span>
            </button>

            <button
              onClick={() => setIsManualPaymentModalOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Catat Pembayaran Loket</span>
            </button>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Total Dana Terkumpul (Lunas)
            </span>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              Rp {totalCollected.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 size={13} />
              {paidInvoices.length} tagihan telah lunas
            </span>
          </div>

          <div className="bg-rose-50/60 border border-rose-100 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              Total Tunggakan SPP
            </span>
            <div className="text-2xl font-black text-rose-950 mt-1">
              Rp {totalOutstanding.toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-rose-700 font-medium mt-1 flex items-center gap-1">
              <Clock size={13} />
              {unpaidInvoices.length} tagihan belum dibayar
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Persentase Kelunasan
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {paymentRate}%
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${paymentRate}%` }}
              />
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Tarif SPP Aktif (Bulanan)
            </span>
            <div className="text-2xl font-black text-amber-950 mt-1">
              Rp {(settings.monthlyTuitionFee || 650000).toLocaleString('id-ID')}
            </div>
            <span className="text-[11px] text-amber-800 font-medium mt-1 truncate block">
              {settings.bankName || 'BSI'} • {settings.bankAccountNumber || '7182903842'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Daftar Tagihan & Riwayat Transaksi SPP</h3>
            <p className="text-xs text-slate-500">
              Total {filteredPayments.length} catatan pembayaran ditampilkan
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa / invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="Lunas">✅ Lunas</option>
              <option value="Belum Bayar">⏳ Belum Bayar</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="ALL">Semua Kelas</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            {/* Month Filter */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="ALL">Semua Bulan</option>
              {monthsList.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">No. Invoice</th>
                <th className="py-3 px-3">Santri / Siswa</th>
                <th className="py-3 px-3">Kelas</th>
                <th className="py-3 px-3">Bulan / Tahun</th>
                <th className="py-3 px-3">Nominal Tagihan</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Metode & Tgl Lunas</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data tagihan SPP sesuai filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono font-bold text-emerald-800">
                      {pay.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{pay.studentName}</span>
                      <span className="text-[10px] text-slate-400">ID: {pay.studentId}</span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                        {pay.className}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {pay.month} {pay.year}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      Rp {pay.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          pay.status === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pay.status === 'Lunas' ? (
                          <>
                            <CheckCircle2 size={12} />
                            <span>Lunas</span>
                          </>
                        ) : (
                          <>
                            <Clock size={12} />
                            <span>Belum Bayar</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {pay.status === 'Lunas' ? (
                        <div>
                          <span className="font-semibold text-slate-800 block text-[11px]">
                            {pay.paymentMethod || 'Terverifikasi'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {pay.paymentDate || 'Terbayar'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {pay.status === 'Belum Bayar' ? (
                          <button
                            onClick={() => handleMarkAsPaid(pay)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs transition cursor-pointer"
                            title="Tandai Lunas Tunai di Loket"
                          >
                            Set Lunas
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => setPrintReceiptPayment(pay)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                              title="Cetak Kwitansi Pembayaran"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              onClick={() => handleMarkAsUnpaid(pay)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-[10px] transition cursor-pointer"
                              title="Kembalikan ke Status Belum Bayar"
                            >
                              Batal Lunas
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setConfirmDeleteId(pay.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus Tagihan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TERBITKAN TAGIHAN MASAL BULANAN */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Terbitkan Tagihan SPP Masal</h3>
                  <p className="text-[11px] text-slate-500">Generate invoice untuk seluruh santri aktif</p>
                </div>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
                <p className="font-bold text-emerald-900">Informasi Tarif Aktif:</p>
                <p className="text-emerald-800">
                  Tagihan akan dibuat sebesar <strong>Rp {(settings.monthlyTuitionFee || 650000).toLocaleString('id-ID')}</strong> per santri untuk seluruh santri yang belum memiliki invoice di bulan yang dipilih.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Bulan Tagihan:</label>
                <select
                  value={generateMonth}
                  onChange={(e) => setGenerateMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                >
                  {monthsList.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tahun:</label>
                <input
                  type="number"
                  value={generateYear}
                  onChange={(e) => setGenerateYear(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleGenerateInvoices}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Proses Penerbitan Tagihan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CATAT PEMBAYARAN MANUAL / LOKET */}
      {isManualPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Receipt size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Catat Pembayaran SPP (Loket/Manual)</h3>
                  <p className="text-[11px] text-slate-500">Pencatatan pembayaran langsung di kantor tata usaha madrasah</p>
                </div>
              </div>
              <button
                onClick={() => setIsManualPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateManualPayment} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Pilih Siswa / Santri *</label>
                <select
                  required
                  value={manualStudentId}
                  onChange={(e) => setManualStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                >
                  <option value="">-- Pilih Santri --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.className}) - NISN: {s.nisn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bulan *</label>
                  <select
                    value={manualMonth}
                    onChange={(e) => setManualMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                  >
                    {monthsList.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun *</label>
                  <input
                    type="number"
                    value={manualYear}
                    onChange={(e) => setManualYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Jumlah Pembayaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Pembayaran</label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                  >
                    <option value="Lunas">✅ Langsung Lunas</option>
                    <option value="Belum Bayar">⏳ Buat Tagihan (Belum Bayar)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Metode Bayar</label>
                  <select
                    value={manualMethod}
                    onChange={(e) => setManualMethod(e.target.value)}
                    disabled={manualStatus !== 'Lunas'}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none disabled:opacity-50"
                  >
                    <option value="Tunai di Loket Madrasah">Tunai di Loket Madrasah</option>
                    <option value="Transfer Bank BSI">Transfer Bank BSI</option>
                    <option value="QRIS Madrasah">QRIS Madrasah</option>
                    <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                    <option value="BCA Virtual Account">BCA Virtual Account</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualPaymentModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PENGATURAN TARIF & REKENING BSI */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Building size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Pengaturan Tarif SPP & Kas BSI</h3>
                  <p className="text-[11px] text-slate-500">Rekening tujuan transfer yang muncul di akun wali murid</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveFinanceSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tarif SPP Standar Bulanan (Rp) *</label>
                <input
                  type="number"
                  required
                  value={tempTuitionFee}
                  onChange={(e) => setTempTuitionFee(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Nominal default saat menerbitkan tagihan bulanan baru.</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Bank Kas SPP *</label>
                <input
                  type="text"
                  required
                  value={tempBankName}
                  onChange={(e) => setTempBankName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Rekening Bank *</label>
                <input
                  type="text"
                  required
                  value={tempAccountNo}
                  onChange={(e) => setTempAccountNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Atas Nama Rekening (Yayasan/Madrasah) *</label>
                <input
                  type="text"
                  required
                  value={tempAccountHolder}
                  onChange={(e) => setTempAccountHolder(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CETAK KWITANSI RESMI MADRASAH */}
      {printReceiptPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in">
            {/* Kwitansi Printable Frame */}
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={settings.logoUrl || '/images/logo-yayasan-rpi.svg'}
                    alt="Logo RPI"
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <h4 className="font-black text-sm text-slate-900">MI RPI JAKARTA</h4>
                    <p className="text-[10px] text-slate-500">Yayasan Rumah Pendidikan Islam</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                    Kwitansi Lunas
                  </span>
                  <p className="font-mono text-[10px] text-slate-400 mt-1">{printReceiptPayment.invoiceNumber}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Telah diterima dari:</span>
                  <strong className="text-slate-900">{printReceiptPayment.studentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kelas / Tingkat:</span>
                  <span className="font-semibold text-slate-800">{printReceiptPayment.className}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Untuk Pembayaran:</span>
                  <span className="font-semibold text-slate-800">SPP Bulan {printReceiptPayment.month} {printReceiptPayment.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode & Waktu Bayar:</span>
                  <span className="font-semibold text-slate-800">{printReceiptPayment.paymentMethod || 'Kasir Loket'} • {printReceiptPayment.paymentDate}</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center mt-2">
                  <span className="font-bold text-slate-700">Jumlah Pembayaran:</span>
                  <span className="font-black text-emerald-800 text-base">
                    Rp {printReceiptPayment.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-3 text-[10px] text-slate-400">
                <div>
                  <p>Jl. HR. Rasuna Said Kav. X2-2, Kuningan Timur</p>
                  <p>DKI Jakarta 12950 • NPSN: {settings.npsn}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-emerald-800">Stempel Sah Digital</p>
                  <div className="w-16 h-8 border border-emerald-300 rounded mx-auto flex items-center justify-center text-[9px] text-emerald-700 font-bold bg-emerald-50/50">
                    VERIFIED
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setPrintReceiptPayment(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} />
                <span>Cetak / Print PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: CONFIRM DELETE */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 size={20} />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-sm text-slate-900">Hapus Catatan Tagihan?</h4>
              <p className="text-xs text-slate-500">
                Catatan invoice ini akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deletePaymentRecord(confirmDeleteId);
                  setConfirmDeleteId(null);
                  showNotice('Catatan tagihan berhasil dihapus.', 'info');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
