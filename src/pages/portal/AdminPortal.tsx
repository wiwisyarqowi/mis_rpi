import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
  Users,
  MessageSquare,
  FileText,
  Plus,
  Image as ImageIcon,
  GraduationCap,
  CreditCard,
  BookOpen,
  Trash2,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  Eye,
  Printer,
  Send,
  Search,
  Filter,
  Phone,
  Calendar,
  MapPin,
  School,
  UserCheck,
  Check,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolSettings, SPMBApplication, ComplaintTicket } from '../../types';
import { MediaManager } from '../../components/admin/MediaManager';
import { UserManager } from '../../components/admin/UserManager';
import { MasterDataManager } from '../../components/admin/MasterDataManager';
import { PaymentFinanceManager } from '../../components/admin/PaymentFinanceManager';
import { CurriculumProgramsManager } from '../../components/admin/CurriculumProgramsManager';
import { processImageFile, uploadImageToServer } from '../../utils/imageUpload';
import { PortalAccessGuard } from '../../components/common/PortalAccessGuard';

export const AdminPortal: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetSettingsToDefault,
    spmbApplications,
    updateSPMBStatus,
    complaints,
    updateComplaintStatus,
    addNewsArticle,
    news,
    deleteNewsArticle,
    viewParams,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'masterdata' | 'users' | 'finance' | 'media' | 'curriculum' | 'settings' | 'spmb' | 'suarawarga' | 'berita' | 'panduan' | 'backup'>(
    (viewParams?.tab as any) || 'panduan'
  );

  // Form Settings State
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Keep formData in sync when settings change (e.g. from MediaManager or other tabs)
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // New Article State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<any>('Berita Madrasah');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80');
  const [newsAuthor, setNewsAuthor] = useState('Humas MI RPI');
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // SPMB Management & Detail Modal State
  const [selectedSpmbApp, setSelectedSpmbApp] = useState<SPMBApplication | null>(null);
  const [spmbSearchQuery, setSpmbSearchQuery] = useState('');
  const [spmbStatusFilter, setSpmbStatusFilter] = useState<'ALL' | SPMBApplication['status']>('ALL');
  const [spmbNotesInput, setSpmbNotesInput] = useState('');
  const [spmbFeedback, setSpmbFeedback] = useState<string | null>(null);

  const handleOpenSpmbDetail = (app: SPMBApplication) => {
    setSelectedSpmbApp(app);
    setSpmbNotesInput(app.notes || '');
  };

  const handleSaveSpmbNotes = () => {
    if (!selectedSpmbApp) return;
    updateSPMBStatus(selectedSpmbApp.id, selectedSpmbApp.status, spmbNotesInput);
    setSelectedSpmbApp({ ...selectedSpmbApp, notes: spmbNotesInput });
    setSpmbFeedback('Catatan verifikasi formulir berhasil disimpan!');
    setTimeout(() => setSpmbFeedback(null), 3000);
  };

  const handleSendSpmbWhatsApp = (app: SPMBApplication) => {
    let cleanPhone = (app.parentPhone || '').replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const message = encodeURIComponent(
      `*PEMBERITAHUAN RESMI SPMB MI RPI JAKARTA*\n\n` +
      `Assalamu'alaikum Wr. Wb.\n` +
      `Yth. Bapak/Ibu *${app.parentName}*,\n` +
      `Orang Tua / Wali dari ananda *${app.studentName}*,\n\n` +
      `Panitia Penerimaan Murid Baru (SPMB) Madrasah Ibtidaiyah RPI Jakarta memberitahukan perkembangan status pendaftaran ananda:\n\n` +
      `• *Nomor Registrasi:* \`${app.registrationNumber}\`\n` +
      `• *Pilihan Program:* ${app.programChosen}\n` +
      `• *Status Saat Ini:* *${app.status.toUpperCase()}*\n` +
      (app.notes ? `• *Catatan Panitia:* ${app.notes}\n` : '') +
      `\n` +
      (app.status === 'Lolos Berkas' || app.status === 'Jadwal Observasi'
        ? `Mohon mempersiapkan ananda untuk tahapan observasi dan tes kemandirian/bacaan Qur'an di kampus MI RPI.\n\n`
        : app.status === 'Diterima'
        ? `Selamat atas diterimanya ananda di MI RPI Jakarta! Silakan lakukan proses administrasi daftar ulang.\n\n`
        : `Untuk informasi dan konfirmasi berkas lebih lanjut, silakan hubungi Panitia SPMB di Tata Usaha MI RPI.\n\n`) +
      `Wassalamu'alaikum Wr. Wb.\n` +
      `_Panitia SPMB MI RPI Jakarta_`
    );

    if (cleanPhone) {
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    } else {
      alert('Nomor WhatsApp orang tua tidak terdaftar.');
    }
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      ...formData,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetSettings = () => {
    resetSettingsToDefault();
    setFormData(settings);
    setShowResetModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSummary) return;

    addNewsArticle({
      title: newsTitle,
      category: newsCategory,
      summary: newsSummary,
      content: newsContent || newsSummary,
      author: newsAuthor,
      date: new Date().toISOString().split('T')[0],
      imageUrl: newsImage,
      tags: ['MI RPI', newsCategory],
    });

    setNewsSuccess(true);
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    setTimeout(() => setNewsSuccess(false), 3000);
  };

  return (
    <PortalAccessGuard
      requiredRole={['ADMIN', 'SUPER_ADMIN']}
      portalName="Pusat Kendali Admin"
      loginTab="ADMIN"
    >
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Admin */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Super Admin & Pengaturan Sistem
            </span>
            <h1 className="text-2xl font-black mt-1">Pusat Kendali MI RPI Jakarta</h1>
            <p className="text-xs text-slate-300">
              Pengaturan metadata sekolah, verifikasi SPMB, kurasi konten berita, dan layanan pengaduan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-900/60 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-300 font-bold">
              Versi Platform: 3.1 Enterprise
            </span>
          </div>
        </div>

        {/* PUSAT UNDUHAN FILE CPANEL (SELALU TAMPIL DI ATAS) */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border-2 border-emerald-400/40">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/30">
                <Download size={14} />
                <span>Pusat Unduhan File Deployment cPanel Rumahweb</span>
              </div>
              <h2 className="text-xl font-black text-white">
                📦 File Unduhan Lengkap Website (Siap Upload ke cPanel)
              </h2>
              <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
                Klik tombol di samping untuk langsung mengunduh seluruh file website yang siap diekstrak di cPanel Rumahweb Anda:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="/cpanel-lengkap-misrpijakarta.zip"
                download="cpanel-lengkap-misrpijakarta.zip"
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center gap-2.5 cursor-pointer"
              >
                <Download size={18} className="text-slate-950" />
                <div className="text-left">
                  <div className="leading-tight font-black">Unduh Paket Lengkap (.ZIP)</div>
                  <div className="text-[10px] font-semibold text-emerald-950 opacity-90">1.8 MB • Node.js + DB + Dist</div>
                </div>
              </a>

              <a
                href="/website-misrpijakarta-siap-cpanel.zip"
                download="website-misrpijakarta-siap-cpanel.zip"
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 transition flex items-center gap-2.5 cursor-pointer"
              >
                <Download size={16} />
                <div className="text-left">
                  <div className="leading-tight">Paket Frontend Statis (.ZIP)</div>
                  <div className="text-[10px] font-normal text-slate-300">704 KB • Langsung public_html</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-start overflow-x-auto pb-2 no-scrollbar">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs inline-flex gap-1 overflow-x-auto max-w-full">
            {[
              { id: 'panduan', label: '📖 Panduan Edit Semua Konten', icon: BookOpen },
              { id: 'backup', label: '🛡️ Cadangan & Pemulihan Data', icon: ShieldCheck },
              { id: 'curriculum', label: '🌟 Akademik & Program', icon: Sparkles },
              { id: 'settings', label: '⚙️ Pengaturan & Profil (/admin/settings)', icon: Settings },
              { id: 'media', label: '📸 Kelola Gambar & Media', icon: ImageIcon },
              { id: 'masterdata', label: '🎓 Guru, Santri & Kelas', icon: GraduationCap },
              { id: 'users', label: '👥 Kelola Akun & Sandi', icon: Users },
              { id: 'finance', label: '💳 SPP & Kas Madrasah', icon: CreditCard },
              { id: 'spmb', label: 'Verifikasi SPMB', icon: Users },
              { id: 'suarawarga', label: 'Respon Suara Warga', icon: MessageSquare },
              { id: 'berita', label: 'Warta Berita & Artikel', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
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

        {/* TAB CURRICULUM: AKADEMIK, 15 PROGRAM UNGGULAN & KESISWAAN */}
        {activeTab === 'curriculum' && <CurriculumProgramsManager />}

        {/* TAB BACKUP: PUSAT CADANGAN & PEMULIHAN DATABASE */}
        {activeTab === 'backup' && <MasterDataManager initialTab="cadangan" />}

        {/* TAB MASTERDATA: DATA GURU & SANTRI */}
        {activeTab === 'masterdata' && (
          <MasterDataManager initialTab={(viewParams?.subtab as any) || 'guru'} />
        )}

        {/* TAB USERS: PENGELOLA AKUN GURU & ORANG TUA */}
        {activeTab === 'users' && <UserManager />}

        {/* TAB FINANCE: PENGELOLA SPP & KAS MADRASAH */}
        {activeTab === 'finance' && <PaymentFinanceManager />}

        {/* TAB MEDIA: PENGELOLA GAMBAR & MEDIA */}
        {activeTab === 'media' && <MediaManager />}

        {/* TAB 1: PENGATURAN MADRASAH */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pengaturan Profil & Metadata Madrasah</h3>
                <p className="text-xs text-slate-500">
                  Perubahan akan langsung terupdate di seluruh halaman publik website secara real-time.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-700" />
                <span>Pengaturan madrasah berhasil disimpan dan tersinkronisasi!</span>
              </div>
            )}

            <form onSubmit={handleSettingsSubmit} className="space-y-6 text-xs">
              {/* Identitas Dasar */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-emerald-800 border-b pb-1">1. Identitas Lembaga</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Resmi Madrasah *</label>
                    <input
                      type="text"
                      required
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Singkat / Panggilan *</label>
                    <input
                      type="text"
                      required
                      value={formData.shortName}
                      onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">NPSN Resmi *</label>
                    <input
                      type="text"
                      required
                      value={formData.npsn}
                      onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kode Registrasi Madrasah *</label>
                    <input
                      type="text"
                      required
                      value={formData.madrasahCode}
                      onChange={(e) => setFormData({ ...formData, madrasahCode: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Akreditasi *</label>
                    <input
                      type="text"
                      required
                      value={formData.accreditation}
                      onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Yayasan Penyelenggara *</label>
                    <input
                      type="text"
                      required
                      value={formData.foundation}
                      onChange={(e) => setFormData({ ...formData, foundation: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Alamat & Titik Koordinat */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-emerald-800 border-b pb-1">2. Alamat & Lokasi</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Alamat Jalan *</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">RT / RW *</label>
                    <input
                      type="text"
                      required
                      value={formData.rtRw}
                      onChange={(e) => setFormData({ ...formData, rtRw: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kelurahan *</label>
                    <input
                      type="text"
                      required
                      value={formData.subDistrict}
                      onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kecamatan *</label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Kota / Kabupaten *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Kontak & Kepala Madrasah */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-emerald-800 border-b pb-1">3. Kontak, Kepala Madrasah & Tagihan</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp Resmi *</label>
                    <input
                      type="text"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Kepala Madrasah</label>
                    <input
                      type="text"
                      value={formData.principalName}
                      onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Gunakan [DATA BELUM DIISI ADMIN] jika belum ditetapkan.</p>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tarif Standar SPP Bulanan (Rp)</label>
                    <input
                      type="number"
                      value={formData.monthlyTuitionFee || 650000}
                      onChange={(e) => setFormData({ ...formData, monthlyTuitionFee: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Bank Rekening SPP</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Rekening Bank</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Atas Nama Rekening Kas</label>
                    <input
                      type="text"
                      value={formData.bankAccountHolder}
                      onChange={(e) => setFormData({ ...formData, bankAccountHolder: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Slogan & Teks Headline Halaman Depan */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-emerald-800 border-b pb-1">4. Slogan & Teks Headline Halaman Utama</h4>
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Slogan / Headline Utama (Muncul di Banner Depan) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tagline || ''}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="Contoh: Madrasah Unggul, Berakhlak Mulia, Cakap di Era Digital"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Subheadline / Teks Pengantar Singkat (Muncul di Bawah Headline)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.subheadline || ''}
                      onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                      placeholder="Deskripsi singkat yang menjelaskan keunggulan dan visi madrasah..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Visi, Misi & Tujuan Madrasah */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-emerald-800 border-b pb-1">5. Visi, Misi & Tujuan Madrasah (Halaman Profil)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Visi Madrasah</label>
                    <textarea
                      rows={3}
                      value={formData.vision || ''}
                      onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                      placeholder="Visi jangka panjang madrasah..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Misi Madrasah (Satu butir misi per baris baru)
                    </label>
                    <textarea
                      rows={4}
                      value={Array.isArray(formData.missions) ? formData.missions.join('\n') : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          missions: e.target.value.split('\n').filter((line) => line.trim().length > 0),
                        })
                      }
                      placeholder="Tulis setiap poin misi dalam baris baru..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-mono text-[11px]"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Tekan Enter untuk membuat butir misi baru.</p>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Tujuan Madrasah (Satu butir tujuan per baris baru)
                    </label>
                    <textarea
                      rows={3}
                      value={Array.isArray(formData.goals) ? formData.goals.join('\n') : ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          goals: e.target.value.split('\n').filter((line) => line.trim().length > 0),
                        })
                      }
                      placeholder="Tulis setiap poin tujuan dalam baris baru..."
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* 6. Media Sosial, Email & Jam Madrasah */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-emerald-800 border-b pb-1">6. Media Sosial, Email & Jam Belajar</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Resmi</label>
                    <input
                      type="text"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="info@mirpi.sch.id"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Akun Instagram</label>
                    <input
                      type="text"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="@mis_rpi"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Akun YouTube</label>
                    <input
                      type="text"
                      value={formData.youtube || ''}
                      onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                      placeholder="MI RPI Official"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Akun Facebook</label>
                    <input
                      type="text"
                      value={formData.facebook || ''}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      placeholder="facebook.com/mirpi.official"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran Aktif</label>
                    <input
                      type="text"
                      value={formData.academicYear || ''}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      placeholder="2027/2028"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Jam Belajar Madrasah</label>
                    <input
                      type="text"
                      value={formData.schoolHours || ''}
                      onChange={(e) => setFormData({ ...formData, schoolHours: e.target.value })}
                      placeholder="Senin - Jumat: 06.45 - 14.30 WIB"
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Save size={16} />
                  <span>Simpan Semua Pengaturan</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: VERIFIKASI SPMB */}
        {activeTab === 'spmb' && (
          <div className="space-y-6 animate-in fade-in">
            {/* SPMB Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                  📑
                </div>
                <div>
                  <p className="text-xl font-black text-slate-900">{spmbApplications.length}</p>
                  <p className="text-[11px] font-semibold text-slate-500">Total Formulir</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                  ⏳
                </div>
                <div>
                  <p className="text-xl font-black text-amber-700">
                    {spmbApplications.filter((a) => a.status === 'Menunggu Verifikasi').length}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">Perlu Verifikasi</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                  📋
                </div>
                <div>
                  <p className="text-xl font-black text-teal-700">
                    {spmbApplications.filter((a) => a.status === 'Lolos Berkas' || a.status === 'Jadwal Observasi').length}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">Lolos & Observasi</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  🎓
                </div>
                <div>
                  <p className="text-xl font-black text-emerald-700">
                    {spmbApplications.filter((a) => a.status === 'Diterima').length}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">Diterima</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
                  ❌
                </div>
                <div>
                  <p className="text-xl font-black text-rose-700">
                    {spmbApplications.filter((a) => a.status === 'Tidak Lolos').length}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">Tidak Lolos</p>
                </div>
              </div>
            </div>

            {/* Container Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                      Pusat SPMB Online {settings.academicYear || '2027/2028'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Daftar Formulir Pendaftaran Siswa Baru (SPMB)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Klik tombol <strong>"Lihat Formulir"</strong> pada setiap baris untuk memeriksa biodata lengkap, NIK, asal TK/RA, alamat, dan menghubungi wali murid.
                  </p>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                {/* Status Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
                  {[
                    { id: 'ALL', label: 'Semua Formulir' },
                    { id: 'Menunggu Verifikasi', label: '⏳ Menunggu Verifikasi' },
                    { id: 'Lolos Berkas', label: '📋 Lolos Berkas' },
                    { id: 'Jadwal Observasi', label: '🔍 Observasi' },
                    { id: 'Diterima', label: '🎓 Diterima' },
                    { id: 'Tidak Lolos', label: '❌ Tidak Lolos' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSpmbStatusFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                        spmbStatusFilter === f.id
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
                    placeholder="Cari nama santri, reg, wali, TK..."
                    value={spmbSearchQuery}
                    onChange={(e) => setSpmbSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-3 px-4">No. Registrasi & Tanggal</th>
                      <th className="py-3 px-4">Nama Calon Siswa</th>
                      <th className="py-3 px-4">Asal TK / RA</th>
                      <th className="py-3 px-4">Program Pilihan</th>
                      <th className="py-3 px-4">Wali & WhatsApp</th>
                      <th className="py-3 px-4">Status Verifikasi</th>
                      <th className="py-3 px-4 text-center">Tindakan Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {spmbApplications
                      .filter((app) => {
                        const matchSearch =
                          app.studentName.toLowerCase().includes(spmbSearchQuery.toLowerCase()) ||
                          app.registrationNumber.toLowerCase().includes(spmbSearchQuery.toLowerCase()) ||
                          app.parentName.toLowerCase().includes(spmbSearchQuery.toLowerCase()) ||
                          (app.previousSchool && app.previousSchool.toLowerCase().includes(spmbSearchQuery.toLowerCase())) ||
                          (app.nik && app.nik.includes(spmbSearchQuery));
                        const matchStatus = spmbStatusFilter === 'ALL' ? true : app.status === spmbStatusFilter;
                        return matchSearch && matchStatus;
                      })
                      .length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-slate-400">
                          Tidak ditemukan formulir pendaftaran SPMB yang cocok dengan filter atau kata kunci.
                        </td>
                      </tr>
                    ) : (
                      spmbApplications
                        .filter((app) => {
                          const matchSearch =
                            app.studentName.toLowerCase().includes(spmbSearchQuery.toLowerCase()) ||
                            app.registrationNumber.toLowerCase().includes(spmbSearchQuery.toLowerCase()) ||
                            app.parentName.toLowerCase().includes(spmbSearchQuery.toLowerCase()) ||
                            (app.previousSchool && app.previousSchool.toLowerCase().includes(spmbSearchQuery.toLowerCase())) ||
                            (app.nik && app.nik.includes(spmbSearchQuery));
                          const matchStatus = spmbStatusFilter === 'ALL' ? true : app.status === spmbStatusFilter;
                          return matchSearch && matchStatus;
                        })
                        .map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition">
                            {/* Reg No & Date */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {app.registrationNumber}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-1">
                                {app.registrationDate}
                              </span>
                            </td>

                            {/* Student Name */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs shrink-0">
                                  {app.gender === 'L' ? '👦' : '👧'}
                                </span>
                                <div>
                                  <p className="font-bold text-slate-900">{app.studentName}</p>
                                  <span className="text-[10px] text-slate-400 block">
                                    NIK: {app.nik || '-'} {app.birthPlace ? `• ${app.birthPlace}, ${app.birthDate}` : ''}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Asal TK */}
                            <td className="py-3.5 px-4">
                              <span className="text-slate-700 font-medium">
                                {app.previousSchool || 'Belum diisi'}
                              </span>
                            </td>

                            {/* Program */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                  app.programChosen.includes('Tahfiz')
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {app.programChosen}
                              </span>
                            </td>

                            {/* Parent & WA */}
                            <td className="py-3.5 px-4">
                              <p className="font-medium text-slate-800">{app.parentName}</p>
                              <p className="text-[11px] font-mono text-slate-500 mt-0.5">{app.parentPhone}</p>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <select
                                value={app.status}
                                onChange={(e) => updateSPMBStatus(app.id, e.target.value as any)}
                                className={`p-1.5 rounded-lg text-[11px] font-bold border outline-none cursor-pointer transition ${
                                  app.status === 'Diterima'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : app.status === 'Lolos Berkas' || app.status === 'Jadwal Observasi'
                                    ? 'bg-teal-50 text-teal-800 border-teal-300'
                                    : app.status === 'Tidak Lolos'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                                    : 'bg-amber-50 text-amber-900 border-amber-300'
                                }`}
                              >
                                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                <option value="Lolos Berkas">Lolos Berkas</option>
                                <option value="Jadwal Observasi">Jadwal Observasi</option>
                                <option value="Diterima">Diterima</option>
                                <option value="Tidak Lolos">Tidak Lolos</option>
                              </select>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                {/* Tombol Lihat Formulir Lengkap */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenSpmbDetail(app)}
                                  className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-2xs cursor-pointer"
                                  title="Lihat Formulir Pendaftaran Lengkap"
                                >
                                  <Eye size={12} />
                                  <span>Lihat Formulir</span>
                                </button>

                                {/* Tombol WA Wali */}
                                <button
                                  type="button"
                                  onClick={() => handleSendSpmbWhatsApp(app)}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-lg transition cursor-pointer border border-emerald-200"
                                  title="Kirim Pemberitahuan Status via WhatsApp"
                                >
                                  <Send size={13} />
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

            {/* ================= MODAL DETAIL FORMULIR SPMB ================= */}
            {selectedSpmbApp && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200 max-h-[92vh] flex flex-col">
                  {/* Header Modal */}
                  <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 shrink-0 flex items-center justify-between">
                    <div>
                      <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Lembar Formulir Pendaftaran Resmi
                      </span>
                      <h3 className="text-lg font-bold mt-1">
                        Formulir Calon Santri: {selectedSpmbApp.studentName}
                      </h3>
                      <p className="text-xs text-emerald-100">
                        Nomor Registrasi: <span className="font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">{selectedSpmbApp.registrationNumber}</span>
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedSpmbApp(null)}
                      className="text-white/70 hover:text-white font-bold text-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5 overflow-y-auto text-xs">
                    {/* Kop Madrasah Preview */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                      <img
                        src={settings.logoUrl || '/images/logo-yayasan-rpi.svg'}
                        alt="Logo"
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <p className="font-bold text-[11px] text-emerald-950 uppercase">{settings.foundation}</p>
                        <h4 className="font-black text-sm text-emerald-800">{settings.schoolName}</h4>
                        <p className="text-[10px] text-slate-500">
                          NPSN: {settings.npsn} • {settings.address}, {settings.city}
                        </p>
                      </div>
                    </div>

                    {/* Section: Status & Program */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                      <div>
                        <label className="font-bold text-slate-500 block mb-1">Program Pilihan</label>
                        <span className="font-bold text-slate-900 text-xs bg-white px-2.5 py-1 rounded-lg border border-slate-200 inline-block">
                          {selectedSpmbApp.programChosen}
                        </span>
                      </div>
                      <div>
                        <label className="font-bold text-slate-500 block mb-1">Status Verifikasi Berkas</label>
                        <select
                          value={selectedSpmbApp.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as any;
                            updateSPMBStatus(selectedSpmbApp.id, newStatus, spmbNotesInput);
                            setSelectedSpmbApp({ ...selectedSpmbApp, status: newStatus });
                          }}
                          className="w-full bg-white border border-slate-300 p-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer"
                        >
                          <option value="Menunggu Verifikasi">⏳ Menunggu Verifikasi</option>
                          <option value="Lolos Berkas">📋 Lolos Berkas</option>
                          <option value="Jadwal Observasi">🔍 Jadwal Observasi</option>
                          <option value="Diterima">🎓 Diterima Resmi</option>
                          <option value="Tidak Lolos">❌ Tidak Lolos</option>
                        </select>
                      </div>
                    </div>

                    {/* Section: Data Santri */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-slate-900 border-b pb-1">
                        1. Data Pribadi Calon Siswa
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Nama Lengkap Santri</span>
                          <span className="font-bold text-slate-900">{selectedSpmbApp.studentName}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Jenis Kelamin</span>
                          <span className="font-bold text-slate-900">
                            {selectedSpmbApp.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">NIK Calon Siswa</span>
                          <span className="font-mono font-bold text-slate-900">{selectedSpmbApp.nik || '-'}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">NISN (Jika Ada)</span>
                          <span className="font-mono font-bold text-slate-900">{selectedSpmbApp.nisn || '-'}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Tempat, Tanggal Lahir</span>
                          <span className="font-bold text-slate-900">
                            {selectedSpmbApp.birthPlace || '-'}, {selectedSpmbApp.birthDate || '-'}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Asal Sekolah TK / RA</span>
                          <span className="font-bold text-slate-900">{selectedSpmbApp.previousSchool || '-'}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 sm:col-span-2">
                          <span className="text-[10px] text-slate-400 block">Alamat Tempat Tinggal Lengkap</span>
                          <span className="font-semibold text-slate-900">{selectedSpmbApp.address || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section: Data Orang Tua */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-slate-900 border-b pb-1">
                        2. Data Orang Tua / Wali
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Nama Orang Tua / Wali</span>
                          <span className="font-bold text-slate-900">{selectedSpmbApp.parentName}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Nomor Kontak WhatsApp</span>
                            <span className="font-mono font-bold text-slate-900">{selectedSpmbApp.parentPhone}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSendSpmbWhatsApp(selectedSpmbApp)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Send size={11} />
                            <span>Kirim WA</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section: Catatan Panitia */}
                    <div className="space-y-2 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-amber-950 block">
                          📝 Catatan Tim Panitia / Verifikator SPMB
                        </label>
                        {spmbFeedback && (
                          <span className="text-[10px] font-bold text-emerald-700 animate-in fade-in">
                            {spmbFeedback}
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={2}
                        value={spmbNotesInput}
                        onChange={(e) => setSpmbNotesInput(e.target.value)}
                        placeholder="Contoh: Berkas Akta & KK lengkap. Jadwal observasi Sabtu, 10 Oktober 2026 jam 09.00 WIB."
                        className="w-full bg-white border border-amber-300 p-2.5 rounded-xl outline-none focus:border-amber-500 text-xs"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleSaveSpmbNotes}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                        >
                          <Save size={12} />
                          <span>Simpan Catatan</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer Modal */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Printer size={13} />
                      <span>Cetak Lembar Formulir</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendSpmbWhatsApp(selectedSpmbApp)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                      >
                        <Send size={13} />
                        <span>Kirim Update ke WhatsApp Wali</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedSpmbApp(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RESPON SUARA WARGA */}
        {activeTab === 'suarawarga' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Kelola & Tanggapi Suara Warga MI RPI</h3>

            <div className="space-y-4">
              {complaints.map((c) => (
                <div key={c.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-emerald-800 text-sm mr-2">{c.ticketNumber}</span>
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">{c.category}</span>
                    </div>
                    <select
                      value={c.status}
                      onChange={(e) => updateComplaintStatus(c.id, e.target.value as any, c.responseNote)}
                      className="bg-white border border-slate-300 px-2.5 py-1 rounded-lg font-bold text-xs"
                    >
                      <option value="Diterima">Diterima</option>
                      <option value="Diproses">Diproses</option>
                      <option value="Selesai">Selesai</option>
                    </select>
                  </div>

                  <p className="text-slate-800 font-medium">"{c.message}"</p>
                  <p className="text-slate-400 text-[11px]">Pengirim: {c.senderName} ({c.senderContact}) • {c.date}</p>

                  <div className="pt-2">
                    <label className="font-bold text-slate-700 block mb-1">Tanggapan Admin untuk Pelapor:</label>
                    <input
                      type="text"
                      value={c.responseNote || ''}
                      onChange={(e) => updateComplaintStatus(c.id, c.status, e.target.value)}
                      placeholder="Ketik tanggapan resmi dari madrasah..."
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TAMBAH WARTA BERITA */}
        {activeTab === 'berita' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Publikasi Berita / Warta Madrasah Baru</h3>

            {newsSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                Berita baru berhasil diterbitkan dan langsung tayang di portal warta!
              </div>
            )}

            <form onSubmit={handlePublishNews} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  placeholder="Judul warta atau pengumuman..."
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori *</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  >
                    <option value="Berita Madrasah">Berita Madrasah</option>
                    <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                    <option value="Kegiatan Keislaman">Kegiatan Keislaman</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Penulis *</label>
                  <input
                    type="text"
                    required
                    value={newsAuthor}
                    onChange={(e) => setNewsAuthor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Foto Berita / Dokumentasi</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="URL gambar..."
                    value={newsImage}
                    onChange={(e) => setNewsImage(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                  <label className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 border border-slate-300">
                    <ImageIcon size={15} />
                    <span>Pilih Foto dari HP/Laptop</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const dataUrl = await processImageFile(file, 1000, 700, 0.85);
                          setNewsImage(dataUrl);
                          const serverUrl = await uploadImageToServer(dataUrl, 'berita');
                          setNewsImage(serverUrl);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ringkasan / Sinopsis *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan singkat 1-2 kalimat..."
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Isi Lengkap Berita</label>
                <textarea
                  rows={4}
                  placeholder="Teks lengkap berita..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Publikasikan Berita</span>
              </button>
            </form>

            {/* Arsip Berita yang Sedang Tayang */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Arsip & Pengelolaan Warta Berita ({news.length} Artikel Tayang)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Daftar semua artikel yang sedang tampil di halaman Warta Berita website publik.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {news.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    Belum ada warta berita yang dipublikasikan.
                  </div>
                ) : (
                  news.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&auto=format&fit=crop&q=80'
                          }
                          alt={item.title}
                          className="w-16 h-12 object-cover rounded-xl shrink-0 border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {item.category}
                          </span>
                          <h5 className="font-bold text-slate-900 text-xs mt-1 line-clamp-1">
                            {item.title}
                          </h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {item.date} • Penulis: {item.author}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus artikel berita "${item.title}"? Tindakan ini permanen.`)) {
                            deleteNewsArticle(item.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer border border-rose-200"
                        title="Hapus Artikel Berita"
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: PANDUAN LENGKAP EDIT KONTEN (SEMUA HAL: GAMBAR & TULISAN) */}
        {activeTab === 'panduan' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header Card Panduan */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="bg-white/20 text-emerald-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Buku Panduan Mandiri Admin
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-2 flex items-center gap-2">
                  <span>📖 Panduan Mengedit Semua Konten, Gambar & Tulisan</span>
                </h2>
                <p className="text-xs text-emerald-100 mt-1 max-w-2xl leading-relaxed">
                  Administrator MI RPI Jakarta memiliki kendali penuh atas seluruh isi website. Di bawah ini adalah peta navigasi dan langkah praktis untuk mengedit bagian mana pun yang Anda inginkan.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 text-xs shrink-0 space-y-1">
                <p className="font-bold text-emerald-300">✅ Penyimpanan Otomatis</p>
                <p className="text-[11px] text-white/90">
                  Semua editan disimpan aman di server disk madrasah.
                </p>
              </div>
            </div>

            {/* PANDUAN KHUSUS: CARA MENGHUBUNGKAN KE DOMAIN misrpijakarta.com (cPanel Hosting) */}
            <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl border-2 border-blue-400/50 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                    🌐
                  </div>
                  <div>
                    <span className="bg-blue-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Khusus Domain: misrpijakarta.com (Rumahweb cPanel)
                    </span>
                    <h3 className="font-black text-lg sm:text-xl text-white mt-1">
                      Cara Memasang Website ini ke misrpijakarta.com di cPanel
                    </h3>
                  </div>
                </div>

                <a
                  href="/website-misrpijakarta-siap-cpanel.zip"
                  download="website-misrpijakarta-siap-cpanel.zip"
                  className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Unduh Paket Website Siap Upload (.ZIP)</span>
                </a>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-blue-100">
                <p className="font-semibold text-white">
                  Mengapa saat membuka <code className="bg-blue-950 px-2 py-0.5 rounded text-amber-300 font-mono">misrpijakarta.com</code> muncul tulisan <em>"Silahkan hapus file index.php..."</em> warna biru?
                </p>
                <p className="text-slate-200">
                  Itu adalah halaman bawaan (placeholder) dari hosting Rumahweb karena domain Anda sudah aktif namun file website MI RPI belum di-upload ke folder hosting cPanel.
                </p>
              </div>

              {/* 4 Langkah Mudah Pasang ke cPanel */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs">1</span>
                  <h4 className="font-bold text-white text-sm">Unduh File ZIP</h4>
                  <p className="text-blue-100 text-[11px]">
                    Klik tombol hijau di atas untuk mengunduh <code className="text-amber-300">website-misrpijakarta-siap-cpanel.zip</code> ke laptop Anda.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs">2</span>
                  <h4 className="font-bold text-white text-sm">Buka cPanel File Manager</h4>
                  <p className="text-blue-100 text-[11px]">
                    Buka tab <strong>cPanel File Manager</strong> yang sudah Anda buka, lalu masuk ke folder <strong>public_html</strong>.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs">3</span>
                  <h4 className="font-bold text-white text-sm">Hapus index.php Bawaan</h4>
                  <p className="text-blue-100 text-[11px]">
                    Hapus file <code className="text-rose-300">index.php</code> bawaan Rumahweb di dalam folder <code className="text-amber-300">public_html</code>.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black flex items-center justify-center text-xs">4</span>
                  <h4 className="font-bold text-white text-sm">Upload & Extract</h4>
                  <p className="text-blue-100 text-[11px]">
                    Upload file zip yang diunduh ke <strong>public_html</strong>, klik kanan file zip lalu pilih <strong>Extract</strong>. Selesai!
                  </p>
                </div>
              </div>
            </div>

            {/* Bagian 1: Mengedit GAMBAR & FOTO */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                  📸
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">1. Cara Mengedit GAMBAR & FOTO di Seluruh Website</h3>
                  <p className="text-xs text-slate-500">
                    Semua gambar dapat diganti dengan mengunggah file foto dari HP/Laptop atau menempelkan tautan (URL).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* 1A. Logo */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-base">🏷️</span> Logo Madrasah & Yayasan
                      </span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono font-bold">Navbar & Footer</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Tampil di pojok kiri atas (Navbar), footer, dan kop surat transkrip rapor.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('media')}
                    className="mt-2 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Tab Kelola Gambar ➔ Subtab Logo</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 1B. Hero Banner */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-base">🖼️</span> Foto Banner Halaman Depan
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Hero Utama</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Foto besar di bagian atas website depan. Bisa upload foto asli kegiatan atau klik 6 preset template foto berkualitas tinggi.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('media')}
                    className="mt-2 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Tab Kelola Gambar ➔ Subtab Hero</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 1C. Kepala Madrasah */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-base">👔</span> Foto Kepala Madrasah
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Profil</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Foto resmi Kamad yang mendampingi teks Sambutan Kepala Madrasah di Halaman Profil.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('media')}
                    className="mt-2 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Tab Kelola Gambar ➔ Foto Kamad</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 1D. Galeri Kegiatan */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-base">🎨</span> Foto Galeri Kegiatan
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Galeri</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Dokumentasi belajar, perkemahan, wisuda tahfiz, sains, dll. Bisa menambah foto baru atau menghapus foto lama.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('media')}
                    className="mt-2 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Tab Kelola Gambar ➔ Galeri</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 1E. Foto Guru */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-base">👩‍🏫</span> Foto Profil Dewan Guru
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Direktori GTK</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Pilih nama guru lalu unggah pas foto formal guru untuk ditampilkan di profil pendidik.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('media')}
                    className="mt-2 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Tab Kelola Gambar ➔ Foto Guru</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 1F. Foto Berita */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-base">📰</span> Foto Liputan Berita
                      </span>
                      <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">Warta</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Foto dokumentasi yang menyertai artikel berita saat mempublikasikan berita baru.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('berita')}
                    className="mt-2 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Tab Warta Berita</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bagian 2: Mengedit TULISAN & TEKS */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg">
                  ✍️
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">2. Cara Mengedit TULISAN & TEKS di Seluruh Website</h3>
                  <p className="text-xs text-slate-500">
                    Lokasi formulir untuk mengganti kalimat, nama, visi-misi, alamat, kontak, dan biaya SPP.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 2A. Slogan & Headline Halaman Utama */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>📢 Slogan & Headline Halaman Utama</span>
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Halaman Depan</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Ubah tulisan besar <em>"Madrasah Unggul, Berakhlak Mulia..."</em> dan kalimat pengantar di bawahnya.
                  </p>
                  <p className="text-emerald-900 font-bold text-[11px]">
                    📍 Lokasi: Tab <strong>Pengaturan Madrasah</strong> ➔ Bagian <strong>4. Slogan & Teks Headline</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>Ke Pengaturan Madrasah</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* 2B. Identitas Lembaga & NPSN */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🏛️ Nama Sekolah, NPSN, Yayasan & Akreditasi</span>
                    </h4>
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">Seluruh Web</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Nama resmi madrasah, nama panggilan (MI RPI), kode madrasah, nama yayasan, dan akreditasi A.
                  </p>
                  <p className="text-emerald-900 font-bold text-[11px]">
                    📍 Lokasi: Tab <strong>Pengaturan Madrasah</strong> ➔ Bagian <strong>1. Identitas Lembaga</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>Ke Pengaturan Madrasah</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* 2C. Alamat & Titik Koordinat Peta */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>📍 Alamat Jalan, RT/RW & Titik Peta (GPS)</span>
                    </h4>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">Kontak & Peta</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Jalan HR. Rasuna Said, Kelurahan, Kecamatan, Kota, Kode Pos, serta Latitude dan Longitude untuk Google Maps.
                  </p>
                  <p className="text-emerald-900 font-bold text-[11px]">
                    📍 Lokasi: Tab <strong>Pengaturan Madrasah</strong> ➔ Bagian <strong>2. Alamat & Lokasi</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>Ke Pengaturan Madrasah</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* 2D. Visi, Misi & Tujuan */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>📜 Visi, Misi, dan Tujuan Madrasah</span>
                    </h4>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">Halaman Profil</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Teks visi madrasah, butir-butir misi islami, dan target tujuan lulusan santri berakhlak mulia.
                  </p>
                  <p className="text-emerald-900 font-bold text-[11px]">
                    📍 Lokasi: Tab <strong>Pengaturan Madrasah</strong> ➔ Bagian <strong>5. Visi, Misi & Tujuan</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>Ke Pengaturan Madrasah</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* 2E. Nomor WhatsApp, Rekening SPP & Bank */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>💳 Biaya SPP, Bank, dan No. Rekening Madrasah</span>
                    </h4>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Tagihan & Kas</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Nomor WhatsApp resmi, tarif SPP bulanan (Rp 650.000), nama bank (BSI), nomor rekening, dan atas nama rekening.
                  </p>
                  <p className="text-emerald-900 font-bold text-[11px]">
                    📍 Lokasi: Tab <strong>Pengaturan Madrasah</strong> ➔ Bagian <strong>3. Kontak & Tagihan</strong>.
                  </p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>Ke Pengaturan Madrasah</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                {/* 2F. Edit Akun Pengguna (Guru / Ortu / Bendahara) */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>👥 Akun Pengguna & Sandi (Guru, Ortu, Bendahara)</span>
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">Portal Akses</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Untuk mengubah nama, username, kata sandi, peran, atau kontak pengguna, cukup klik tombol <strong>✏️ Edit</strong> di sebelah akun yang bersangkutan.
                  </p>
                  <p className="text-emerald-900 font-bold text-[11px]">
                    📍 Lokasi: Tab <strong>Kelola Akun & Sandi</strong> ➔ Klik tombol <strong>✏️ Edit</strong> pada tabel.
                  </p>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="py-1.5 px-3 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg transition inline-flex items-center gap-1"
                  >
                    <span>Ke Kelola Akun & Sandi</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bagian 3: Mengedit AKADEMIK, 15 PROGRAM UNGGULAN & KESISWAAN */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                  🌟
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    3. Cara Mengedit AKADEMIK, 15 PROGRAM UNGGULAN & KESISWAAN
                  </h3>
                  <p className="text-xs text-slate-500">
                    Semua isi kurikulum, 15 program madrasah, rutinitas adab harian, dan ekstrakurikuler dapat diubah, ditambah, atau dihapus langsung di tab <strong>🌟 Akademik & Program</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 3A. 15 Program Unggulan */}
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🌟 15 Program Unggulan Madrasah</span>
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Halaman Publik & Depan</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Mengubah nama program, kategori, deskripsi, tujuan santri, indikator capaian (KPI), dokumentasi kegiatan, dan ikon visual. Anda juga dapat menambahkan program baru atau menghapus program yang tidak aktif.
                    </p>
                    <p className="text-emerald-900 font-bold text-[11px]">
                      📍 Lokasi: Tab <strong>🌟 Akademik & Program</strong> ➔ Subtab <strong>15 Program Unggulan</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className="mt-2 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Kelola 15 Program Unggulan</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 3B. Kurikulum & 8 Dimensi Profil Lulusan */}
                <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>📖 Kurikulum & 8 Dimensi Profil Lulusan</span>
                      </h4>
                      <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">Menu Akademik</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Mengubah 8 dimensi capaian santri (akidah, akhlak, nalar kritis, koding digital, dll.), serta mengelola daftar mata pelajaran di kelompok Kemenag, Kemendikbudristek, dan Muatan Lokal Unggulan RPI.
                    </p>
                    <p className="text-blue-900 font-bold text-[11px]">
                      📍 Lokasi: Tab <strong>🌟 Akademik & Program</strong> ➔ Subtab <strong>Struktur Akademik & Kurikulum</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className="mt-2 w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Kelola Kurikulum & Mapel</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 3C. Pembiasaan Adab & Ibadah Harian */}
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>⏰ Pembiasaan Adab & Ibadah Harian Santri</span>
                      </h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Menu Kesiswaan</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Mengubah jam dan isi rutinitas spiritual (Sambut Senyum Santri 06.30, Shalat Dhuha Berjamaah, Halaqah Tahsin Juz 30, Shalat Dzuhur Berjamaah, Makan Siang Beradab). Bisa menambah rutinitas baru.
                    </p>
                    <p className="text-amber-900 font-bold text-[11px]">
                      📍 Lokasi: Tab <strong>🌟 Akademik & Program</strong> ➔ Subtab <strong>Kesiswaan & Pembiasaan</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className="mt-2 w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Kelola Pembiasaan Karakter</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* 3D. Ekstrakurikuler Pilihan */}
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>🏹 Ekstrakurikuler Pilihan Santri</span>
                      </h4>
                      <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">Menu Kesiswaan</span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Mengubah nama ekskul, kategori (Teknologi, Olahraga, Bela Diri, Seni Religi, dll.), simbol emoji, dan uraian aktivitas (Klub Robotik, Panahan Sunnah, Pencak Silat, Hadrah, Tari Saman, STEM).
                    </p>
                    <p className="text-purple-900 font-bold text-[11px]">
                      📍 Lokasi: Tab <strong>🌟 Akademik & Program</strong> ➔ Subtab <strong>Kesiswaan & Pembiasaan</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className="mt-2 w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                  >
                    <span>Buka Kelola Ekstrakurikuler</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Reset Pengaturan */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-amber-600 text-white p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <RotateCcw size={24} className="text-white" />
              </div>
              <div>
                <span className="bg-white/25 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Konfirmasi Reset
                </span>
                <h3 className="text-base font-bold mt-1">Reset Pengaturan Madrasah</h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Kembalikan profil madrasah ke nilai bawaan sistem.
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-700">
                Yakin ingin mereset seluruh pengaturan identitas madrasah, visi misi, dan kontak ke data awal bawaan?
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={15} />
                  <span>Ya, Reset Pengaturan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </PortalAccessGuard>
  );
};
