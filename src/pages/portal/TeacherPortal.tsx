import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Calendar,
  Award,
  BookOpen,
  Plus,
  Sparkles,
  Save,
  HelpCircle,
  FileSpreadsheet,
  ExternalLink,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { GradeItem, AttendanceRecord } from '../../types';
import { PortalAccessGuard } from '../../components/common/PortalAccessGuard';

export const TeacherPortal: React.FC = () => {
  const {
    students,
    attendance,
    markAttendance,
    grades,
    saveGrade,
    addCharacterPoints,
    generateAssessmentDraft,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'presensi' | 'nilai' | 'karakter' | 'banksoal' | 'rdm'>('presensi');

  // Attendance Form State
  const [selectedStatus, setSelectedStatus] = useState<Record<string, AttendanceRecord['status']>>({
    'std-001': 'Hadir',
    'std-002': 'Hadir',
    'std-003': 'Izin',
    'std-004': 'Hadir',
  });
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Grade Input Form State
  const [selectedStudentForGrade, setSelectedStudentForGrade] = useState(students[0].id);
  const [subjectInput, setSubjectInput] = useState('Matematika');
  const [f1, setF1] = useState(88);
  const [f2, setF2] = useState(90);
  const [sumatif, setSumatif] = useState(92);
  const [pts, setPts] = useState(89);
  const [pas, setPas] = useState(91);
  const [gradeSavedNotice, setGradeSavedNotice] = useState(false);

  // Character Point Form State
  const [charStudentId, setCharStudentId] = useState(students[0].id);
  const [charDimension, setCharDimension] = useState<any>('Kejujuran');
  const [charPoints, setCharPoints] = useState(15);
  const [charNote, setCharNote] = useState('');
  const [charSavedNotice, setCharSavedNotice] = useState(false);

  // Bank Soal Generator State
  const [genSubject, setGenSubject] = useState('Al-Qur\'an Hadits');
  const [genTopic, setGenTopic] = useState('Surah Al-Ma\'un dan Perilaku Peduli Yatim');
  const [genCount, setGenCount] = useState(4);
  const [genNotice, setGenNotice] = useState(false);

  const handleSaveAttendance = () => {
    Object.entries(selectedStatus).forEach(([stdId, status]) => {
      markAttendance(stdId, status);
    });
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = Math.round((f1 + f2 + sumatif + pts + pas) / 5);
    const predicate: 'A' | 'B' | 'C' | 'D' = finalScore >= 90 ? 'A' : finalScore >= 80 ? 'B' : finalScore >= 70 ? 'C' : 'D';
    const std = students.find((s) => s.id === selectedStudentForGrade);

    const newGrade: GradeItem = {
      id: `grd-${Date.now()}`,
      studentId: selectedStudentForGrade,
      studentName: std?.name || 'Siswa',
      className: 'Kelas 4A',
      subject: subjectInput,
      formatif1: f1,
      formatif2: f2,
      sumatifLingkupMateri: sumatif,
      pts,
      pas,
      finalScore,
      predicate,
      competencyAchievement: `Menunjukkan penguasaan capaian pembelajaran yang sangat baik pada materi ${subjectInput}.`,
    };

    saveGrade(newGrade);
    setGradeSavedNotice(true);
    setTimeout(() => setGradeSavedNotice(false), 3000);
  };

  const handleSaveCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!charNote) return;
    addCharacterPoints(charStudentId, charDimension, charPoints, charNote);
    setCharSavedNotice(true);
    setCharNote('');
    setTimeout(() => setCharSavedNotice(false), 3000);
  };

  const handleGenerateExam = (e: React.FormEvent) => {
    e.preventDefault();
    generateAssessmentDraft(genSubject, 'Kelas 4A', genTopic, genCount);
    setGenNotice(true);
    setTimeout(() => setGenNotice(false), 3000);
  };

  return (
    <PortalAccessGuard
      requiredRole={['GURU', 'WALI_KELAS']}
      portalName="Portal Guru"
      loginTab="GURU"
    >
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Guru */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left relative z-10">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-emerald-300 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80"
                alt="Ustadz Ahmad Fauzi"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="bg-emerald-950/70 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                Pendidik & Wali Kelas 4A
              </span>
              <h1 className="text-2xl font-black mt-1">Ustadz Ahmad Fauzi, S.Pd.I</h1>
              <p className="text-xs text-emerald-100">
                NIP: 198803152014031002 • PAI & Al-Qur'an Hadits • Kelas Binaan: 4A (28 Siswa)
              </p>
            </div>
          </div>

          {/* Quick External Link to Official RDM MIS RPI Server */}
          <div className="flex flex-col sm:flex-row items-center gap-2 relative z-10 w-full sm:w-auto">
            <a
              href="https://misrpi.sch.id/rdm/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer group"
              title="Buka Aplikasi Rapor Digital Madrasah (RDM) Resmi Kemenag RI di https://misrpi.sch.id/rdm/"
            >
              <span className="text-base">🏛️</span>
              <span>Masuk RDM Kemenag (misrpi.sch.id/rdm)</span>
              <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Tab Controls & RDM Direct Launch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs inline-flex gap-1 overflow-x-auto max-w-full">
            {[
              { id: 'presensi', label: 'Presensi Harian Kelas', icon: CheckCircle2 },
              { id: 'nilai', label: 'Input Nilai & e-Rapor', icon: FileSpreadsheet },
              { id: 'karakter', label: 'Apresiasi Karakter Siswa', icon: Award },
              { id: 'banksoal', label: 'Generator & Bank Soal Asesmen', icon: HelpCircle },
              { id: 'rdm', label: 'Info Server RDM Kemenag', icon: Globe },
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

          {/* Direct External Link Button beside tabs */}
          <a
            href="https://misrpi.sch.id/rdm/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer group"
          >
            <span>Buka RDM di Tab Baru</span>
            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* TAB 1: PRESENSI KELAS 4A */}
        {activeTab === 'presensi' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Checklist Presensi Siswa Kelas 4A</h3>
                <p className="text-xs text-slate-500">
                  Tanggal: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <button
                onClick={handleSaveAttendance}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 self-start"
              >
                <Save size={16} />
                <span>Simpan Presensi Kelas</span>
              </button>
            </div>

            {attendanceSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                Presensi harian berhasil disimpan dan otomatis tersinkron ke portal orang tua masing-masing!
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Nama Siswa</th>
                    <th className="py-3 px-4">NISN</th>
                    <th className="py-3 px-4 text-center">Hadir</th>
                    <th className="py-3 px-4 text-center">Izin</th>
                    <th className="py-3 px-4 text-center">Sakit</th>
                    <th className="py-3 px-4 text-center">Alpa</th>
                    <th className="py-3 px-4 text-center">Terlambat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{std.name}</td>
                      <td className="py-3.5 px-4 text-slate-500">{std.nisn}</td>
                      {(['Hadir', 'Izin', 'Sakit', 'Alpa', 'Terlambat'] as const).map((st) => (
                        <td key={st} className="py-3.5 px-4 text-center">
                          <input
                            type="radio"
                            name={`att-${std.id}`}
                            checked={selectedStatus[std.id] === st}
                            onChange={() => setSelectedStatus((prev) => ({ ...prev, [std.id]: st }))}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: INPUT NILAI & E-RAPOR */}
        {activeTab === 'nilai' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Banner Integrasi Resmi RDM Kemenag */}
            <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-6 sm:p-7 border-2 border-emerald-300/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5 bg-white">
              <div className="flex items-start gap-4">
                <div className="w-13 h-13 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                  🏛️
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <ShieldCheck size={12} className="text-emerald-700" />
                    <span>Server Resmi Kemenag RI</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    Aplikasi Rapor Digital Madrasah (RDM) MIS RPI Jakarta
                  </h4>
                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    Untuk pencetakan buku rapor resmi semesteran, penguncian ledger kurikulum, dan sinkronisasi data EMIS Kemenag, silakan akses portal RDM madrasah melalui tautan resmi di bawah ini.
                  </p>
                  <p className="text-xs font-mono font-bold text-emerald-800 pt-0.5">
                    🌐 Alamat Server: <span className="underline">https://misrpi.sch.id/rdm/</span>
                  </p>
                </div>
              </div>

              <a
                href="https://misrpi.sch.id/rdm/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 whitespace-nowrap self-stretch sm:self-auto justify-center cursor-pointer group"
                title="Buka Aplikasi RDM di https://misrpi.sch.id/rdm/"
              >
                <span>Buka Server RDM Kemenag</span>
                <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Form Asesmen Formatif & Sumatif Siswa (Lokal)</h3>
                  <p className="text-xs text-slate-500">Pencatatan nilai harian dan rekap per mata pelajaran kelas binaan</p>
                </div>
              </div>

            {gradeSavedNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                Nilai berhasil disimpan dan tercatat di transkrip e-Rapor resmi!
              </div>
            )}

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilih Siswa *</label>
                  <select
                    value={selectedStudentForGrade}
                    onChange={(e) => setSelectedStudentForGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.className})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran *</label>
                  <select
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  >
                    <option value="Al-Qur'an Hadits">Al-Qur'an Hadits</option>
                    <option value="Akidah Akhlak">Akidah Akhlak</option>
                    <option value="Fikih">Fikih Ibadah</option>
                    <option value="Matematika">Matematika</option>
                    <option value="IPAS">IPAS (Sains & Sosial)</option>
                    <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    <option value="Informatika">Informatika & Koding</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Formatif 1</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={f1}
                    onChange={(e) => setF1(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Formatif 2</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={f2}
                    onChange={(e) => setF2(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sumatif LM</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={sumatif}
                    onChange={(e) => setSumatif(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PTS (Tengah)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={pts}
                    onChange={(e) => setPts(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-center font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PAS (Akhir)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={pas}
                    onChange={(e) => setPas(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-center font-bold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                >
                  Simpan Nilai Siswa
                </button>
              </div>
            </form>
            </div>
          </div>
        )}

        {/* TAB 3: APRESIASI KARAKTER */}
        {activeTab === 'karakter' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Beri Apresiasi Poin Karakter Santri</h3>

            {charSavedNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                Poin karakter berhasil ditambahkan dan langsung memberi notifikasi ke wali murid!
              </div>
            )}

            <form onSubmit={handleSaveCharacter} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Siswa *</label>
                  <select
                    value={charStudentId}
                    onChange={(e) => setCharStudentId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.className})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dimensi Karakter *</label>
                  <select
                    value={charDimension}
                    onChange={(e) => setCharDimension(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  >
                    <option value="Kejujuran">Kejujuran</option>
                    <option value="Ibadah">Ibadah & Doa</option>
                    <option value="Disiplin">Disiplin Waktu</option>
                    <option value="Tanggung Jawab">Tanggung Jawab</option>
                    <option value="Kerja Sama">Kerja Sama</option>
                    <option value="Kebersihan">Kebersihan Lingkungan</option>
                    <option value="Literasi">Literasi & Nalar Kritis</option>
                    <option value="Kepedulian">Kepedulian Sosial / Sedekah</option>
                    <option value="Kemandirian">Kemandirian</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jumlah Poin Apresiasi *</label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    step={5}
                    value={charPoints}
                    onChange={(e) => setCharPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Kebaikan Siswa *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Mengembalikan buku perpustakaan tepat waktu dan merapikan rak buku dengan inisiatif sendiri."
                  value={charNote}
                  onChange={(e) => setCharNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Kirim Apresiasi Poin
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: GENERATOR & BANK SOAL */}
        {activeTab === 'banksoal' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <span>Generator Asesmen & Bank Soal Digital</span>
            </h3>

            {genNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
                Draf paket asesmen baru berhasil dibuat dan ditambahkan ke daftar CBT Siswa!
              </div>
            )}

            <form onSubmit={handleGenerateExam} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran *</label>
                  <select
                    value={genSubject}
                    onChange={(e) => setGenSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  >
                    <option value="Al-Qur'an Hadits">Al-Qur'an Hadits</option>
                    <option value="Fikih">Fikih Ibadah</option>
                    <option value="Matematika">Matematika</option>
                    <option value="IPAS">IPAS</option>
                    <option value="Informatika">Informatika & Koding Scratch</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Topik / Lingkup Materi *</label>
                  <input
                    type="text"
                    required
                    value={genTopic}
                    onChange={(e) => setGenTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                <span>Buat Paket Soal Asesmen</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: INTEGRASI RESMI RDM KEMENAG */}
        {activeTab === 'rdm' && (
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-8 animate-in fade-in">
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto shadow-sm border border-emerald-200">
                🏛️
              </div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                <ShieldCheck size={14} className="text-emerald-700" />
                <span>Rapor Digital Madrasah (RDM) Kementerian Agama RI</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Pintu Masuk Server RDM MIS RPI Jakarta
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                RDM adalah aplikasi resmi Direktorat KSKK Madrasah Ditjen Pendidikan Islam Kemenag RI untuk tata kelola penilaian hasil belajar peserta didik di MI RPI Jakarta.
              </p>
            </div>

            {/* Main Action Launcher Card */}
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                  Tautan Langsung Resmi:
                </span>
                <div className="p-3 bg-black/30 rounded-2xl border border-white/10 font-mono text-sm sm:text-base font-bold text-emerald-200 break-all select-all flex items-center justify-between gap-3">
                  <span>https://misrpi.sch.id/rdm/</span>
                  <span className="text-[10px] uppercase font-sans font-extrabold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-400/30">
                    Aktif
                  </span>
                </div>
              </div>

              <div className="space-y-3 relative z-10 pt-2 border-t border-white/10 text-xs text-slate-200">
                <p className="font-bold text-white">Panduan Masuk bagi Guru / Wali Kelas:</p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed text-slate-300">
                  <li>Klik tombol <strong className="text-amber-300">"Buka Aplikasi RDM Sekarang"</strong> di bawah ini.</li>
                  <li>Sistem akan membuka server RDM MIS RPI di tab peramban baru.</li>
                  <li>Masukkan <strong>NIP atau Username Guru</strong> Anda yang sudah didaftarkan oleh Operator Madrasah.</li>
                  <li>Masukkan <strong>Password RDM</strong> Anda dan pilih semester aktif.</li>
                </ol>
              </div>

              <div className="pt-2 relative z-10">
                <a
                  href="https://misrpi.sch.id/rdm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer group text-center"
                >
                  <span>Buka Aplikasi RDM Sekarang (misrpi.sch.id/rdm)</span>
                  <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </PortalAccessGuard>
  );
};
