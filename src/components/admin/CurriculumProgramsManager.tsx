import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  HeartHandshake,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Search,
  CheckCircle,
  Layers,
  SunMedium,
  Compass,
  X,
  ShieldCheck,
  BookOpenCheck,
  Library,
  Atom,
  Code2,
  Palette,
  Target,
  Swords,
  Flame,
  Music2,
  Users,
  Lightbulb,
  Clock,
  Calendar,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import {
  FlagshipProgram,
  GraduateDimension,
  AcademicSubjectGroup,
  StudentHabit,
  Extracurricular,
  ScheduleItem,
} from '../../types';
import {
  initialPrograms,
  initialDimensions,
  initialAcademicSubjects,
  initialHabits,
  initialExtracurriculars,
} from '../../data/initialData';

export const CurriculumProgramsManager: React.FC = () => {
  const {
    programs,
    addProgram,
    updateProgram,
    deleteProgram,
    dimensions,
    updateDimensions,
    academicSubjects,
    updateAcademicSubjects,
    habits,
    updateHabits,
    extracurriculars,
    updateExtracurriculars,
    schedules,
    addScheduleItem,
    updateScheduleItem,
    deleteScheduleItem,
    resetSchedulesToDefault,
    teachers,
    classes,
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'programs' | 'academic' | 'kesiswaan'>('programs');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // --- PROGRAM UNGGULAN STATE ---
  const [programSearch, setProgramSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [editingProgram, setEditingProgram] = useState<FlagshipProgram | null>(null);
  const [isNewProgramModalOpen, setIsNewProgramModalOpen] = useState(false);
  const [programFormData, setProgramFormData] = useState<Omit<FlagshipProgram, 'id'>>({
    name: '',
    category: 'Pendidikan Karakter',
    icon: 'Sparkles',
    description: '',
    objective: '',
    documentation: '',
    kpi: '',
  });

  // --- SCHEDULES (SIMULASI KBM) STATE ---
  const [scheduleDayFilter, setScheduleDayFilter] = useState<string>('Semua');
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [schFormData, setSchFormData] = useState<Omit<ScheduleItem, 'id'>>({
    day: 'Senin',
    time: '07.45 - 08.45',
    className: 'Kelas 4A',
    subject: '',
    teacherName: '',
    room: 'Ruang Kelas 4A',
  });

  // --- DIMENSIONS STATE ---
  const [editingDimension, setEditingDimension] = useState<GraduateDimension | null>(null);
  const [isDimensionModalOpen, setIsDimensionModalOpen] = useState(false);
  const [dimTitle, setDimTitle] = useState('');
  const [dimDesc, setDimDesc] = useState('');

  // --- ACADEMIC SUBJECTS STATE ---
  const [newSubjectInputs, setNewSubjectInputs] = useState<{ [groupId: string]: string }>({});
  const [newGroupCategory, setNewGroupCategory] = useState('');
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

  // --- HABITS STATE ---
  const [editingHabit, setEditingHabit] = useState<StudentHabit | null>(null);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [habitTime, setHabitTime] = useState('');
  const [habitTitle, setHabitTitle] = useState('');
  const [habitDesc, setHabitDesc] = useState('');

  // --- EXTRACURRICULAR STATE ---
  const [editingExcur, setEditingExcur] = useState<Extracurricular | null>(null);
  const [isExcurModalOpen, setIsExcurModalOpen] = useState(false);
  const [excurName, setExcurName] = useState('');
  const [excurCategory, setExcurCategory] = useState('');
  const [excurIcon, setExcurIcon] = useState('⚽');
  const [excurDesc, setExcurDesc] = useState('');

  // Icon helper
  const availableIcons = [
    'Sparkles',
    'ShieldCheck',
    'Compass',
    'BookOpenCheck',
    'Library',
    'Atom',
    'Code2',
    'Palette',
    'Target',
    'Swords',
    'Flame',
    'Music2',
    'SunMedium',
    'Users',
    'Lightbulb',
  ];

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck size={20} />;
      case 'Sparkles': return <Sparkles size={20} />;
      case 'Compass': return <Compass size={20} />;
      case 'BookOpenCheck': return <BookOpenCheck size={20} />;
      case 'Library': return <Library size={20} />;
      case 'Atom': return <Atom size={20} />;
      case 'Code2': return <Code2 size={20} />;
      case 'Palette': return <Palette size={20} />;
      case 'Target': return <Target size={20} />;
      case 'Swords': return <Swords size={20} />;
      case 'Flame': return <Flame size={20} />;
      case 'Music2': return <Music2 size={20} />;
      case 'SunMedium': return <SunMedium size={20} />;
      case 'Users': return <Users size={20} />;
      default: return <Lightbulb size={20} />;
    }
  };

  // --- PROGRAM UNGGULAN HANDLERS ---
  const handleOpenAddProgram = () => {
    setProgramFormData({
      name: '',
      category: 'Pendidikan Karakter',
      icon: 'Sparkles',
      description: '',
      objective: '',
      documentation: '',
      kpi: '',
    });
    setEditingProgram(null);
    setIsNewProgramModalOpen(true);
  };

  const handleOpenEditProgram = (prog: FlagshipProgram) => {
    setEditingProgram(prog);
    setProgramFormData({
      name: prog.name,
      category: prog.category,
      icon: prog.icon || 'Sparkles',
      description: prog.description,
      objective: prog.objective,
      documentation: prog.documentation,
      kpi: prog.kpi,
    });
    setIsNewProgramModalOpen(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programFormData.name.trim()) return;

    if (editingProgram) {
      updateProgram(editingProgram.id, programFormData);
      showToast(`Program "${programFormData.name}" berhasil diperbarui!`);
    } else {
      addProgram(programFormData);
      showToast(`Program baru "${programFormData.name}" berhasil ditambahkan!`);
    }
    setIsNewProgramModalOpen(false);
  };

  const handleDeleteProgram = (prog: FlagshipProgram) => {
    if (confirm(`Apakah Anda yakin ingin menghapus program "${prog.name}"?`)) {
      deleteProgram(prog.id);
      showToast(`Program "${prog.name}" berhasil dihapus.`);
    }
  };

  const handleResetPrograms = () => {
    if (confirm('Kembalikan 15 Program Unggulan ke data default bawaan madrasah?')) {
      // update all back to initialPrograms
      initialPrograms.forEach((ip) => {
        updateProgram(ip.id, ip);
      });
      showToast('Program unggulan berhasil direset ke standar bawaan.');
    }
  };

  // Filtered programs
  const filteredPrograms = programs.filter((p) => {
    const matchCat = selectedCategory === 'Semua' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch =
      p.name.toLowerCase().includes(programSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(programSearch.toLowerCase()) ||
      p.objective.toLowerCase().includes(programSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const categories = [
    'Semua',
    'Pendidikan Karakter',
    'Keagamaan Unggulan',
    'Akademik & Literasi',
    'Sains & Riset',
    'Teknologi Informasi',
    'Olahraga Sunnah',
    'Seni & Budaya',
    'Kurikulum Merdeka',
    'Lingkungan & Perlindungan',
    'Kepanduan & Karakter',
  ];

  // --- DIMENSIONS HANDLERS ---
  const handleOpenAddDimension = () => {
    setEditingDimension(null);
    setDimTitle('');
    setDimDesc('');
    setIsDimensionModalOpen(true);
  };

  const handleOpenEditDimension = (dim: GraduateDimension) => {
    setEditingDimension(dim);
    setDimTitle(dim.title);
    setDimDesc(dim.desc);
    setIsDimensionModalOpen(true);
  };

  const handleSaveDimension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dimTitle.trim()) return;

    if (editingDimension) {
      const updated = dimensions.map((d) =>
        (d.id === editingDimension.id || d.title === editingDimension.title)
          ? { ...d, title: dimTitle, desc: dimDesc }
          : d
      );
      updateDimensions(updated);
      showToast(`Dimensi "${dimTitle}" berhasil diperbarui!`);
    } else {
      const newDim: GraduateDimension = {
        id: Date.now(),
        title: dimTitle,
        desc: dimDesc,
      };
      updateDimensions([...dimensions, newDim]);
      showToast(`Dimensi baru "${dimTitle}" berhasil ditambahkan!`);
    }
    setIsDimensionModalOpen(false);
  };

  const handleDeleteDimension = (idx: number, title: string) => {
    if (confirm(`Hapus dimensi "${title}"?`)) {
      const updated = dimensions.filter((_, i) => i !== idx);
      updateDimensions(updated);
      showToast(`Dimensi "${title}" berhasil dihapus.`);
    }
  };

  const handleResetDimensions = () => {
    if (confirm('Kembalikan 8 Dimensi Profil Lulusan ke standar awal?')) {
      updateDimensions(initialDimensions);
      showToast('Dimensi kelulusan berhasil direset ke standar awal.');
    }
  };

  // --- ACADEMIC SUBJECTS HANDLERS ---
  const handleAddSubjectToGroup = (groupId: string) => {
    const text = newSubjectInputs[groupId]?.trim();
    if (!text) return;

    const updated = academicSubjects.map((grp) => {
      if (grp.id === groupId || grp.category === groupId) {
        return {
          ...grp,
          items: [...grp.items, text],
        };
      }
      return grp;
    });

    updateAcademicSubjects(updated);
    setNewSubjectInputs((prev) => ({ ...prev, [groupId]: '' }));
    showToast(`Mata pelajaran "${text}" berhasil ditambahkan!`);
  };

  const handleRemoveSubjectFromGroup = (groupId: string, subjectIndex: number) => {
    const updated = academicSubjects.map((grp) => {
      if (grp.id === groupId || grp.category === groupId) {
        return {
          ...grp,
          items: grp.items.filter((_, i) => i !== subjectIndex),
        };
      }
      return grp;
    });
    updateAcademicSubjects(updated);
    showToast('Mata pelajaran berhasil dihapus dari kurikulum.');
  };

  const handleAddSubjectGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupCategory.trim()) return;

    const newGroup: AcademicSubjectGroup = {
      id: `grp-${Date.now()}`,
      category: newGroupCategory.trim(),
      items: [],
    };

    updateAcademicSubjects([...academicSubjects, newGroup]);
    setNewGroupCategory('');
    setIsAddGroupOpen(false);
    showToast(`Kelompok mapel "${newGroup.category}" berhasil dibuat!`);
  };

  const handleDeleteSubjectGroup = (groupCategory: string) => {
    if (confirm(`Hapus seluruh kelompok mata pelajaran "${groupCategory}"?`)) {
      const updated = academicSubjects.filter((g) => g.category !== groupCategory);
      updateAcademicSubjects(updated);
      showToast(`Kelompok mapel "${groupCategory}" berhasil dihapus.`);
    }
  };

  const handleResetSubjects = () => {
    if (confirm('Kembalikan struktur mata pelajaran ke kurikulum standar madrasah?')) {
      updateAcademicSubjects(initialAcademicSubjects);
      showToast('Struktur mata pelajaran berhasil direset ke standar awal.');
    }
  };

  // --- HABITS HANDLERS ---
  const handleOpenAddHabit = () => {
    setEditingHabit(null);
    setHabitTime('06.30 - 07.00 WIB');
    setHabitTitle('');
    setHabitDesc('');
    setIsHabitModalOpen(true);
  };

  const handleOpenEditHabit = (h: StudentHabit) => {
    setEditingHabit(h);
    setHabitTime(h.time);
    setHabitTitle(h.title);
    setHabitDesc(h.desc);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitTitle.trim()) return;

    if (editingHabit) {
      const updated = habits.map((h) =>
        (h.id === editingHabit.id || h.title === editingHabit.title)
          ? { ...h, time: habitTime, title: habitTitle, desc: habitDesc }
          : h
      );
      updateHabits(updated);
      showToast(`Pembiasaan "${habitTitle}" berhasil diperbarui!`);
    } else {
      const newH: StudentHabit = {
        id: `hbt-${Date.now()}`,
        time: habitTime,
        title: habitTitle,
        desc: habitDesc,
      };
      updateHabits([...habits, newH]);
      showToast(`Pembiasaan "${habitTitle}" berhasil ditambahkan!`);
    }
    setIsHabitModalOpen(false);
  };

  const handleDeleteHabit = (title: string) => {
    if (confirm(`Hapus rutinitas pembiasaan "${title}"?`)) {
      const updated = habits.filter((h) => h.title !== title);
      updateHabits(updated);
      showToast(`Pembiasaan "${title}" berhasil dihapus.`);
    }
  };

  const handleResetHabits = () => {
    if (confirm('Kembalikan pembiasaan adab & ibadah harian ke standar bawaan?')) {
      updateHabits(initialHabits);
      showToast('Pembiasaan adab & ibadah berhasil direset.');
    }
  };

  // --- EXTRACURRICULAR HANDLERS ---
  const handleOpenAddExcur = () => {
    setEditingExcur(null);
    setExcurName('');
    setExcurCategory('Olahraga');
    setExcurIcon('⚽');
    setExcurDesc('');
    setIsExcurModalOpen(true);
  };

  const handleOpenEditExcur = (ex: Extracurricular) => {
    setEditingExcur(ex);
    setExcurName(ex.name);
    setExcurCategory(ex.category);
    setExcurIcon(ex.icon);
    setExcurDesc(ex.desc);
    setIsExcurModalOpen(true);
  };

  const handleSaveExcur = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excurName.trim()) return;

    if (editingExcur) {
      const updated = extracurriculars.map((ex) =>
        (ex.id === editingExcur.id || ex.name === editingExcur.name)
          ? { ...ex, name: excurName, category: excurCategory, icon: excurIcon, desc: excurDesc }
          : ex
      );
      updateExtracurriculars(updated);
      showToast(`Ekstrakurikuler "${excurName}" berhasil diperbarui!`);
    } else {
      const newEx: Extracurricular = {
        id: `ex-${Date.now()}`,
        name: excurName,
        category: excurCategory,
        icon: excurIcon,
        desc: excurDesc,
      };
      updateExtracurriculars([...extracurriculars, newEx]);
      showToast(`Ekstrakurikuler "${excurName}" berhasil ditambahkan!`);
    }
    setIsExcurModalOpen(false);
  };

  const handleDeleteExcur = (name: string) => {
    if (confirm(`Hapus kegiatan ekstrakurikuler "${name}"?`)) {
      const updated = extracurriculars.filter((ex) => ex.name !== name);
      updateExtracurriculars(updated);
      showToast(`Ekstrakurikuler "${name}" berhasil dihapus.`);
    }
  };

  const handleResetExcur = () => {
    if (confirm('Kembalikan daftar ekstrakurikuler ke standar bawaan?')) {
      updateExtracurriculars(initialExtracurriculars);
      showToast('Daftar ekstrakurikuler berhasil direset.');
    }
  };

  // --- SCHEDULE HANDLERS ---
  const handleOpenAddSchedule = () => {
    setEditingSchedule(null);
    setSchFormData({
      day: (scheduleDayFilter !== 'Semua' ? scheduleDayFilter : 'Senin') as any,
      time: '07.45 - 08.45',
      className: 'Kelas 4A',
      subject: '',
      teacherName: teachers[0]?.name || 'Ustadz Ahmad Fauzi, S.Pd.I',
      room: 'Ruang Kelas 4A',
    });
    setIsScheduleModalOpen(true);
  };

  const handleOpenEditSchedule = (sch: ScheduleItem) => {
    setEditingSchedule(sch);
    setSchFormData({
      day: sch.day,
      time: sch.time,
      className: sch.className,
      subject: sch.subject,
      teacherName: sch.teacherName,
      room: sch.room,
    });
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schFormData.subject.trim()) return;

    if (editingSchedule) {
      updateScheduleItem(editingSchedule.id, schFormData);
      showToast(`Jadwal "${schFormData.subject}" berhasil diperbarui!`);
    } else {
      addScheduleItem(schFormData);
      showToast(`Jadwal baru "${schFormData.subject}" berhasil ditambahkan!`);
    }
    setIsScheduleModalOpen(false);
  };

  const handleDeleteSchedule = (sch: ScheduleItem) => {
    if (confirm(`Hapus jadwal "${sch.subject}" (${sch.day}, ${sch.time})?`)) {
      deleteScheduleItem(sch.id);
      showToast(`Jadwal "${sch.subject}" berhasil dihapus.`);
    }
  };

  const handleResetSchedules = () => {
    if (confirm('Kembalikan jadwal KBM simulasi ke jadwal standar bawaan madrasah?')) {
      resetSchedulesToDefault();
      showToast('Jadwal pembelajaran berhasil direset ke standar awal.');
    }
  };

  // Filtered schedules
  const filteredSchedules = schedules.filter((s) => {
    const matchDay = scheduleDayFilter === 'Semua' || s.day === scheduleDayFilter;
    const matchSearch =
      s.subject.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
      s.teacherName.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
      s.room.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
      s.className.toLowerCase().includes(scheduleSearch.toLowerCase());
    return matchDay && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 size={18} className="text-emerald-200 shrink-0" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
            <BookOpen size={14} className="text-emerald-600" />
            <span>Pusat Kelola Kurikulum & Program MI RPI</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Kelola Akademik, 15 Program Unggulan & Kesiswaan
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Semua perubahan teks, mata pelajaran, target indikator KPI, rutinitas pembiasaan santri, dan ekstrakurikuler akan langsung terbarui secara otomatis di halaman publik website.
          </p>
        </div>

        {/* Subtab Navigation Buttons */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200 self-start md:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'programs'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles size={15} />
            <span>🌟 15 Program Unggulan</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
              {programs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'academic'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <Layers size={15} />
            <span>📖 Struktur Akademik & Kurikulum</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kesiswaan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'kesiswaan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-200/60'
            }`}
          >
            <HeartHandshake size={15} />
            <span>🌱 Kesiswaan & Pembiasaan</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SUBTAB 1: 15 PROGRAM UNGGULAN                                  */}
      {/* ============================================================== */}
      {activeTab === 'programs' && (
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari program unggulan (nama, deskripsi, tujuan)..."
                  value={programSearch}
                  onChange={(e) => setProgramSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                />
              </div>

              {/* Category dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetPrograms}
                className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                title="Reset ke 15 Program Standar"
              >
                <RotateCcw size={14} />
                <span>Reset Standar</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAddProgram}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition cursor-pointer"
              >
                <Plus size={16} />
                <span>Tambah Program Unggulan</span>
              </button>
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPrograms.map((prog, idx) => (
              <div
                key={prog.id || idx}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon, Category & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        {renderIcon(prog.icon)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                          {prog.category}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 mt-1 line-clamp-1">
                          {prog.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProgram(prog)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                        title="Edit Program"
                      >
                        <Edit size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProgram(prog)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Hapus Program"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {prog.description}
                  </p>

                  {/* Objective & KPI */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-[11px]">
                    <div>
                      <strong className="text-slate-800 block text-[10px] uppercase font-bold text-emerald-800">
                        🎯 Target & Tujuan:
                      </strong>
                      <span className="text-slate-600 line-clamp-2">{prog.objective}</span>
                    </div>
                    {prog.kpi && (
                      <div className="pt-1 border-t border-slate-200/60">
                        <strong className="text-slate-800 block text-[10px] uppercase font-bold text-amber-800">
                          📊 Indikator Capaian (KPI):
                        </strong>
                        <span className="text-slate-600 line-clamp-2">{prog.kpi}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="italic">
                    Dok: {prog.documentation || 'Kegiatan berkala'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditProgram(prog)}
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Edit Konten</span>
                    <Edit size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <Sparkles size={36} className="mx-auto text-slate-400" />
              <h4 className="font-bold text-slate-700 text-sm">Tidak ada program yang sesuai</h4>
              <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori filter.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 2: STRUKTUR AKADEMIK & KURIKULUM                        */}
      {/* ============================================================== */}
      {activeTab === 'academic' && (
        <div className="space-y-8">
          {/* SECTION A: 8 DIMENSI PROFIL LULUSAN SANTRI */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                  <CheckCircle size={12} />
                  <span>Standar Kelulusan 6 Tahun</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Dimensi Profil Lulusan Santri MI RPI ({dimensions.length} Dimensi)
                </h3>
                <p className="text-xs text-slate-500">
                  Ditampilkan pada halaman publik "Kurikulum & Akademik" sebagai kompetensi inti santri.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDimensions}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddDimension}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Dimensi</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dimensions.map((dim, idx) => (
                <div
                  key={dim.id || idx}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditDimension(dim)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition cursor-pointer"
                          title="Edit Dimensi"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDimension(idx, dim.title)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-md transition cursor-pointer"
                          title="Hapus Dimensi"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mb-1">{dim.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{dim.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle size={11} />
                    <span>Kompetensi Capaian</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: KELOMPOK MATA PELAJARAN & BEBAN BELAJAR */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-1">
                  <Layers size={12} />
                  <span>Struktur Kurikulum Merdeka Terpadu</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Kelompok Mata Pelajaran & Kurikulum Madrasah
                </h3>
                <p className="text-xs text-slate-500">
                  Kelola daftar mata pelajaran per rumpun (Kemenag, Kemendikbud, Muatan Lokal & Digital).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSubjects}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddGroupOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Kelompok Mapel</span>
                </button>
              </div>
            </div>

            {/* Modal / Prompt Tambah Kelompok Baru */}
            {isAddGroupOpen && (
              <form onSubmit={handleAddSubjectGroup} className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Nama Kelompok Baru (contoh: Peminatan Bahasa & Budaya Asing)..."
                  value={newGroupCategory}
                  onChange={(e) => setNewGroupCategory(e.target.value)}
                  className="flex-1 w-full px-3.5 py-2 bg-white border border-emerald-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  autoFocus
                />
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Simpan Kelompok
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddGroupOpen(false)}
                    className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {academicSubjects.map((grp, gIdx) => {
                const grpId = grp.id || grp.category;
                return (
                  <div
                    key={grpId || gIdx}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-slate-200/80 pb-2">
                        <h4 className="font-extrabold text-xs text-slate-900">
                          {grp.category}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubjectGroup(grp.category)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition cursor-pointer"
                          title="Hapus Kelompok Mapel"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Subject items list with tags */}
                      <ul className="space-y-1.5">
                        {grp.items.map((sub, sIdx) => (
                          <li
                            key={sIdx}
                            className="flex items-center justify-between gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200/70"
                          >
                            <span className="text-slate-800 font-medium">{sub}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSubjectFromGroup(grpId, sIdx)}
                              className="text-slate-400 hover:text-rose-600 p-0.5 rounded cursor-pointer"
                              title="Hapus Mapel"
                            >
                              <X size={13} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Add subject input inside this card */}
                    <div className="pt-3 border-t border-slate-200/80">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="+ Tambah mata pelajaran..."
                          value={newSubjectInputs[grpId] || ''}
                          onChange={(e) =>
                            setNewSubjectInputs((prev) => ({
                              ...prev,
                              [grpId]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSubjectToGroup(grpId);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSubjectToGroup(grpId)}
                          className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition cursor-pointer shrink-0"
                          title="Tambah"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION C: SIMULASI JADWAL PELAJARAN KBM HARIAN */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Simulasi Jadwal Pembelajaran KBM ({schedules.length} Sesi Terjadwal)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jadwal ini ditampilkan pada menu publik <strong>/akademik</strong> sebagai simulasi interaktif belajar santri per hari.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSchedules}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  title="Kembalikan jadwal ke jadwal standar bawaan"
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddSchedule}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Jadwal KBM</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setScheduleDayFilter(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      scheduleDayFilter === day
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari mapel, guru, ruang..."
                  value={scheduleSearch}
                  onChange={(e) => setScheduleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>
            </div>

            {/* Table of Schedules */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Hari</th>
                    <th className="py-3 px-4">Waktu / Jam</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4">Mata Pelajaran</th>
                    <th className="py-3 px-4">Guru Pengampu</th>
                    <th className="py-3 px-4">Ruang</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedules.map((sch) => (
                    <tr key={sch.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[11px]">
                          {sch.day}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {sch.time}
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[11px]">
                          {sch.className}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900">
                        {sch.subject}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {sch.teacherName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {sch.room}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSchedule(sch)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit Jadwal"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSchedule(sch)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus Jadwal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSchedules.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        Tidak ada jadwal pembelajaran pada filter ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SUBTAB 3: KESISWAAN, PEMBIASAAN ADAB & EKSTRAKURIKULER         */}
      {/* ============================================================== */}
      {activeTab === 'kesiswaan' && (
        <div className="space-y-8">
          {/* SECTION A: PEMBIASAAN ADAB & IBADAH HARIAN */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <SunMedium size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Pembiasaan Adab & Ibadah Harian ({habits.length} Rutinitas)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rutinitas pembentukan karakter santri dari pagi hingga siang di madrasah.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetHabits}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddHabit}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Rutinitas</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {habits.map((h, i) => (
                <div
                  key={h.id || i}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-300 transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                        {h.time}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditHabit(h)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition cursor-pointer"
                          title="Edit Pembiasaan"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHabit(h.title)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-md transition cursor-pointer"
                          title="Hapus Pembiasaan"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 pt-1">{h.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{h.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                    <SunMedium size={12} />
                    <span>Rutinitas Harian</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: EKSTRAKURIKULER PILIHAN */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Compass size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Ekstrakurikuler Pilihan Madrasah ({extracurriculars.length} Ekskul)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Wadah pengembangan bakat, minat, seni, kepanduan, dan olahraga santri.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetExcur}
                  className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset Default</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddExcur}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus size={16} />
                  <span>Tambah Ekstrakurikuler</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {extracurriculars.map((ex, i) => (
                <div
                  key={ex.id || i}
                  className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-3xl block">{ex.icon}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditExcur(ex)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded-md transition cursor-pointer"
                          title="Edit Ekskul"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExcur(ex.name)}
                          className="p-1 text-rose-600 hover:bg-rose-100 rounded-md transition cursor-pointer"
                          title="Hapus Ekskul"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                      {ex.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{ex.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ex.desc}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Compass size={11} />
                    <span>Kegiatan Kesiswaan</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: TAMBAH / EDIT PROGRAM UNGGULAN                         */}
      {/* ============================================================== */}
      {isNewProgramModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingProgram ? '✏️ Edit Program Unggulan' : '➕ Tambah Program Unggulan Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Program ini akan tampil di Beranda dan menu "15 Program Unggulan".
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProgramModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Program Unggulan *</label>
                <input
                  type="text"
                  required
                  value={programFormData.name}
                  onChange={(e) => setProgramFormData({ ...programFormData, name: e.target.value })}
                  placeholder="Contoh: Tahsin & Tahfiz Intensif, Robotik Cilik, dll."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Program</label>
                  <input
                    type="text"
                    value={programFormData.category}
                    onChange={(e) => setProgramFormData({ ...programFormData, category: e.target.value })}
                    placeholder="Contoh: Keagamaan Unggulan, Sains & Riset"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilihan Ikon</label>
                  <select
                    value={programFormData.icon}
                    onChange={(e) => setProgramFormData({ ...programFormData, icon: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-slate-700"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Singkat Program *</label>
                <textarea
                  rows={3}
                  required
                  value={programFormData.description}
                  onChange={(e) => setProgramFormData({ ...programFormData, description: e.target.value })}
                  placeholder="Uraikan gambaran umum program, metodologi, dan kegiatan utamanya..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tujuan & Target Pembelajaran</label>
                <textarea
                  rows={2}
                  value={programFormData.objective}
                  onChange={(e) => setProgramFormData({ ...programFormData, objective: e.target.value })}
                  placeholder="Tujuan spesifik yang diharapkan dicapai oleh santri..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Indikator Capaian (KPI)</label>
                  <textarea
                    rows={2}
                    value={programFormData.kpi}
                    onChange={(e) => setProgramFormData({ ...programFormData, kpi: e.target.value })}
                    placeholder="Contoh: 90% lulusan hafal Juz 30 mutqin..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bentuk Portofolio / Dokumentasi</label>
                  <textarea
                    rows={2}
                    value={programFormData.documentation}
                    onChange={(e) => setProgramFormData({ ...programFormData, documentation: e.target.value })}
                    placeholder="Contoh: Sertifikat munaqasyah, jurnal kegiatan harian..."
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewProgramModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingProgram ? 'Simpan Perubahan' : 'Tambahkan Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: TAMBAH / EDIT DIMENSI PROFIL LULUSAN                   */}
      {/* ============================================================== */}
      {isDimensionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingDimension ? '✏️ Edit Dimensi Profil Lulusan' : '➕ Tambah Dimensi Profil Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Ditampilkan pada halaman kurikulum sebagai kompetensi inti santri.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDimensionModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDimension} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Dimensi Profil *</label>
                <input
                  type="text"
                  required
                  value={dimTitle}
                  onChange={(e) => setDimTitle(e.target.value)}
                  placeholder="Contoh: Beriman & Bertaqwa kepada Allah SWT"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Uraian Kompetensi Capaian *</label>
                <textarea
                  rows={3}
                  required
                  value={dimDesc}
                  onChange={(e) => setDimDesc(e.target.value)}
                  placeholder="Contoh: Memiliki akidah salimah, gemar shalat berjamaah, dan mencintai Rasulullah SAW..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDimensionModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Simpan Dimensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: TAMBAH / EDIT PEMBIASAAN ADAB HARIAN                   */}
      {/* ============================================================== */}
      {isHabitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingHabit ? '✏️ Edit Pembiasaan Harian' : '➕ Tambah Rutinitas Pembiasaan Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Ditampilkan pada halaman "Kesiswaan & Pembiasaan Karakter".
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsHabitModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Waktu / Jam Pelaksanaan *</label>
                <input
                  type="text"
                  required
                  value={habitTime}
                  onChange={(e) => setHabitTime(e.target.value)}
                  placeholder="Contoh: 07.00 - 07.30 WIB"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Pembiasaan / Aktivitas *</label>
                <input
                  type="text"
                  required
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  placeholder="Contoh: Shalat Dhuha Berjamaah & Zikir"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Uraian / Manfaat Spiritual *</label>
                <textarea
                  rows={3}
                  required
                  value={habitDesc}
                  onChange={(e) => setHabitDesc(e.target.value)}
                  placeholder="Contoh: Membiasakan shalat sunnah 4 rakaat dilanjutkan doa pembuka pintu rezeki ilmu..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsHabitModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Simpan Rutinitas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: TAMBAH / EDIT EKSTRAKURIKULER                          */}
      {/* ============================================================== */}
      {isExcurModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingExcur ? '✏️ Edit Ekstrakurikuler' : '➕ Tambah Ekstrakurikuler Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Ditampilkan pada halaman "Kesiswaan & Pembiasaan Karakter".
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExcurModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveExcur} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nama Kegiatan Ekskul *</label>
                  <input
                    type="text"
                    required
                    value={excurName}
                    onChange={(e) => setExcurName(e.target.value)}
                    placeholder="Contoh: Robotik & Koding Cilik"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emoji / Ikon</label>
                  <input
                    type="text"
                    value={excurIcon}
                    onChange={(e) => setExcurIcon(e.target.value)}
                    placeholder="🤖, 🏹, ⚽, 🥋"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden text-center text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori Bidang</label>
                <input
                  type="text"
                  value={excurCategory}
                  onChange={(e) => setExcurCategory(e.target.value)}
                  placeholder="Contoh: Teknologi, Olahraga, Bela Diri, Seni Religi, Kepanduan, Sains"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Kegiatan & Manfaat *</label>
                <textarea
                  rows={3}
                  required
                  value={excurDesc}
                  onChange={(e) => setExcurDesc(e.target.value)}
                  placeholder="Contoh: Melatih nalar komputasi anak dengan membuat game Islami dan merakit robot sensor..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsExcurModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Simpan Ekstrakurikuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL 5: TAMBAH / EDIT JADWAL PEMBELAJARAN (KBM)               */}
      {/* ============================================================== */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Clock size={18} className="text-emerald-700" />
                  <span>{editingSchedule ? '✏️ Edit Jadwal KBM' : '➕ Tambah Jadwal Pembelajaran'}</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Jadwal ini disinkronkan dengan simulasi jadwal publik di menu /akademik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hari *</label>
                  <select
                    value={schFormData.day}
                    onChange={(e) => setSchFormData({ ...schFormData, day: e.target.value as any })}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium text-slate-700"
                  >
                    {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Waktu / Jam Sesi *</label>
                  <input
                    type="text"
                    required
                    value={schFormData.time}
                    onChange={(e) => setSchFormData({ ...schFormData, time: e.target.value })}
                    placeholder="Contoh: 07.45 - 08.45"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rombel / Kelas *</label>
                  <input
                    type="text"
                    required
                    value={schFormData.className}
                    onChange={(e) => setSchFormData({ ...schFormData, className: e.target.value })}
                    placeholder="Contoh: Kelas 4A"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ruangan / Tempat *</label>
                  <input
                    type="text"
                    required
                    value={schFormData.room}
                    onChange={(e) => setSchFormData({ ...schFormData, room: e.target.value })}
                    placeholder="Contoh: Ruang Kelas 4A / Lab Komputer"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran / Aktivitas Belajar *</label>
                <input
                  type="text"
                  required
                  value={schFormData.subject}
                  onChange={(e) => setSchFormData({ ...schFormData, subject: e.target.value })}
                  placeholder="Contoh: Matematika Terpadu / Tahsin & Tahfiz Quran"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Guru Pengampu *</label>
                <input
                  type="text"
                  required
                  value={schFormData.teacherName}
                  onChange={(e) => setSchFormData({ ...schFormData, teacherName: e.target.value })}
                  placeholder="Contoh: Ustadz Ahmad Fauzi, S.Pd.I"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-hidden"
                />
                {teachers.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1 text-[10px]">
                    <span className="text-slate-400">Pilih cepat:</span>
                    {teachers.slice(0, 4).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSchFormData({ ...schFormData, teacherName: t.name })}
                        className="px-1.5 py-0.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 rounded text-slate-600 transition cursor-pointer"
                      >
                        {t.name.split(',')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingSchedule ? 'Simpan Perubahan' : 'Tambahkan ke Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
