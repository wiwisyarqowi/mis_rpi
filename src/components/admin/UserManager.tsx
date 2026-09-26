import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Key,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  Share2,
  Printer,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit,
  Send,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { UserAccount, UserRole } from '../../types';

export const UserManager: React.FC = () => {
  const {
    userAccounts,
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    resetUserPassword,
    generateBatchTeacherAccounts,
    generateBatchParentAccounts,
    teachers,
    students,
    settings,
  } = useSchool();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  // Modals & Panels
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [printCardAccount, setPrintCardAccount] = useState<UserAccount | null>(null);
  const [deleteAccountTarget, setDeleteAccountTarget] = useState<UserAccount | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPasswordIds, setShowPasswordIds] = useState<Record<string, boolean>>({});
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  // New Account Form State
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('GURU');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNip, setFormNip] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formStudentName, setFormStudentName] = useState('');
  const [formClassName, setFormClassName] = useState('Kelas 4A');
  const [formSubject, setFormSubject] = useState('Pendidikan Agama Islam');
  const [formStatus, setFormStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Toggle show password
  const toggleShowPassword = (id: string) => {
    setShowPasswordIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy to clipboard
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Generate random strong password
  const generateRandomPassword = (role: UserRole) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    switch (role) {
      case 'BENDAHARA':
        return `BendaharaRPI#${randomNum}`;
      case 'GURU':
        return `GuruRPI#${randomNum}`;
      case 'ORANG_TUA':
        return `WaliRPI#${randomNum}`;
      case 'SISWA':
        return `Santri#${randomNum}`;
      default:
        return `RPI#${randomNum}!`;
    }
  };

  // Open modal with pre-generated password
  const openNewAccountModal = () => {
    setFormName('');
    setFormUsername('');
    setFormRole('GURU');
    setFormPassword(generateRandomPassword('GURU'));
    setFormEmail('');
    setFormPhone('');
    setFormNip('');
    setFormNisn('');
    setFormStudentName('');
    setFormClassName('Kelas 4A');
    setFormSubject('Pendidikan Agama Islam');
    setFormStatus('Aktif');
    setIsAddModalOpen(true);
  };

  // Submit New Account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formUsername || !formPassword) {
      alert('Nama, Username, dan Kata Sandi wajib diisi!');
      return;
    }

    addUserAccount({
      name: formName,
      username: formUsername,
      password: formPassword,
      role: formRole,
      email: formEmail,
      phone: formPhone,
      nip: formRole === 'GURU' ? formNip || formUsername : undefined,
      nisn: formRole === 'ORANG_TUA' || formRole === 'SISWA' ? formNisn || formUsername : undefined,
      studentName: formRole === 'ORANG_TUA' ? formStudentName : undefined,
      className: formClassName,
      subject: formRole === 'GURU' ? formSubject : undefined,
      status: formStatus,
    });

    setIsAddModalOpen(false);
  };

  // Quick WhatsApp Share
  const handleSendWhatsApp = (acc: UserAccount) => {
    let cleanPhone = (acc.phone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const message = encodeURIComponent(
      `*INFORMASI AKUN RESMI PORTAL MI RPI JAKARTA*\n\n` +
      `Assalamu'alaikum Wr. Wb.\n` +
      `Yth. Bapak/Ibu *${acc.name}*,\n\n` +
      `Berikut adalah data kredensial akun Anda pada Sistem Terpadu Madrasah Ibtidaiyah RPI Jakarta:\n` +
      `• *Peran Akses:* ${acc.role === 'GURU' ? 'Guru / Asatidz' : acc.role === 'ORANG_TUA' ? `Orang Tua / Wali (Santri: ${acc.studentName || '-'})` : acc.role}\n` +
      `• *Username / ID:* \`${acc.username}\`\n` +
      `• *Kata Sandi Awal:* \`${acc.password}\`\n` +
      `• *Tautan Portal:* https://ais-pre-qpfnbwunnglx7da72t4hqd-235227974204.asia-east1.run.app\n\n` +
      `Mohon segera masuk dan jaga kerahasiaan kata sandi Anda.\n` +
      `Jika ada kendala akses, silakan hubungi Tata Usaha MI RPI Jakarta.\n\n` +
      `Wassalamu'alaikum Wr. Wb.\n` +
      `_Pusat Data & Sistem IT MI RPI Jakarta_`
    );

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    } else {
      // Prompt if phone is missing
      const inputPhone = prompt('Masukkan nomor WhatsApp (contoh: 081234567890):');
      if (inputPhone) {
        let p = inputPhone.replace(/[^0-9]/g, '');
        if (p.startsWith('0')) p = '62' + p.slice(1);
        window.open(`https://wa.me/${p}?text=${message}`, '_blank');
      }
    }
  };

  // Reset password single action
  const handleReset = (acc: UserAccount) => {
    const newPass = prompt(`Reset kata sandi untuk ${acc.name}. Masukkan sandi baru (kosongkan untuk sandi otomatis):`);
    if (newPass !== null) {
      const generated = resetUserPassword(acc.id, newPass || undefined);
      alert(`Kata sandi untuk ${acc.name} berhasil diubah menjadi: ${generated}`);
    }
  };

  // Filter accounts
  const filteredAccounts = userAccounts.filter((acc) => {
    const matchSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.email && acc.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.studentName && acc.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.nip && acc.nip.includes(searchQuery)) ||
      (acc.nisn && acc.nisn.includes(searchQuery));

    const matchRole = roleFilter === 'ALL' ? true : acc.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Role counters
  const totalGuru = userAccounts.filter((a) => a.role === 'GURU').length;
  const totalOrtu = userAccounts.filter((a) => a.role === 'ORANG_TUA').length;
  const totalSiswa = userAccounts.filter((a) => a.role === 'SISWA').length;
  const totalAdmin = userAccounts.filter((a) => a.role === 'ADMIN' || a.role === 'KEPALA_MADRASAH').length;

  return (
    <div className="space-y-6">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
            👩‍🏫
          </div>
          <div>
            <p className="text-xl font-black text-slate-900">{totalGuru}</p>
            <p className="text-[11px] font-semibold text-slate-500">Akun Guru & GTK</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
            👨‍👩‍👧
          </div>
          <div>
            <p className="text-xl font-black text-slate-900">{totalOrtu}</p>
            <p className="text-[11px] font-semibold text-slate-500">Akun Orang Tua</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
            👦
          </div>
          <div>
            <p className="text-xl font-black text-slate-900">{totalSiswa}</p>
            <p className="text-[11px] font-semibold text-slate-500">Akun Santri</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
            ⚙️
          </div>
          <div>
            <p className="text-xl font-black text-slate-900">{totalAdmin}</p>
            <p className="text-[11px] font-semibold text-slate-500">Admin & Pimpinan</p>
          </div>
        </div>
      </div>

      {/* Notice Banner if batch generated */}
      {batchNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{batchNotice}</span>
          </div>
          <button onClick={() => setBatchNotice(null)} className="text-emerald-700 font-bold hover:underline">
            Tutup
          </button>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Pusat Pembuatan & Pengelolaan Akun Pengguna
            </h3>
            <p className="text-xs text-slate-500">
              Buat username dan kata sandi untuk Dewan Guru, Orang Tua, dan Santri serta kirimkan via WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openNewAccountModal}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus size={15} />
              <span>+ Buat Akun Baru</span>
            </button>

            {/* Batch Generates */}
            <button
              onClick={() => {
                const count = generateBatchTeacherAccounts();
                setBatchNotice(
                  count > 0
                    ? `Berhasil membuat ${count} akun Guru baru dari database GTK!`
                    : 'Seluruh dewan guru terdaftar sudah memiliki akun.'
                );
              }}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Generate akun otomatis untuk semua guru di data GTK"
            >
              <Sparkles size={14} className="text-blue-600" />
              <span>Auto-Generate Akun Guru</span>
            </button>

            <button
              onClick={() => {
                const count = generateBatchParentAccounts();
                setBatchNotice(
                  count > 0
                    ? `Berhasil membuat ${count} akun Orang Tua baru dari data Santri!`
                    : 'Seluruh orang tua santri sudah memiliki akun terdaftar.'
                );
              }}
              className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl border border-teal-200 transition flex items-center gap-1.5 cursor-pointer"
              title="Generate akun otomatis untuk semua orang tua santri"
            >
              <Sparkles size={14} className="text-teal-600" />
              <span>Auto-Generate Akun Orang Tua</span>
            </button>
          </div>
        </div>

        {/* Search & Role Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            {[
              { id: 'ALL', label: 'Semua Akun' },
              { id: 'BENDAHARA', label: '💳 Bendahara' },
              { id: 'GURU', label: '👩‍🏫 Guru' },
              { id: 'ORANG_TUA', label: '👨‍👩‍👧 Orang Tua' },
              { id: 'SISWA', label: '👦 Santri' },
              { id: 'ADMIN', label: '⚙️ Admin' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRoleFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  roleFilter === f.id
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, NIP, NISN, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Table List of Accounts */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Nama Lengkap & Peran</th>
                <th className="py-3 px-4">Username / ID Masuk</th>
                <th className="py-3 px-4">Kata Sandi</th>
                <th className="py-3 px-4">Kelas / Subjek</th>
                <th className="py-3 px-4">Kontak WA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi / Kirim Akun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ditemukan data akun pengguna yang cocok.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => {
                  const isPassVisible = !!showPasswordIds[acc.id];
                  return (
                    <tr key={acc.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Role */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold shrink-0">
                            {acc.role === 'GURU' ? '👩‍🏫' : acc.role === 'ORANG_TUA' ? '👨‍👩‍👧' : acc.role === 'SISWA' ? '👦' : acc.role === 'BENDAHARA' ? '💳' : '⚙️'}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900">{acc.name}</p>
                            <span
                              className={`inline-block text-[9px] font-extrabold px-2 py-0.2 rounded-md ${
                                acc.role === 'GURU'
                                  ? 'bg-blue-100 text-blue-800'
                                  : acc.role === 'ORANG_TUA'
                                  ? 'bg-teal-100 text-teal-800'
                                  : acc.role === 'SISWA'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : acc.role === 'BENDAHARA'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {acc.role === 'GURU'
                                ? 'GURU / PENDIDIK'
                                : acc.role === 'ORANG_TUA'
                                ? `WALI SANTRI (${acc.studentName || '-'})`
                                : acc.role === 'SISWA'
                                ? 'SANTRI'
                                : acc.role === 'BENDAHARA'
                                ? 'BENDAHARA MADRASAH'
                                : acc.role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <code className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono text-[11px] font-bold">
                            {acc.username}
                          </code>
                          <button
                            onClick={() => handleCopy(acc.username, `u-${acc.id}`)}
                            title="Salin Username"
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition"
                          >
                            {copiedId === `u-${acc.id}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                        {acc.nip && <span className="text-[10px] text-slate-400 block mt-0.5">NIP: {acc.nip}</span>}
                        {acc.nisn && <span className="text-[10px] text-slate-400 block mt-0.5">NISN: {acc.nisn}</span>}
                      </td>

                      {/* Password */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <code className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono text-[11px] font-bold">
                            {isPassVisible ? acc.password : '••••••••'}
                          </code>
                          <button
                            onClick={() => toggleShowPassword(acc.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition"
                            title={isPassVisible ? 'Sembunyikan' : 'Lihat Sandi'}
                          >
                            {isPassVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                          </button>
                          <button
                            onClick={() => handleCopy(acc.password, `p-${acc.id}`)}
                            title="Salin Sandi"
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition"
                          >
                            {copiedId === `p-${acc.id}` ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </td>

                      {/* Class or Subject */}
                      <td className="py-3 px-4">
                        <span className="text-slate-700 font-medium">
                          {acc.className || acc.subject || '-'}
                        </span>
                        {acc.subject && acc.className && (
                          <span className="text-[10px] text-slate-400 block">
                            {acc.subject}
                          </span>
                        )}
                      </td>

                      {/* Phone / WA */}
                      <td className="py-3 px-4">
                        {acc.phone ? (
                          <span className="text-slate-700 font-mono text-[11px] flex items-center gap-1">
                            <Phone size={11} className="text-slate-400" />
                            {acc.phone}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const newStatus = acc.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
                            updateUserAccount(acc.id, { status: newStatus });
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition ${
                            acc.status === 'Aktif'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          }`}
                        >
                          {acc.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Send WhatsApp */}
                          <button
                            onClick={() => handleSendWhatsApp(acc)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg transition"
                            title="Kirim Akun ke WhatsApp Guru / Wali Murid"
                          >
                            <Send size={13} />
                          </button>

                          {/* Print Account Card */}
                          <button
                            onClick={() => setPrintCardAccount(acc)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg transition"
                            title="Cetak Lembar Kartu Login"
                          >
                            <Printer size={13} />
                          </button>

                          {/* Reset Password */}
                          <button
                            onClick={() => handleReset(acc)}
                            className="p-1.5 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-lg transition"
                            title="Reset Kata Sandi"
                          >
                            <RefreshCw size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteAccountTarget(acc)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-lg transition cursor-pointer"
                            title="Hapus Akun"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL TAMBAH AKUN BARU ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Formulir Administrator
              </span>
              <h3 className="text-lg font-bold mt-1">Buat Akun Portal Baru</h3>
              <p className="text-xs text-emerald-100">
                Pilih peran dan buatkan username & kata sandi resmi untuk guru atau orang tua.
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 space-y-4 text-xs">
              {/* Role Select */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Peran Akun *</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'BENDAHARA', label: '💳 Bendahara' },
                    { id: 'GURU', label: '👩‍🏫 Guru' },
                    { id: 'ORANG_TUA', label: '👨‍👩‍👧 Ortu' },
                    { id: 'SISWA', label: '👦 Siswa' },
                    { id: 'ADMIN', label: '⚙️ Admin' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setFormRole(r.id as any);
                        setFormPassword(generateRandomPassword(r.id as any));
                      }}
                      className={`py-2 px-2 rounded-xl font-bold transition text-center ${
                        formRole === r.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder={
                    formRole === 'GURU'
                      ? 'Contoh: Ustadz Ahmad Fauzi, S.Pd.I'
                      : formRole === 'ORANG_TUA'
                      ? 'Contoh: Ibu Fatimah Zahra, S.E.'
                      : 'Nama lengkap...'
                  }
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Username / ID Masuk *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      formRole === 'GURU'
                        ? 'NIP / 19880415...'
                        : formRole === 'ORANG_TUA'
                        ? 'NISN Santri / 009283...'
                        : 'username'
                    }
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                    <span>Kata Sandi *</span>
                    <button
                      type="button"
                      onClick={() => setFormPassword(generateRandomPassword(formRole))}
                      className="text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      Acak Ulang
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Specific fields for Orang Tua */}
              {formRole === 'ORANG_TUA' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-50/60 p-3 rounded-2xl border border-teal-100">
                  <div>
                    <label className="font-bold text-teal-900 block mb-1">Nama Ananda (Santri) *</label>
                    <input
                      type="text"
                      placeholder="Nama ananda..."
                      value={formStudentName}
                      onChange={(e) => setFormStudentName(e.target.value)}
                      className="w-full bg-white border border-teal-200 p-2 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-teal-900 block mb-1">Kelas Santri</label>
                    <select
                      value={formClassName}
                      onChange={(e) => setFormClassName(e.target.value)}
                      className="w-full bg-white border border-teal-200 p-2 rounded-xl outline-none"
                    >
                      {['Kelas 1A', 'Kelas 1B', 'Kelas 2A', 'Kelas 2B', 'Kelas 3A', 'Kelas 3B', 'Kelas 4A', 'Kelas 4B', 'Kelas 5A', 'Kelas 5B', 'Kelas 6A', 'Kelas 6B'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Specific fields for Guru */}
              {formRole === 'GURU' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-blue-50/60 p-3 rounded-2xl border border-blue-100">
                  <div>
                    <label className="font-bold text-blue-900 block mb-1">Mata Pelajaran Diampu</label>
                    <input
                      type="text"
                      placeholder="Contoh: PAI / Sains / Robotika"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      className="w-full bg-white border border-blue-200 p-2 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-blue-900 block mb-1">Wali Kelas (Jika Ada)</label>
                    <select
                      value={formClassName}
                      onChange={(e) => setFormClassName(e.target.value)}
                      className="w-full bg-white border border-blue-200 p-2 rounded-xl outline-none"
                    >
                      <option value="">Bukan Wali Kelas</option>
                      {['Kelas 1A', 'Kelas 1B', 'Kelas 2A', 'Kelas 2B', 'Kelas 3A', 'Kelas 3B', 'Kelas 4A', 'Kelas 4B', 'Kelas 5A', 'Kelas 5B', 'Kelas 6A', 'Kelas 6B'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    No. WhatsApp (Untuk Pengiriman Akun)
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email (Opsional)</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan & Terbitkan Akun</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CETAK KARTU LOGIN ================= */}
      {printCardAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            {/* Header Modal */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Printer size={14} className="text-emerald-400" />
                <span>Pratinjau Kartu Akses Portal Siswa / Guru / Ortu</span>
              </span>
              <button
                onClick={() => setPrintCardAccount(null)}
                className="text-slate-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Printable Card */}
            <div className="p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 space-y-4 border-b border-slate-200" id="printable-card">
              {/* Kop Surat Madrasah */}
              <div className="flex items-center gap-3 pb-3 border-b-2 border-emerald-800/40">
                <img
                  src={settings.logoUrl || '/images/logo-yayasan-rpi.svg'}
                  alt="Logo"
                  className="w-12 h-12 object-contain shrink-0"
                />
                <div>
                  <h4 className="font-extrabold text-[12px] text-emerald-950 uppercase tracking-tight leading-tight">
                    {settings.foundation}
                  </h4>
                  <h3 className="font-black text-sm text-emerald-800 leading-tight">
                    {settings.schoolName}
                  </h3>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                    NPSN: {settings.npsn} • Akreditasi {settings.accreditation} (Unggul)
                  </p>
                </div>
              </div>

              {/* Title Card */}
              <div className="text-center py-1 bg-emerald-800 text-white rounded-lg">
                <p className="text-[11px] font-extrabold uppercase tracking-wider">
                  KARTU AKSES PORTAL TERPADU {settings.academicYear || '2027/2028'}
                </p>
              </div>

              {/* Account Data */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
                <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px]">Nama Pengguna:</span>
                  <span className="font-bold text-slate-900">{printCardAccount.name}</span>
                </div>
                <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px]">Peran Portal:</span>
                  <span className="font-bold text-emerald-800">
                    {printCardAccount.role === 'GURU'
                      ? 'Guru / Asatidz'
                      : printCardAccount.role === 'ORANG_TUA'
                      ? `Wali Murid (${printCardAccount.studentName || '-'})`
                      : printCardAccount.role}
                  </span>
                </div>
                {printCardAccount.className && (
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                    <span className="text-slate-500 text-[11px]">Kelas:</span>
                    <span className="font-semibold text-slate-700">{printCardAccount.className}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px]">Username / ID Masuk:</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {printCardAccount.username}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[11px]">Kata Sandi Awal:</span>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {printCardAccount.password}
                  </span>
                </div>
              </div>

              {/* Security advice */}
              <div className="text-[10px] text-slate-500 bg-slate-100 p-2.5 rounded-xl space-y-1">
                <p className="font-bold text-slate-700">Petunjuk Penggunaan:</p>
                <p>1. Buka tautan website MI RPI Jakarta lalu klik menu "Masuk Portal".</p>
                <p>2. Masukkan Username dan Kata Sandi di atas dengan teliti.</p>
                <p>3. Harap segera ganti kata sandi setelah Anda berhasil masuk ke portal.</p>
              </div>
            </div>

            {/* Print Buttons */}
            <div className="p-4 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setPrintCardAccount(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Cetak Kartu Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Konfirmasi Hapus Akun (In-App Modal) */}
      {deleteAccountTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Trash2 size={24} className="text-white" />
              </div>
              <div>
                <span className="bg-white/25 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Konfirmasi Hapus Akun
                </span>
                <h3 className="text-base font-bold mt-1">Hapus Akun Pengguna</h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  Pengguna ini tidak akan bisa login lagi ke portal.
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950">
                <p className="text-slate-600 font-medium mb-1">
                  Yakin ingin menghapus akun berikut?
                </p>
                <p className="font-bold text-sm text-rose-800">
                  {deleteAccountTarget.name} ({deleteAccountTarget.role})
                </p>
                <p className="font-mono text-[11px] text-slate-500 mt-1">
                  Username: @{deleteAccountTarget.username}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteAccountTarget(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteUserAccount(deleteAccountTarget.id);
                    setDeleteAccountTarget(null);
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>Ya, Hapus Akun</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
