import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Camera,
  Layers,
  UserCheck,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { processImageFile } from '../../utils/imageUpload';
import { GalleryItem } from '../../types';

export const MediaManager: React.FC = () => {
  const {
    settings,
    updateSettings,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    teachers,
    updateTeacher,
  } = useSchool();

  const [activeMediaSection, setActiveMediaSection] = useState<
    'logo' | 'hero' | 'principal' | 'gallery' | 'teachers'
  >('logo');

  // Feedback notifications
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // State: Logo
  const [logoInput, setLogoInput] = useState<string>(
    settings.logoUrl || '/images/logo-yayasan-rpi.svg'
  );
  const [logoPreview, setLogoPreview] = useState<string>(
    settings.logoUrl || '/images/logo-yayasan-rpi.svg'
  );

  // State: Hero Banner
  const [heroInput, setHeroInput] = useState<string>(
    settings.heroImageUrl ||
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'
  );
  const [heroPreview, setHeroPreview] = useState<string>(
    settings.heroImageUrl ||
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'
  );

  // State: Principal Photo
  const [principalInput, setPrincipalInput] = useState<string>(
    settings.principalPhotoUrl ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80'
  );
  const [principalPreview, setPrincipalPreview] = useState<string>(
    settings.principalPhotoUrl ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80'
  );

  // State: New Gallery Item
  const [galTitle, setGalTitle] = useState('');
  const [galCategory, setGalCategory] = useState<any>('Belajar');
  const [galYear, setGalYear] = useState<number>(2026);
  const [galImageUrl, setGalImageUrl] = useState('');
  const [galImagePreview, setGalImagePreview] = useState('');
  const [deleteGalleryTarget, setDeleteGalleryTarget] = useState<any | null>(null);

  // State: Teacher Photo
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    teachers[0]?.id || ''
  );
  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);
  const [teacherPhotoInput, setTeacherPhotoInput] = useState('');
  const [teacherPhotoPreview, setTeacherPhotoPreview] = useState('');

  // Preset Hero Images
  const heroPresets = [
    {
      title: 'Ruang Kelas & Belajar Ceria',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Laboratorium & Koding Komputer',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Perpustakaan & Membaca Al-Qur\'an',
      url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&auto=format&fit=crop&q=80',
    },
    {
      title: 'Kegiatan Sains & Eksperimen',
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  // File Handlers
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 800, 800, 0.9);
      setLogoInput(dataUrl);
      setLogoPreview(dataUrl);
    } catch (err) {
      alert('Gagal memproses file gambar. Pastikan format JPG, PNG, atau SVG.');
    }
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1600, 1000, 0.85);
      setHeroInput(dataUrl);
      setHeroPreview(dataUrl);
    } catch (err) {
      alert('Gagal memproses file gambar banner.');
    }
  };

  const handlePrincipalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 600, 600, 0.85);
      setPrincipalInput(dataUrl);
      setPrincipalPreview(dataUrl);
    } catch (err) {
      alert('Gagal memproses foto kepala madrasah.');
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 1200, 900, 0.85);
      setGalImageUrl(dataUrl);
      setGalImagePreview(dataUrl);
    } catch (err) {
      alert('Gagal memproses gambar kegiatan.');
    }
  };

  const handleTeacherFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file, 600, 600, 0.85);
      setTeacherPhotoInput(dataUrl);
      setTeacherPhotoPreview(dataUrl);
    } catch (err) {
      alert('Gagal memproses foto guru.');
    }
  };

  // Save Handlers
  const handleSaveLogo = () => {
    updateSettings({
      ...settings,
      logoUrl: logoInput,
    });
    showFeedback('Logo resmi madrasah berhasil diperbarui di seluruh website!');
  };

  const handleResetOfficialLogo = () => {
    const officialSvg = '/images/logo-yayasan-rpi.svg';
    setLogoInput(officialSvg);
    setLogoPreview(officialSvg);
    updateSettings({
      ...settings,
      logoUrl: officialSvg,
    });
    showFeedback('Logo telah dikembalikan ke Logo Resmi Vektor Yayasan RPI!');
  };

  const handleSaveHero = () => {
    updateSettings({
      ...settings,
      heroImageUrl: heroInput,
    });
    showFeedback('Banner utama di beranda berhasil disimpan!');
  };

  const handleSavePrincipal = () => {
    updateSettings({
      ...settings,
      principalPhotoUrl: principalInput,
    });
    showFeedback('Foto Kepala Madrasah berhasil diperbarui di Halaman Profil!');
  };

  const handleAddGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle || !galImageUrl) {
      alert('Mohon isi judul kegiatan dan pilih gambar foto kegiatan.');
      return;
    }

    addGalleryItem({
      title: galTitle,
      category: galCategory,
      imageUrl: galImageUrl,
      year: Number(galYear) || 2026,
      caption: galTitle,
    });

    setGalTitle('');
    setGalImageUrl('');
    setGalImagePreview('');
    showFeedback(`Foto kegiatan "${galTitle}" berhasil ditambahkan ke galeri!`);
  };

  const handleSaveTeacherPhoto = () => {
    if (!selectedTeacherId || !teacherPhotoInput) return;
    updateTeacher(selectedTeacherId, {
      photoUrl: teacherPhotoInput,
    });
    showFeedback(`Foto asatidz ${selectedTeacher?.name} berhasil diperbarui!`);
    setTeacherPhotoInput('');
    setTeacherPhotoPreview('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} className="text-emerald-200" />
          <span className="text-xs sm:text-sm font-bold">{successMessage}</span>
        </div>
      )}

      {/* Guide Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-emerald-700/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <Camera size={14} />
            <span>Pusat Pengelola Gambar & Media Visual</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">
            Ganti Logo, Foto Kegiatan, Banner, & Foto Dewan Guru
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Tidak perlu paham koding. Anda dapat langsung mengunggah foto dari HP/Laptop Anda atau
            memasukkan tautan gambar. Foto otomatis dioptimalkan ukurannya sehingga website tetap cepat.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveMediaSection('logo')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMediaSection === 'logo'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Sparkles size={14} />
            <span>Ganti Logo</span>
          </button>
          <button
            onClick={() => setActiveMediaSection('gallery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMediaSection === 'gallery'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ImageIcon size={14} />
            <span>Foto Galeri</span>
          </button>
        </div>
      </div>

      {/* Section Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'logo', label: '1. Logo Yayasan & Madrasah', icon: Sparkles },
          { id: 'hero', label: '2. Banner Utama Beranda', icon: ImageIcon },
          { id: 'principal', label: '3. Foto Kepala Madrasah', icon: UserCheck },
          { id: 'gallery', label: '4. Galeri Kegiatan Santri', icon: Layers },
          { id: 'teachers', label: '5. Foto Dewan Guru (GTK)', icon: Camera },
        ].map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveMediaSection(sec.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeMediaSection === sec.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Icon size={15} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= SECTION 1: LOGO MADRASAH & YAYASAN ================= */}
      {activeMediaSection === 'logo' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-emerald-600" size={20} />
              <span>Pengaturan Logo Utama Madrasah & Yayasan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Logo ini otomatis tampil di bilah navigasi atas (Navbar), footer website, kartu SPMB,
              dan transkrip e-Rapor resmi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Logo Preview Card */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pratinjau Logo Saat Ini
              </p>
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-3xl border-2 border-emerald-500 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src={logoPreview}
                  alt="Pratinjau Logo"
                  className="w-full h-full object-contain"
                  onError={() => setLogoPreview('/images/logo-yayasan-rpi.svg')}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Format disarankan: PNG (latar transparan), JPG, atau SVG.
              </p>
            </div>

            {/* Inputs & Controls */}
            <div className="md:col-span-2 space-y-6">
              {/* Option A: Direct File Upload */}
              <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Unggah File Logo dari Perangkat (HP / Laptop)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Paling mudah: pilih foto langsung dari galeri HP atau folder laptop Anda.
                    </p>
                  </div>
                </div>

                <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white rounded-2xl p-6 cursor-pointer transition group">
                  <Upload size={28} className="text-emerald-600 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-800 mt-2">
                    Klik di sini untuk memilih file logo
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    Mendukung JPG, JPEG, PNG, SVG (Maks. 5 MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option B: Image URL */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                    B
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      Atau Tempel Tautan Gambar (URL)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Jika gambar Anda sudah ada di internet atau folder publik.
                    </p>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="https://contoh.com/logo-madrasah.png atau /images/logo.png"
                  value={logoInput}
                  onChange={(e) => {
                    setLogoInput(e.target.value);
                    setLogoPreview(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveLogo}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Perubahan Logo</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetOfficialLogo}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
                >
                  <RotateCcw size={15} />
                  <span>Gunakan Logo Resmi Yayasan RPI (Asli)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 2: HERO BANNER ================= */}
      {activeMediaSection === 'hero' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon className="text-emerald-600" size={20} />
              <span>Ganti Banner Utama di Halaman Depan (Beranda)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Banner ini menjadi foto sorotan pertama yang dilihat wali murid saat mengunjungi website.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-700">Pratinjau Banner Utama Saat Ini:</p>
            <div className="w-full h-64 sm:h-80 rounded-3xl overflow-hidden border-2 border-emerald-400 bg-slate-900 relative shadow-lg">
              <img
                src={heroPreview}
                alt="Pratinjau Banner Utama"
                className="w-full h-full object-cover"
                onError={() =>
                  setHeroPreview(
                    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80'
                  )
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <span className="text-white text-xs font-bold bg-emerald-600/90 px-3 py-1 rounded-full">
                  Pratinjau Tampilan Beranda
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Direct Upload */}
            <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                <Upload size={16} className="text-emerald-600" />
                <span>Unggah Foto Banner dari HP / Laptop</span>
              </h4>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white rounded-2xl p-6 cursor-pointer transition">
                <Camera size={26} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-800 mt-2">
                  Pilih foto kegiatan / madrasah dari perangkat
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Foto horizontal disarankan (16:9 atau 4:3)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets & URL */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Atau Masukkan Tautan (URL) Foto:
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={heroInput}
                  onChange={(e) => {
                    setHeroInput(e.target.value);
                    setHeroPreview(e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-2">
                  Atau Pilih Foto Preset Kualitas Tinggi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {heroPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setHeroInput(preset.url);
                        setHeroPreview(preset.url);
                      }}
                      className="p-2 text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-[11px] font-semibold text-slate-700 transition"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveHero}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Simpan Banner Utama</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 3: PRINCIPAL PHOTO ================= */}
      {activeMediaSection === 'principal' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="text-emerald-600" size={20} />
              <span>Ganti Foto Kepala Madrasah</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Foto ini tampil pada Halaman Profil di bagian Pimpinan & Guru (GTK).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Foto Saat Ini
              </p>
              <div className="w-32 h-32 mx-auto rounded-full bg-white p-1 border-4 border-emerald-500 shadow-lg overflow-hidden">
                <img
                  src={principalPreview}
                  alt="Foto Kepala Madrasah"
                  className="w-full h-full object-cover rounded-full"
                  onError={() =>
                    setPrincipalPreview(
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80'
                    )
                  }
                />
              </div>
              <p className="text-xs font-bold text-slate-900">{settings.principalName}</p>
            </div>

            <div className="md:col-span-2 space-y-5">
              <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <Upload size={16} className="text-emerald-600" />
                  <span>Unggah Foto Kepala Madrasah dari Perangkat</span>
                </h4>
                <label className="flex items-center justify-center gap-3 border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white rounded-2xl p-4 cursor-pointer transition">
                  <Camera size={20} className="text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">
                    Klik untuk memilih foto dari galeri
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePrincipalFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Atau Masukkan Tautan (URL) Foto:
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={principalInput}
                  onChange={(e) => {
                    setPrincipalInput(e.target.value);
                    setPrincipalPreview(e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSavePrincipal}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Simpan Foto Kepala Madrasah</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 4: GALLERY OF ACTIVITIES ================= */}
      {activeMediaSection === 'gallery' && (
        <div className="space-y-6">
          {/* Form: Add New Activity Photo */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-emerald-600" size={20} />
                <span>Tambah Foto Kegiatan Baru ke Galeri</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Foto akan otomatis muncul di halaman <strong>Galeri Aktivitas</strong> dan dapat dilihat
                oleh seluruh wali murid dan masyarakat.
              </p>
            </div>

            <form onSubmit={handleAddGallery} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-xs text-slate-700 block mb-1">
                    Judul Kegiatan / Nama Dokumentasi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Praktikum Sains Koding & Robotik Kelas 4"
                    value={galTitle}
                    onChange={(e) => setGalTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 block mb-1">Kategori *</label>
                  <select
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none"
                  >
                    <option value="Sains">Sains & Koding</option>
                    <option value="Keagamaan">Keagamaan & Tahfiz</option>
                    <option value="Olahraga">Olahraga Sunnah</option>
                    <option value="Belajar">Belajar Kelas</option>
                    <option value="Seni">Seni & Kreativitas</option>
                    <option value="Sosial">Sosial & Ramah Anak</option>
                  </select>
                </div>
              </div>

              {/* Upload or URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                  <label className="font-bold text-xs text-slate-800 block">
                    Pilihan 1: Unggah Foto dari HP / Laptop *
                  </label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white rounded-xl p-3.5 cursor-pointer transition">
                    <Upload size={18} className="text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700">
                      Pilih file foto kegiatan
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="font-bold text-xs text-slate-800 block">
                    Pilihan 2: Atau Tautan (URL) Foto
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={galImageUrl}
                    onChange={(e) => {
                      setGalImageUrl(e.target.value);
                      setGalImagePreview(e.target.value);
                    }}
                    className="w-full bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              {/* Live Preview */}
              {galImagePreview && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                    <img
                      src={galImagePreview}
                      alt="Pratinjau"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800">
                      Gambar Terpilih Siap Diunggah
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Klik tombol di bawah untuk menambahkan foto ini ke Galeri Aktivitas.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Tambahkan Foto ke Galeri</span>
              </button>
            </form>
          </div>

          {/* List of Existing Gallery Photos with Delete Button */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="font-bold text-base text-slate-900">
                  Daftar Foto Galeri Saat Ini ({gallery.length} Foto)
                </h4>
                <p className="text-xs text-slate-500">
                  Anda dapat menghapus foto yang sudah tidak relevan dengan menekan tombol tempat sampah.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="relative h-44 bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/50">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500">Tahun {item.year}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeleteGalleryTarget(item)}
                      className="p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl transition shrink-0 cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SECTION 5: TEACHER GTK PHOTOS ================= */}
      {activeMediaSection === 'teachers' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Camera className="text-emerald-600" size={20} />
              <span>Ganti Foto Dewan Guru & Tenaga Kependidikan (GTK)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pilih nama guru yang ingin diubah fotonya, lalu pilih foto baru dari perangkat Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Teacher Selection & Preview */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Pilih Guru / Asatidz:
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => {
                    setSelectedTeacherId(e.target.value);
                    setTeacherPhotoInput('');
                    setTeacherPhotoPreview('');
                  }}
                  className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none focus:border-emerald-500"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.title})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTeacher && (
                <div className="text-center space-y-3 pt-2">
                  <div className="w-28 h-28 mx-auto rounded-full bg-white p-1 border-3 border-emerald-500 shadow-md overflow-hidden">
                    <img
                      src={teacherPhotoPreview || selectedTeacher.photoUrl}
                      alt={selectedTeacher.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">{selectedTeacher.name}</p>
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      {selectedTeacher.title} • {selectedTeacher.subject}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      NIP: {selectedTeacher.nip || '-'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Upload form for selected teacher */}
            <div className="md:col-span-2 space-y-5">
              <div className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-3">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <Upload size={16} className="text-emerald-600" />
                  <span>Unggah Foto Baru untuk {selectedTeacher?.name}</span>
                </h4>
                <label className="flex items-center justify-center gap-3 border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-white rounded-2xl p-4 cursor-pointer transition">
                  <Camera size={20} className="text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">
                    Pilih foto dari galeri HP / Laptop
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeacherFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="font-bold text-xs text-slate-700 block mb-1">
                  Atau Masukkan Tautan (URL) Foto Guru:
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={teacherPhotoInput}
                  onChange={(e) => {
                    setTeacherPhotoInput(e.target.value);
                    setTeacherPhotoPreview(e.target.value);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveTeacherPhoto}
                disabled={!teacherPhotoInput && !teacherPhotoPreview}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                <span>Simpan Foto Guru Ini</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Foto Galeri */}
      {deleteGalleryTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Trash2 size={24} className="text-white" />
              </div>
              <div>
                <span className="bg-white/25 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  Konfirmasi Hapus Foto
                </span>
                <h3 className="text-base font-bold mt-1">Hapus Foto Galeri</h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  Foto akan dihapus dari album galeri kegiatan madrasah.
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950">
                <p className="text-slate-600 font-medium mb-1">
                  Yakin ingin menghapus foto kegiatan ini?
                </p>
                <p className="font-bold text-sm text-rose-800">
                  {deleteGalleryTarget.title} ({deleteGalleryTarget.year})
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteGalleryTarget(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteGalleryItem(deleteGalleryTarget.id);
                    showFeedback(`Foto "${deleteGalleryTarget.title}" berhasil dihapus.`);
                    setDeleteGalleryTarget(null);
                  }}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>Ya, Hapus Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
