import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  FileText,
  Video,
  Send,
  Heart,
  Library,
  Layers,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { PortalAccessGuard } from '../../components/common/PortalAccessGuard';

export const StudentPortal: React.FC = () => {
  const {
    students,
    assignments,
    materials,
    exams,
    grades,
    characterRecords,
    worshipLogs,
    updateWorshipLog,
    books,
    borrowBook,
  } = useSchool();

  const student = students[0]; // Muhammad Al Fatih
  const [activeTab, setActiveTab] = useState<'lms' | 'cbt' | 'ibadah' | 'karakter' | 'perpus'>('lms');

  // Quiz Player State
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Assignment submission
  const [submittingAsgId, setSubmittingAsgId] = useState<string | null>(null);
  const [asgAnswerText, setAsgAnswerText] = useState('');
  const [asgSuccessMsg, setAsgSuccessMsg] = useState(false);

  // Today worship log
  const todayLog = worshipLogs.find((l) => l.studentId === student.id) || {
    subuh: true,
    dzuhur: true,
    ashar: true,
    maghrib: false,
    isya: false,
    dhuha: true,
    tahajud: false,
    tadarusHalaman: 4,
  };

  const handleToggleWorship = (key: string, currentVal: boolean) => {
    updateWorshipLog({
      studentId: student.id,
      [key]: !currentVal,
    });
  };

  const handleStartExam = (id: string) => {
    setSelectedExamId(id);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleAnswerQuiz = (qId: string, answer: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleSubmitExam = () => {
    const exam = exams.find((e) => e.id === selectedExamId);
    if (!exam) return;

    let totalEarned = 0;
    let maxPoints = 0;

    exam.questions.forEach((q) => {
      maxPoints += q.points;
      if (quizAnswers[q.id] && quizAnswers[q.id].toLowerCase() === q.correctAnswer.toLowerCase()) {
        totalEarned += q.points;
      }
    });

    const finalPct = Math.round((totalEarned / maxPoints) * 100);
    setQuizScore(finalPct);
    setQuizSubmitted(true);
  };

  const handleSubmitAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgAnswerText.trim()) return;
    setAsgSuccessMsg(true);
    setTimeout(() => {
      setAsgSuccessMsg(false);
      setSubmittingAsgId(null);
      setAsgAnswerText('');
    }, 2000);
  };

  return (
    <PortalAccessGuard
      requiredRole="SISWA"
      portalName="Portal Siswa"
      loginTab="SISWA"
    >
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Student Profile Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-emerald-300 shadow-md">
              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="bg-emerald-950/70 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {student.className}
                </span>
                <span className="text-xs text-emerald-200">NISN: {student.nisn}</span>
              </div>
              <h1 className="text-2xl font-black mt-1">{student.name}</h1>
              <p className="text-xs text-emerald-100">Presensi Hari Ini: <span className="bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded-md text-[11px]">Hadir (06.48 WIB)</span></p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-emerald-950/50 p-4 rounded-2xl border border-emerald-500/20 text-center">
            <div>
              <p className="text-2xl font-black text-amber-300">45</p>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Poin Karakter</p>
            </div>
            <div className="h-8 w-px bg-emerald-700/50" />
            <div>
              <p className="text-2xl font-black text-emerald-300">92.0</p>
              <p className="text-[10px] text-emerald-200 uppercase tracking-wider font-bold">Rata-Rata Nilai</p>
            </div>
          </div>
        </div>

        {/* Portal Sub-Nav Tabs */}
        <div className="flex justify-start overflow-x-auto pb-2 no-scrollbar">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs inline-flex gap-1">
            {[
              { id: 'lms', label: 'Tugas & Materi (LMS)', icon: BookOpen },
              { id: 'cbt', label: 'Ujian CBT Online', icon: HelpCircle },
              { id: 'ibadah', label: 'Jurnal Ibadah Harian', icon: Sparkles },
              { id: 'karakter', label: 'Catatan Karakter', icon: Award },
              { id: 'perpus', label: 'E-Library Madrasah', icon: Library },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setSelectedExamId(null);
                  }}
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

        {/* TAB 1: LMS (TUGAS & MATERI) */}
        {activeTab === 'lms' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Modal Kirim Tugas */}
            {submittingAsgId && (
              <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-bold text-sm text-slate-900">
                    Kirim Lembar Jawaban: {assignments.find((a) => a.id === submittingAsgId)?.title}
                  </h3>
                  <button
                    onClick={() => setSubmittingAsgId(null)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Batal
                  </button>
                </div>
                {asgSuccessMsg ? (
                  <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Tugas berhasil dikirim ke guru pengampu!</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitAssignment} className="space-y-3">
                    <textarea
                      rows={3}
                      required
                      placeholder="Ketik ringkasan jawaban / tautan dokumen tugas Anda..."
                      value={asgAnswerText}
                      onChange={(e) => setAsgAnswerText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2"
                    >
                      <Send size={14} />
                      <span>Kirimkan Sekarang</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* List Tugas Aktif */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText size={18} className="text-emerald-600" />
                <span>Daftar Tugas & LKPD Digital</span>
              </h3>

              <div className="space-y-3">
                {assignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {asg.subject}
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">Tenggat: {asg.dueDate}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{asg.title}</h4>
                      <p className="text-xs text-slate-600">{asg.description}</p>
                    </div>

                    <button
                      onClick={() => setSubmittingAsgId(asg.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition whitespace-nowrap self-start sm:self-center"
                    >
                      Kirim Tugas
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modul & Video Belajar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Video size={18} className="text-teal-600" />
                <span>Bahan Ajar & Modul Interaktif</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {materials.map((mat) => (
                  <div key={mat.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md">
                      {mat.type} • {mat.subject}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{mat.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{mat.description}</p>
                    <div className="pt-2 border-t text-[11px] font-bold text-teal-700 flex items-center justify-between">
                      <span>Kemajuan: {mat.progressPercentage}%</span>
                      <button className="text-emerald-700 hover:underline">Buka Materi →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CBT ONLINE */}
        {activeTab === 'cbt' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            {!selectedExamId ? (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900">Ujian Formatif & CBT Online Aktif</h3>
                <div className="space-y-3">
                  {exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          {exam.subject}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{exam.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {exam.totalQuestions} Soal • Durasi: {exam.durationMinutes} Menit • Batas: {exam.deadline}
                        </p>
                      </div>

                      <button
                        onClick={() => handleStartExam(exam.id)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Mulai Kerjakan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Active Quiz Session */
              <div className="space-y-6">
                {(() => {
                  const exam = exams.find((e) => e.id === selectedExamId);
                  if (!exam) return null;

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <span className="text-xs text-emerald-700 font-bold">{exam.subject} • CBT Interaktif</span>
                          <h3 className="text-lg font-extrabold text-slate-900">{exam.title}</h3>
                        </div>
                        <button
                          onClick={() => setSelectedExamId(null)}
                          className="text-xs text-slate-500 hover:text-slate-800"
                        >
                          Tutup
                        </button>
                      </div>

                      {quizSubmitted ? (
                        <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-300 text-center space-y-4">
                          <Award size={48} className="mx-auto text-amber-500" />
                          <h4 className="text-2xl font-black text-emerald-900">Ujian Berhasil Diselesaikan!</h4>
                          <p className="text-sm text-emerald-800">
                            Skor Sementara Anda: <strong className="text-2xl font-bold text-slate-900 ml-1">{quizScore} / 100</strong>
                          </p>
                          <button
                            onClick={() => setSelectedExamId(null)}
                            className="px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs rounded-xl"
                          >
                            Kembali ke Daftar CBT
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {exam.questions.map((q, idx) => (
                            <div key={q.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-emerald-800">Soal No. {idx + 1} ({q.points} Poin)</span>
                                <span className="text-slate-400 font-semibold capitalize">{q.type.replace('_', ' ')}</span>
                              </div>
                              <p className="text-sm font-semibold text-slate-900 leading-relaxed">{q.questionText}</p>

                              {q.options && (
                                <div className="space-y-2 pt-2">
                                  {q.options.map((opt, oIdx) => (
                                    <label
                                      key={oIdx}
                                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                                        quizAnswers[q.id] === opt
                                          ? 'bg-emerald-100/70 border-emerald-500 font-bold'
                                          : 'bg-white border-slate-200 hover:bg-slate-100'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={q.id}
                                        checked={quizAnswers[q.id] === opt}
                                        onChange={() => handleAnswerQuiz(q.id, opt)}
                                      />
                                      <span className="text-xs text-slate-800">{opt}</span>
                                    </label>
                                  ))}
                                </div>
                              )}

                              {q.type === 'essay' && (
                                <textarea
                                  rows={3}
                                  placeholder="Ketik jawaban penjelasan Anda..."
                                  value={quizAnswers[q.id] || ''}
                                  onChange={(e) => handleAnswerQuiz(q.id, e.target.value)}
                                  className="w-full bg-white border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500"
                                />
                              )}
                            </div>
                          ))}

                          <button
                            onClick={handleSubmitExam}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition"
                          >
                            Kumpulkan Lembar Jawaban Ujian
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: JURNAL IBADAH HARIAN */}
        {activeTab === 'ibadah' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-500" />
                  <span>Jurnal Ibadah Harian Santri (Mutaba'ah Yaumiyyah)</span>
                </h3>
                <p className="text-xs text-slate-500">Centang pembiasaan ibadah hari ini. Data tersinkron ke portal orang tua & guru.</p>
              </div>
              <span className="bg-emerald-50 text-emerald-800 font-mono font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { key: 'subuh', label: 'Shalat Subuh', val: todayLog.subuh, time: 'Berjamaah' },
                { key: 'dhuha', label: 'Shalat Dhuha', val: todayLog.dhuha, time: 'Di Madrasah' },
                { key: 'dzuhur', label: 'Shalat Dzuhur', val: todayLog.dzuhur, time: 'Berjamaah' },
                { key: 'ashar', label: 'Shalat Ashar', val: todayLog.ashar, time: 'Tepat Waktu' },
                { key: 'maghrib', label: 'Shalat Maghrib', val: todayLog.maghrib, time: 'Di Rumah / Masjid' },
                { key: 'isya', label: 'Shalat Isya', val: todayLog.isya, time: 'Berjamaah' },
                { key: 'tahajud', label: 'Qiyamul Lail', val: todayLog.tahajud, time: 'Sunnah' },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleToggleWorship(item.key, item.val)}
                  className={`cursor-pointer p-4 rounded-2xl border transition text-center flex flex-col justify-between ${
                    item.val
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                    <CheckCircle2 size={16} className={item.val ? 'text-emerald-600' : 'text-slate-300'} />
                  </div>
                  <h4 className="font-bold text-xs">{item.label}</h4>
                  <span className={`text-[10px] font-bold mt-2 ${item.val ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {item.val ? 'Sudah Dilaksanakan' : 'Belum'}
                  </span>
                </div>
              ))}
            </div>

            {/* Tadarus Quran Counter */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs text-slate-900">Tadarus & Tilawah Al-Qur'an Hari Ini</h4>
                <p className="text-[11px] text-slate-500">Membiasakan minimal 2-4 halaman per hari</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateWorshipLog({ studentId: student.id, tadarusHalaman: Math.max(0, todayLog.tadarusHalaman - 1) })}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold"
                >
                  -
                </button>
                <span className="text-base font-black text-emerald-800">{todayLog.tadarusHalaman} Halaman</span>
                <button
                  onClick={() => updateWorshipLog({ studentId: student.id, tadarusHalaman: todayLog.tadarusHalaman + 1 })}
                  className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATATAN KARAKTER */}
        {activeTab === 'karakter' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award size={20} className="text-amber-500" />
              <span>Rekam Jejak Apresiasi Karakter Guru</span>
            </h3>

            <div className="space-y-3">
              {characterRecords.map((cp) => (
                <div key={cp.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        {cp.dimension}
                      </span>
                      <span className="text-[11px] text-slate-400">{cp.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">"{cp.note}"</p>
                    <p className="text-[11px] text-slate-400">Pemberi Apresiasi: {cp.teacherName}</p>
                  </div>

                  <span className="text-base font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    +{cp.points} Poin
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: E-LIBRARY */}
        {activeTab === 'perpus' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Library size={20} className="text-emerald-700" />
                  <span>Katalog Perpustakaan & E-Book Madrasah</span>
                </h3>
                <p className="text-xs text-slate-500">Pinjam buku ensiklopedia, kisah Islami, dan panduan koding cilik.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {books.map((b) => (
                <div key={b.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className={`h-24 rounded-xl ${b.coverColor} text-white p-3 flex flex-col justify-between`}>
                      <span className="text-[10px] font-bold uppercase">{b.category}</span>
                      <span className="text-xs font-black line-clamp-2">{b.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Penulis: {b.author}</p>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{b.description}</p>
                  </div>

                  <div className="pt-3 mt-3 border-t flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Tersedia: <strong>{b.availableCopies}</strong></span>
                    <button
                      onClick={() => borrowBook(b.id, student.name, 'SISWA')}
                      disabled={b.availableCopies <= 0}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-[11px] rounded-lg"
                    >
                      Pinjam
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </PortalAccessGuard>
  );
};
