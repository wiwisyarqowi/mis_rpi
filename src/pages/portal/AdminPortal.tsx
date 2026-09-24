import React, { useState } from 'react';
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
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolSettings, SPMBApplication, ComplaintTicket } from '../../types';
import { MediaManager } from '../../components/admin/MediaManager';
import { UserManager } from '../../components/admin/UserManager';
import { MasterDataManager } from '../../components/admin/MasterDataManager';
import { processImageFile } from '../../utils/imageUpload';

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
    viewParams,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'masterdata' | 'users' | 'media' | 'settings' | 'spmb' | 'suarawarga' | 'berita'>(
    (viewParams?.tab as any) || 'masterdata'
  );

  // Form Settings State
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Article State
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<any>('Berita Madrasah');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80');
  const [newsAuthor, setNewsAuthor] = useState('Humas MI RPI');
  const [newsSuccess, setNewsSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
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

        {/* Tab Controls */}
        <div className="flex justify-start overflow-x-auto pb-2 no-scrollbar">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs inline-flex gap-1 overflow-x-auto max-w-full">
            {[
              { id: 'masterdata', label: '🎓 Guru, Santri & Kelas', icon: GraduationCap },
              { id: 'users', label: '👥 Kelola Akun & Sandi', icon: Users },
              { id: 'media', label: '📸 Kelola Gambar & Media', icon: ImageIcon },
              { id: 'settings', label: 'Pengaturan Madrasah (/admin/settings)', icon: Settings },
              { id: 'spmb', label: 'Verifikasi SPMB', icon: Users },
              { id: 'suarawarga', label: 'Respon Suara Warga', icon: MessageSquare },
              { id: 'berita', label: 'Tambah Warta Berita', icon: FileText },
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

        {/* TAB MASTERDATA: DATA GURU & SANTRI */}
        {activeTab === 'masterdata' && (
          <MasterDataManager initialTab={(viewParams?.subtab as any) || 'guru'} />
        )}

        {/* TAB USERS: PENGELOLA AKUN GURU & ORANG TUA */}
        {activeTab === 'users' && <UserManager />}

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
                    <label className="font-bold text-slate-700 block mb-1">Nama Bank Rekening SPP</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Rekening & Atas Nama</label>
                    <input
                      type="text"
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Daftar & Verifikasi Pendaftaran Siswa Baru (SPMB)</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">No. Registrasi</th>
                    <th className="py-3 px-4">Nama Calon Siswa</th>
                    <th className="py-3 px-4">Program Pilihan</th>
                    <th className="py-3 px-4">Orang Tua & WA</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {spmbApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{app.registrationNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{app.studentName}</td>
                      <td className="py-3.5 px-4 text-slate-600">{app.programChosen}</td>
                      <td className="py-3.5 px-4 text-slate-600">{app.parentName} ({app.parentPhone})</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => updateSPMBStatus(app.id, e.target.value as any)}
                          className="bg-slate-100 border border-slate-200 p-1.5 rounded-lg text-xs font-bold outline-none"
                        >
                          <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                          <option value="Lolos Berkas">Lolos Berkas</option>
                          <option value="Jadwal Observasi">Jadwal Observasi</option>
                          <option value="Diterima">Diterima</option>
                          <option value="Tidak Lolos">Tidak Lolos</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[11px] text-emerald-700 font-semibold">Tersimpan</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  );
};
