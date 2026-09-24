import React, { useState } from 'react';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  CreditCard,
  Printer,
  MessageCircle,
  FileSpreadsheet,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const ParentPortal: React.FC = () => {
  const {
    settings,
    students,
    attendance,
    grades,
    payments,
    payTuition,
    characterRecords,
    worshipLogs,
    notifications,
  } = useSchool();

  const student = students[0]; // Ananda Muhammad Al Fatih
  const [activeTab, setActiveTab] = useState<'presensi' | 'rapor' | 'keuangan' | 'ibadah' | 'konseling'>('presensi');
  const [showPayModal, setShowPayModal] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState('BSI Virtual Account');

  // Handle Pay SPP
  const handleConfirmPayment = (invoiceNumber: string) => {
    payTuition(invoiceNumber, selectedMethod);
    setShowPayModal(null);
  };

  const studentGrades = grades.filter((g) => g.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const studentPayments = payments.filter((p) => p.studentId === student.id);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Ananda */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-teal-300 shadow-md">
              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="bg-teal-950/70 text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30 uppercase">
                Wali Murid Terverifikasi
              </span>
              <h1 className="text-2xl font-black mt-1">{student.name}</h1>
              <p className="text-xs text-teal-100">
                {student.className} • NISN: {student.nisn} • Wali Kelas: Ustadz Ahmad Fauzi, S.Pd.I
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Assalamu'alaikum Ustadz Ahmad Fauzi, saya wali murid dari ananda ${student.name}.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white text-emerald-900 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <MessageCircle size={16} className="text-emerald-700" />
              <span>Hubungi Wali Kelas</span>
            </a>
          </div>
        </div>

        {/* Notifications Bar */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs text-emerald-900 font-medium">
              <strong>Pemberitahuan Terbaru:</strong> {notifications[0]?.message || 'Ananda telah hadir di sekolah.'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold shrink-0">Real-time Sync</span>
        </div>

        {/* Tabs Bar */}
        <div className="flex justify-start overflow-x-auto pb-2 no-scrollbar">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs inline-flex gap-1">
            {[
              { id: 'presensi', label: 'Presensi & Kehadiran', icon: Clock },
              { id: 'rapor', label: 'e-Rapor & Nilai Akademik', icon: FileSpreadsheet },
              { id: 'keuangan', label: 'SPP & Keuangan Digital', icon: CreditCard },
              { id: 'ibadah', label: 'Jurnal Ibadah & Karakter', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: PRESENSI REAL-TIME */}
        {activeTab === 'presensi' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Rekap Presensi Harian Ananda</h3>
                <p className="text-xs text-slate-500">Notifikasi kehadiran langsung tercatat saat ananda tiba di sekolah</p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                Kehadiran Bulan Ini: 100%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Status Kehadiran</th>
                    <th className="py-3 px-4">Waktu Check-in</th>
                    <th className="py-3 px-4">Catatan Guru Piket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentAttendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{rec.date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          rec.status === 'Hadir'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-emerald-800 font-mono font-semibold">{rec.timeRecorded}</td>
                      <td className="py-3.5 px-4 text-slate-600">{rec.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: E-RAPOR & NILAI */}
        {activeTab === 'rapor' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo-yayasan-rpi.svg"
                  alt="Logo MI RPI"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Transkrip e-Rapor Kurikulum Merdeka Kemenag</h3>
                  <p className="text-xs text-slate-500">{settings.schoolName} • Semester Ganjil TA {settings.academicYear}</p>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 self-start"
              >
                <Printer size={15} />
                <span>Cetak e-Rapor Resmi</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Mata Pelajaran</th>
                    <th className="py-3 px-4">Formatif</th>
                    <th className="py-3 px-4">Sumatif</th>
                    <th className="py-3 px-4">PTS</th>
                    <th className="py-3 px-4">PAS</th>
                    <th className="py-3 px-4">Nilai Akhir</th>
                    <th className="py-3 px-4">Predikat</th>
                    <th className="py-3 px-4">Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentGrades.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{g.subject}</td>
                      <td className="py-3.5 px-4">{g.formatif1}</td>
                      <td className="py-3.5 px-4">{g.sumatifLingkupMateri}</td>
                      <td className="py-3.5 px-4">{g.pts}</td>
                      <td className="py-3.5 px-4">{g.pas}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800 text-sm">{g.finalScore}</td>
                      <td className="py-3.5 px-4">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                          {g.predicate}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-[11px] max-w-xs">{g.competencyAchievement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: KEUANGAN & SPP DIGITAL */}
        {activeTab === 'keuangan' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Payment Modal */}
            {showPayModal && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-base text-slate-900">
                    Konfirmasi Pembayaran SPP Tagihan: {showPayModal}
                  </h3>
                  <button onClick={() => setShowPayModal(null)} className="text-xs text-slate-400">
                    Batal
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs">
                  <p>Nama Siswa: <strong>{student.name} ({student.className})</strong></p>
                  <p>Jumlah Tagihan: <strong className="text-emerald-800 text-sm">Rp {settings.monthlyTuitionFee.toLocaleString('id-ID')}</strong></p>
                  <p>Rekening Tujuan: <strong>{settings.bankName} - {settings.bankAccountNumber} (a.n {settings.bankAccountHolder})</strong></p>
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Metode Pembayaran Digital:</label>
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="BSI Virtual Account">Bank Syariah Indonesia (BSI) Virtual Account</option>
                    <option value="QRIS Nasional">QRIS Bank Syariah / E-Wallet</option>
                    <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                    <option value="BCA Virtual Account">BCA Virtual Account</option>
                  </select>
                </div>

                <button
                  onClick={() => handleConfirmPayment(showPayModal)}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Bayar Sekarang (Simulasi Lunas Instan)
                </button>
              </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Riwayat & Tagihan SPP Bulanan</h3>
                  <p className="text-xs text-slate-500">Sistem pembayaran transparan tanpa biaya tersembunyi</p>
                </div>
              </div>

              <div className="space-y-3">
                {studentPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500">{pay.invoiceNumber}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          pay.status === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {pay.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">SPP Bulan {pay.month} {pay.year}</h4>
                      <p className="text-xs text-slate-500">
                        Nominal: <strong className="text-slate-800">Rp {pay.amount.toLocaleString('id-ID')}</strong>
                        {pay.paymentDate && ` • Lunas pada: ${pay.paymentDate} (${pay.paymentMethod})`}
                      </p>
                    </div>

                    {pay.status === 'Belum Bayar' ? (
                      <button
                        onClick={() => setShowPayModal(pay.invoiceNumber)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition whitespace-nowrap"
                      >
                        Bayar Sekarang
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 size={16} />
                        Lunas Terverifikasi
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IBADAH & KARAKTER */}
        {activeTab === 'ibadah' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Perkembangan Adab & Ibadah Ananda</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 text-emerald-800 uppercase">Apresiasi Karakter Terbaru</h4>
                {characterRecords.map((cp) => (
                  <div key={cp.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-emerald-800">{cp.dimension}</span>
                      <span className="text-[10px] text-slate-400">{cp.date}</span>
                    </div>
                    <p className="text-slate-600">"{cp.note}"</p>
                    <p className="text-[10px] text-slate-400 mt-1">Oleh: {cp.teacherName}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 text-teal-800 uppercase">Catatan Evaluasi Guru</h4>
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-2">
                  <p className="italic">
                    "Alhamdulillah ananda Muhammad Al Fatih memiliki semangat ibadah yang tinggi, sangat tertib shalat berjamaah, dan aktif membantu teman-temannya dalam tugas kelompok."
                  </p>
                  <p className="font-bold text-right text-[11px]">— Ustadz Ahmad Fauzi, S.Pd.I</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
