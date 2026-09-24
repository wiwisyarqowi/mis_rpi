import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Printer,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { SPMBApplication } from '../../types';

export const SpmbPage: React.FC = () => {
  const { settings, spmbApplications, submitSPMB } = useSchool();

  // Form State
  const [studentName, setStudentName] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [nik, setNik] = useState('');
  const [nisn, setNisn] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [address, setAddress] = useState('');
  const [programChosen, setProgramChosen] = useState<'Kelas Reguler Unggulan' | 'Kelas Tahfiz & Digital Science'>('Kelas Tahfiz & Digital Science');

  // Submission success result
  const [submittedApp, setSubmittedApp] = useState<SPMBApplication | null>(null);

  // Tracking tab
  const [trackRegNum, setTrackRegNum] = useState('');
  const [trackResult, setTrackResult] = useState<SPMBApplication | null>(null);
  const [trackSearched, setTrackSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !parentPhone) return;

    const result = submitSPMB({
      studentName,
      birthPlace,
      birthDate,
      gender,
      nik,
      nisn,
      previousSchool,
      parentName,
      parentPhone,
      address,
      programChosen,
    });

    setSubmittedApp(result);
  };

  const handleTrack = () => {
    setTrackSearched(true);
    const found = spmbApplications.find(
      (a) => a.registrationNumber.toLowerCase() === trackRegNum.trim().toLowerCase()
    );
    setTrackResult(found || null);
  };

  const resetForm = () => {
    setSubmittedApp(null);
    setStudentName('');
    setBirthPlace('');
    setBirthDate('');
    setNik('');
    setNisn('');
    setPreviousSchool('');
    setParentName('');
    setParentPhone('');
    setAddress('');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Penerimaan Murid Baru (SPMB) 2027/2028 • Tempat Terbatas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pendaftaran Siswa Baru MI RPI Jakarta
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Wujudkan masa depan ananda tercinta dengan pendidikan berkarakter Islam yang kuat, ramah anak, dan cakap teknologi digital di Kuningan, Jakarta Selatan.
          </p>
        </div>

        {/* Info Box Alur Pendaftaran */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Isi Formulir', desc: 'Lengkapi data identitas calon murid & orang tua secara online.' },
            { step: '2', title: 'Verifikasi Berkas', desc: 'Panitia memeriksa dokumen KK, Akta, dan foto secara digital.' },
            { step: '3', title: 'Observasi Anak', desc: 'Pemetaan kecakapan sosio-emosional & minat belajar anak.' },
            { step: '4', title: 'Pengumuman', desc: 'Penerimaan resmi & pengisian formulir daftar ulang.' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                {s.step}
              </span>
              <div>
                <h4 className="font-bold text-xs text-slate-900">{s.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tracking Search Bar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-emerald-700" />
            <div>
              <h4 className="font-bold text-xs text-slate-900">Sudah Mendaftar? Lacak Status</h4>
              <p className="text-[11px] text-slate-500">Masukkan nomor pendaftaran (contoh: SPMB-2027-0012)</p>
            </div>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <input
              type="text"
              placeholder="Nomor Pendaftaran..."
              value={trackRegNum}
              onChange={(e) => setTrackRegNum(e.target.value)}
              className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleTrack}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              Lacak
            </button>
          </div>
        </div>

        {/* Track Result Card */}
        {trackSearched && (
          <div className="p-6 bg-white rounded-3xl border border-emerald-200 shadow-sm animate-in fade-in">
            {trackResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Hasil Pelacakan</span>
                    <h3 className="font-bold text-base text-slate-900">{trackResult.studentName}</h3>
                    <p className="text-xs text-emerald-700 font-mono font-bold">{trackResult.registrationNumber}</p>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Status: {trackResult.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2">
                  <p>Program: <strong>{trackResult.programChosen}</strong></p>
                  <p>Tanggal Daftar: <strong>{trackResult.registrationDate}</strong></p>
                  <p>Asal Sekolah: <strong>{trackResult.previousSchool}</strong></p>
                  <p>Catatan Panitia: <em>{trackResult.notes || 'Dalam proses review'}</em></p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500">
                <AlertCircle size={24} className="mx-auto text-amber-500 mb-2" />
                Nomor pendaftaran <strong>"{trackRegNum}"</strong> tidak ditemukan dalam sistem. Mohon periksa kembali.
              </div>
            )}
          </div>
        )}

        {/* If Application Just Submitted: Show Digital Registration Card */}
        {submittedApp ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl p-8 sm:p-10 space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white p-0.5 border border-emerald-300 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
                  <img
                    src="/images/logo-yayasan-rpi.svg"
                    alt="Logo Yayasan RPI"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">KARTU REGISTRASI SPMB DIGITAL</h3>
                  <p className="text-xs text-emerald-700 font-semibold">{settings.schoolName} — TP {settings.academicYear || '2027/2028'}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Nomor Pendaftaran Resmi</span>
                <span className="text-lg font-mono font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {submittedApp.registrationNumber}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] text-emerald-800">Identitas Calon Siswa</h4>
                <p>Nama Lengkap: <strong className="text-slate-900">{submittedApp.studentName}</strong></p>
                <p>Tempat, Tanggal Lahir: <strong>{submittedApp.birthPlace}, {submittedApp.birthDate}</strong></p>
                <p>Jenis Kelamin: <strong>{submittedApp.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</strong></p>
                <p>Asal TK / RA: <strong>{submittedApp.previousSchool}</strong></p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] text-emerald-800">Pilihan Program & Kontak</h4>
                <p>Program: <strong className="text-emerald-800">{submittedApp.programChosen}</strong></p>
                <p>Nama Orang Tua: <strong>{submittedApp.parentName}</strong></p>
                <p>No. WhatsApp: <strong>{submittedApp.parentPhone}</strong></p>
                <p>Status Awal: <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">{submittedApp.status}</span></p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-700" />
                <span>Pendaftaran Berhasil Dikirimkan!</span>
              </p>
              <p>
                Simpan nomor pendaftaran ini. Panitia SPMB MI RPI Jakarta akan menghubungi nomor WhatsApp terdaftar untuk konfirmasi berkas dan jadwal observasi anak.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2"
              >
                <Printer size={16} />
                <span>Cetak Bukti Pendaftaran</span>
              </button>

              <button
                onClick={resetForm}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
              >
                Daftarkan Calon Siswa Baru Lainnya
              </button>
            </div>
          </div>
        ) : (
          /* Pendaftaran Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 sm:p-10 space-y-8"
          >
            {/* Bagian A: Calon Siswa */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                  A
                </span>
                <span>Data Calon Peserta Didik</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Rayhan"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin *</label>
                  <div className="flex gap-4 pt-1.5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'L'}
                        onChange={() => setGender('L')}
                        className="text-emerald-600"
                      />
                      <span>Laki-Laki</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'P'}
                        onChange={() => setGender('P')}
                        className="text-emerald-600"
                      />
                      <span>Perempuan</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tempat Lahir *</label>
                  <input
                    type="text"
                    required
                    placeholder="Jakarta"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal Lahir *</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIK Siswa (sesuai Kartu Keluarga)</label>
                  <input
                    type="text"
                    placeholder="16 Digit NIK"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Asal TK / RA / PAUD *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: RA Al-Ikhlas"
                    value={previousSchool}
                    onChange={(e) => setPreviousSchool(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Bagian B: Orang Tua */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                  B
                </span>
                <span>Data Orang Tua / Wali Murid</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Ayah / Ibu / Wali *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Orang Tua"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    placeholder="08xxxxxxxxxx"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Undangan observasi akan dikirim melalui nomor ini</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Alamat Domisili Tempat Tinggal *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Bagian C: Pilihan Program */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                  C
                </span>
                <span>Pilihan Program Unggulan</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  onClick={() => setProgramChosen('Kelas Tahfiz & Digital Science')}
                  className={`p-5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    programChosen === 'Kelas Tahfiz & Digital Science'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={programChosen === 'Kelas Tahfiz & Digital Science'}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Kelas Tahfiz & Digital Science (Favorit)</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Fokus pada hafalan Al-Qur'an mutqin Juz 30-29, logika koding Scratch, dan sains eksperimental.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setProgramChosen('Kelas Reguler Unggulan')}
                  className={`p-5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                    programChosen === 'Kelas Reguler Unggulan'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-emerald-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={programChosen === 'Kelas Reguler Unggulan'}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Kelas Reguler Unggulan</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Kurikulum Merdeka Terintegrasi Kemenag dengan pembiasaan adab ramah anak dan literasi bahasa.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Disclaimer & Submit */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                Data pribadi dilindungi dan hanya digunakan untuk keperluan admisi resmi madrasah.
              </p>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-2xl shadow-xl shadow-emerald-700/25 transition"
              >
                Kirim Formulir SPMB Sekarang
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
