import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  School,
  ArrowRightLeft,
  ArrowUpRight,
  UserCheck,
  Building,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Teacher, Student, SchoolClass } from '../../types';
import { processImageFile } from '../../utils/imageUpload';
import {
  downloadTeacherExcelTemplate,
  downloadStudentExcelTemplate,
  exportTeachersToExcel,
  exportStudentsToExcel,
  parseTeacherExcel,
  parseStudentExcel,
} from '../../utils/excelHelper';

interface MasterDataManagerProps {
  initialTab?: 'guru' | 'siswa' | 'kelas';
}

export const MasterDataManager: React.FC<MasterDataManagerProps> = ({ initialTab = 'guru' }) => {
  const {
    teachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    deleteTeachers,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    deleteStudents,
    classes,
    addClass,
    updateClass,
    deleteClass,
    batchUpdateStudentClass,
    importTeachersFromExcel,
    importStudentsFromExcel,
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'guru' | 'siswa' | 'kelas'>(initialTab);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');

  // Multi-selection states for batch delete
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
  const [selectedStudentIdsForDelete, setSelectedStudentIdsForDelete] = useState<string[]>([]);

  // In-App Delete Confirmation Modal state (replaces window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'teacher' | 'student' | 'class' | 'batch_teachers' | 'batch_students';
    id?: string;
    ids?: string[];
    name: string;
  } | null>(null);

  // Notification Toast (Success & Error)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showNotice = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  // Hidden File Inputs for Excel Import
  const teacherFileInputRef = useRef<HTMLInputElement>(null);
  const studentFileInputRef = useRef<HTMLInputElement>(null);

  // Excel Preview Modal States
  const [excelPreviewData, setExcelPreviewData] = useState<{
    type: 'guru' | 'siswa';
    fileName: string;
    items: any[];
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // ================= TEACHER MODAL STATES =================
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState('');
  const [teacherNip, setTeacherNip] = useState('');
  const [teacherTitle, setTeacherTitle] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('');
  const [teacherIsHomeroom, setTeacherIsHomeroom] = useState(false);
  const [teacherHomeroomClass, setTeacherHomeroomClass] = useState('Kelas 4A');
  const [teacherEducation, setTeacherEducation] = useState('S1 Pendidikan');
  const [teacherStatus, setTeacherStatus] = useState('Guru Tetap Yayasan');
  const [teacherPhotoUrl, setTeacherPhotoUrl] = useState('');
  const [isUploadingTeacherPhoto, setIsUploadingTeacherPhoto] = useState(false);

  // ================= STUDENT MODAL STATES =================
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentNis, setStudentNis] = useState('');
  const [studentNisn, setStudentNisn] = useState('');
  const [studentGender, setStudentGender] = useState<'L' | 'P'>('L');
  const [studentClassName, setStudentClassName] = useState('Kelas 4A');
  const [studentBirthPlaceDate, setStudentBirthPlaceDate] = useState('Jakarta, 15 Mei 2014');
  const [studentParentName, setStudentParentName] = useState('');
  const [studentParentPhone, setStudentParentPhone] = useState('');
  const [studentAddress, setStudentAddress] = useState('Setiabudi, Jakarta Selatan');
  const [studentPhotoUrl, setStudentPhotoUrl] = useState('');
  const [isUploadingStudentPhoto, setIsUploadingStudentPhoto] = useState(false);

  // ================= CLASS MANAGEMENT STATES =================
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [classGradeInput, setClassGradeInput] = useState<number>(1);
  const [classHomeroomTeacher, setClassHomeroomTeacher] = useState('');
  const [classRoomInput, setClassRoomInput] = useState('');
  const [classAcademicYear, setClassAcademicYear] = useState('2025/2026');
  const [classCapacity, setClassCapacity] = useState<number>(28);

  // Batch Promote / Transfer Modal
  const [isBatchPromoteModalOpen, setIsBatchPromoteModalOpen] = useState(false);
  const [sourceClass, setSourceClass] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // List of unique class names from `classes`
  const dynamicClassNames = classes.map((c) => c.name);

  // -------------------------------------------------------------
  // HANDLERS: TEACHER
  // -------------------------------------------------------------
  const openTeacherModal = (t?: Teacher) => {
    if (t) {
      setEditingTeacherId(t.id);
      setTeacherName(t.name);
      setTeacherNip(t.nip);
      setTeacherTitle(t.title);
      setTeacherSubject(t.subject);
      setTeacherIsHomeroom(t.isHomeroom);
      setTeacherHomeroomClass(t.homeroomClass || (dynamicClassNames[0] || 'Kelas 1A'));
      setTeacherEducation(t.education);
      setTeacherStatus(t.status);
      setTeacherPhotoUrl(t.photoUrl);
    } else {
      setEditingTeacherId(null);
      setTeacherName('');
      setTeacherNip(`199${Math.floor(10000000000 + Math.random() * 90000000000)}`);
      setTeacherTitle('Guru Mata Pelajaran');
      setTeacherSubject('Pendidikan Agama Islam');
      setTeacherIsHomeroom(false);
      setTeacherHomeroomClass(dynamicClassNames[0] || 'Kelas 1A');
      setTeacherEducation('S1 Tarbiyah / Pendidikan');
      setTeacherStatus('Guru Tetap Yayasan');
      setTeacherPhotoUrl('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80');
    }
    setIsTeacherModalOpen(true);
  };

  const handleTeacherPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingTeacherPhoto(true);
    try {
      const dataUrl = await processImageFile(file, 600, 600, 0.85);
      setTeacherPhotoUrl(dataUrl);
      showNotice('Foto guru berhasil diproses dan siap disimpan!');
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah foto.');
    } finally {
      setIsUploadingTeacherPhoto(false);
    }
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName || !teacherNip) {
      alert('Nama dan NIP wajib diisi!');
      return;
    }

    if (editingTeacherId) {
      updateTeacher(editingTeacherId, {
        name: teacherName,
        nip: teacherNip,
        title: teacherTitle,
        subject: teacherSubject,
        isHomeroom: teacherIsHomeroom,
        homeroomClass: teacherIsHomeroom ? teacherHomeroomClass : undefined,
        education: teacherEducation,
        status: teacherStatus,
        photoUrl: teacherPhotoUrl,
      });
      showNotice(`Data guru ${teacherName} berhasil diperbarui!`);
    } else {
      addTeacher({
        name: teacherName,
        nip: teacherNip,
        title: teacherTitle,
        subject: teacherSubject,
        isHomeroom: teacherIsHomeroom,
        homeroomClass: teacherIsHomeroom ? teacherHomeroomClass : undefined,
        education: teacherEducation,
        status: teacherStatus,
        photoUrl: teacherPhotoUrl,
      });
      showNotice(`Guru baru ${teacherName} berhasil ditambahkan!`);
    }
    setIsTeacherModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: STUDENT
  // -------------------------------------------------------------
  const openStudentModal = (s?: Student) => {
    if (s) {
      setEditingStudentId(s.id);
      setStudentName(s.name);
      setStudentNis(s.nis);
      setStudentNisn(s.nisn);
      setStudentGender(s.gender);
      setStudentClassName(s.className);
      setStudentBirthPlaceDate(s.birthPlaceDate);
      setStudentParentName(s.parentName);
      setStudentParentPhone(s.parentPhone);
      setStudentAddress(s.address);
      setStudentPhotoUrl(s.photoUrl);
    } else {
      setEditingStudentId(null);
      setStudentName('');
      setStudentNis(`2026${Math.floor(1000 + Math.random() * 9000)}`);
      setStudentNisn(`009${Math.floor(1000000 + Math.random() * 9000000)}`);
      setStudentGender('L');
      setStudentClassName(dynamicClassNames[0] || 'Kelas 1A');
      setStudentBirthPlaceDate('Jakarta, 12 Januari 2019');
      setStudentParentName('');
      setStudentParentPhone('0812');
      setStudentAddress('Kuningan, Setiabudi, Jakarta Selatan');
      setStudentPhotoUrl('https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80');
    }
    setIsStudentModalOpen(true);
  };

  const handleStudentPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingStudentPhoto(true);
    try {
      const dataUrl = await processImageFile(file, 600, 600, 0.85);
      setStudentPhotoUrl(dataUrl);
      showNotice('Foto santri berhasil diproses dan siap disimpan!');
    } catch (err: any) {
      alert(err.message || 'Gagal mengunggah foto.');
    } finally {
      setIsUploadingStudentPhoto(false);
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentNisn) {
      alert('Nama dan NISN santri wajib diisi!');
      return;
    }

    if (editingStudentId) {
      updateStudent(editingStudentId, {
        name: studentName,
        nis: studentNis,
        nisn: studentNisn,
        gender: studentGender,
        className: studentClassName,
        birthPlaceDate: studentBirthPlaceDate,
        parentName: studentParentName,
        parentPhone: studentParentPhone,
        address: studentAddress,
        photoUrl: studentPhotoUrl,
      });
      showNotice(`Data santri ${studentName} berhasil diperbarui!`);
    } else {
      addStudent({
        name: studentName,
        nis: studentNis,
        nisn: studentNisn,
        gender: studentGender,
        className: studentClassName,
        birthPlaceDate: studentBirthPlaceDate,
        parentName: studentParentName,
        parentPhone: studentParentPhone,
        address: studentAddress,
        photoUrl: studentPhotoUrl,
      });
      showNotice(`Santri baru ${studentName} berhasil ditambahkan!`);
    }
    setIsStudentModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: CLASS MANAGEMENT
  // -------------------------------------------------------------
  const openClassModal = (c?: SchoolClass) => {
    if (c) {
      setEditingClassId(c.id);
      setClassNameInput(c.name);
      setClassGradeInput(c.grade);
      setClassHomeroomTeacher(c.homeroomTeacherName || '');
      setClassRoomInput(c.room || '');
      setClassAcademicYear(c.academicYear || '2025/2026');
      setClassCapacity(c.capacity || 28);
    } else {
      setEditingClassId(null);
      setClassNameInput(`Kelas ${classes.length + 1}A`);
      setClassGradeInput(1);
      setClassHomeroomTeacher(teachers[0]?.name || '');
      setClassRoomInput(`Gedung A, Ruang ${100 + classes.length + 1}`);
      setClassAcademicYear('2025/2026');
      setClassCapacity(28);
    }
    setIsClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput) {
      alert('Nama kelas tidak boleh kosong!');
      return;
    }

    if (editingClassId) {
      updateClass(editingClassId, {
        name: classNameInput,
        grade: classGradeInput,
        homeroomTeacherName: classHomeroomTeacher,
        room: classRoomInput,
        academicYear: classAcademicYear,
        capacity: classCapacity,
      });
      showNotice(`Data rombel ${classNameInput} berhasil diperbarui beserta santri binaannya!`);
    } else {
      addClass({
        name: classNameInput,
        grade: classGradeInput,
        homeroomTeacherName: classHomeroomTeacher,
        room: classRoomInput,
        academicYear: classAcademicYear,
        capacity: classCapacity,
      });
      showNotice(`Rombel baru ${classNameInput} berhasil dibuat!`);
    }
    setIsClassModalOpen(false);
  };

  // Open Batch Promote Modal
  const openBatchPromoteModal = (fromClassName?: string) => {
    const src = fromClassName || dynamicClassNames[0] || '';
    setSourceClass(src);
    // Find next grade class as default target
    const currentCls = classes.find((c) => c.name === src);
    if (currentCls && currentCls.grade < 6) {
      const nextGradeClass = classes.find((c) => c.grade === currentCls.grade + 1);
      setTargetClass(nextGradeClass?.name || dynamicClassNames[1] || src);
    } else {
      setTargetClass(dynamicClassNames.find((n) => n !== src) || src);
    }
    // Pre-select all students of source class
    const initialStudentsInClass = students.filter((s) => s.className === src).map((s) => s.id);
    setSelectedStudentIds(initialStudentsInClass);
    setIsBatchPromoteModalOpen(true);
  };

  const handleExecuteBatchPromote = () => {
    if (!sourceClass || !targetClass || sourceClass === targetClass) {
      alert('Pilih kelas asal dan kelas tujuan yang berbeda!');
      return;
    }
    if (selectedStudentIds.length === 0) {
      alert('Pilih minimal satu siswa untuk dipindahkan!');
      return;
    }

    batchUpdateStudentClass(selectedStudentIds, targetClass);
    showNotice(`Berhasil memindahkan ${selectedStudentIds.length} santri dari ${sourceClass} ke ${targetClass}!`);
    setIsBatchPromoteModalOpen(false);
  };

  // -------------------------------------------------------------
  // HANDLERS: EXCEL FILE SELECTION & PREVIEW
  // -------------------------------------------------------------
  const handleTeacherFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseTeacherExcel(file);
      setExcelPreviewData({
        type: 'guru',
        fileName: file.name,
        items: parsed,
      });
    } catch (err: any) {
      alert(err.message || 'Gagal membaca file Excel. Pastikan format kolom sesuai template.');
    } finally {
      if (teacherFileInputRef.current) teacherFileInputRef.current.value = '';
    }
  };

  const handleStudentFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseStudentExcel(file);
      setExcelPreviewData({
        type: 'siswa',
        fileName: file.name,
        items: parsed,
      });
    } catch (err: any) {
      alert(err.message || 'Gagal membaca file Excel. Pastikan format kolom sesuai template.');
    } finally {
      if (studentFileInputRef.current) studentFileInputRef.current.value = '';
    }
  };

  const handleExecuteImport = () => {
    if (!excelPreviewData) return;
    setIsImporting(true);

    try {
      if (excelPreviewData.type === 'guru') {
        const count = importTeachersFromExcel(excelPreviewData.items);
        showNotice(`Alhamdulillah! Berhasil mengimpor ${count} guru baru dari file Excel.`);
      } else {
        const count = importStudentsFromExcel(excelPreviewData.items);
        showNotice(`Alhamdulillah! Berhasil mengimpor ${count} data santri baru dari file Excel.`);
      }
      setExcelPreviewData(null);
    } catch (err: any) {
      alert('Terjadi kesalahan saat memproses impor data.');
    } finally {
      setIsImporting(false);
    }
  };

  // -------------------------------------------------------------
  // FILTERED DATA
  // -------------------------------------------------------------
  const filteredTeachers = teachers.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(query) ||
      t.nip.includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      (t.homeroomClass && t.homeroomClass.toLowerCase().includes(query)) ||
      t.title.toLowerCase().includes(query)
    );
  });

  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(query) ||
      s.nis.includes(query) ||
      s.nisn.includes(query) ||
      s.parentName.toLowerCase().includes(query) ||
      s.className.toLowerCase().includes(query);

    const matchClass = classFilter === 'ALL' || s.className === classFilter;
    return matchSearch && matchClass;
  });

  // -------------------------------------------------------------
  // SELECTION & DELETE HANDLERS (IN-APP MODAL, NO WINDOW.CONFIRM)
  // -------------------------------------------------------------
  const isAllTeachersSelected =
    filteredTeachers.length > 0 &&
    filteredTeachers.every((t) => selectedTeacherIds.includes(t.id));

  const toggleSelectAllTeachers = () => {
    if (isAllTeachersSelected) {
      setSelectedTeacherIds([]);
    } else {
      setSelectedTeacherIds(filteredTeachers.map((t) => t.id));
    }
  };

  const toggleSelectTeacher = (id: string) => {
    setSelectedTeacherIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const isAllStudentsSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedStudentIdsForDelete.includes(s.id));

  const toggleSelectAllStudents = () => {
    if (isAllStudentsSelected) {
      setSelectedStudentIdsForDelete([]);
    } else {
      setSelectedStudentIdsForDelete(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIdsForDelete((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const confirmDeleteTeacher = (t: Teacher) => {
    setDeleteTarget({
      type: 'teacher',
      id: t.id,
      name: `${t.name} (NIP: ${t.nip})`,
    });
  };

  const confirmDeleteStudent = (s: Student) => {
    setDeleteTarget({
      type: 'student',
      id: s.id,
      name: `${s.name} (${s.className} - NISN: ${s.nisn})`,
    });
  };

  const confirmDeleteClass = (cls: SchoolClass, count: number) => {
    if (count > 0) {
      showNotice(
        `Tidak dapat menghapus ${cls.name} karena masih ada ${count} santri yang terdaftar. Pindahkan santri terlebih dahulu.`,
        'error'
      );
      return;
    }
    setDeleteTarget({
      type: 'class',
      id: cls.id,
      name: `${cls.name} (${cls.room || 'Ruang Kelas'})`,
    });
  };

  const confirmBatchDeleteTeachers = () => {
    if (selectedTeacherIds.length === 0) return;
    setDeleteTarget({
      type: 'batch_teachers',
      ids: [...selectedTeacherIds],
      name: `${selectedTeacherIds.length} data guru terpilih`,
    });
  };

  const confirmBatchDeleteStudents = () => {
    if (selectedStudentIdsForDelete.length === 0) return;
    setDeleteTarget({
      type: 'batch_students',
      ids: [...selectedStudentIdsForDelete],
      name: `${selectedStudentIdsForDelete.length} data santri terpilih`,
    });
  };

  const executeDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'teacher' && deleteTarget.id) {
      deleteTeacher(deleteTarget.id);
      setSelectedTeacherIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      showNotice(`Guru ${deleteTarget.name} berhasil dihapus.`);
    } else if (deleteTarget.type === 'batch_teachers' && deleteTarget.ids) {
      deleteTeachers(deleteTarget.ids);
      setSelectedTeacherIds([]);
      showNotice(`Berhasil menghapus ${deleteTarget.ids.length} data guru.`);
    } else if (deleteTarget.type === 'student' && deleteTarget.id) {
      deleteStudent(deleteTarget.id);
      setSelectedStudentIdsForDelete((prev) => prev.filter((id) => id !== deleteTarget.id));
      showNotice(`Data santri ${deleteTarget.name} berhasil dihapus.`);
    } else if (deleteTarget.type === 'batch_students' && deleteTarget.ids) {
      deleteStudents(deleteTarget.ids);
      setSelectedStudentIdsForDelete([]);
      showNotice(`Berhasil menghapus ${deleteTarget.ids.length} data santri.`);
    } else if (deleteTarget.type === 'class' && deleteTarget.id) {
      deleteClass(deleteTarget.id);
      showNotice(`Rombel ${deleteTarget.name} berhasil dihapus.`);
    }

    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={teacherFileInputRef}
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleTeacherFileSelected}
      />
      <input
        type="file"
        ref={studentFileInputRef}
        accept=".xlsx, .xls, .csv"
        className="hidden"
        onChange={handleStudentFileSelected}
      />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center justify-between shadow-md transition-all animate-in fade-in ${
            notification.type === 'error'
              ? 'bg-rose-50 border border-rose-300 text-rose-900'
              : 'bg-emerald-50 border border-emerald-300 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'error' ? (
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            )}
            <span className="font-semibold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="font-bold hover:opacity-80 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Header & Sub-Tab Switcher */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>Pusat Data Master (Guru, Santri & Data Kelas)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Admin dapat mengedit biodata, mengimpor dari file Excel, mengubah data rombongan belajar (kelas), serta kenaikan kelas santri.
            </p>
          </div>

          {/* SubTab Toggle */}
          <div className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1 shrink-0">
            <button
              onClick={() => {
                setActiveSubTab('guru');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'guru'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap size={15} />
              <span>👨‍🏫 Dewan Guru ({teachers.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('siswa');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'siswa'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users size={15} />
              <span>👦 Santri / Siswa ({students.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('kelas');
                setSearchQuery('');
              }}
              className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'kelas'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School size={15} />
              <span>🏫 Kelola Kelas / Rombel ({classes.length})</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUBTAB 1: DEWAN GURU */}
        {/* ============================================================== */}
        {activeSubTab === 'guru' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="relative w-full lg:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari guru, NIP, mapel, kelas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons: Add, Excel Import/Export, Bulk Delete */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Select All Checkbox Button */}
                <button
                  onClick={toggleSelectAllTeachers}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isAllTeachersSelected
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Pilih atau batal pilih semua guru"
                >
                  <input
                    type="checkbox"
                    checked={isAllTeachersSelected}
                    onChange={toggleSelectAllTeachers}
                    className="w-3.5 h-3.5 rounded text-emerald-600 cursor-pointer pointer-events-none"
                  />
                  <span>{isAllTeachersSelected ? 'Batalkan Semua' : 'Pilih Semua'}</span>
                </button>

                {/* Bulk Delete Button when teachers are selected */}
                {selectedTeacherIds.length > 0 && (
                  <button
                    onClick={confirmBatchDeleteTeachers}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer animate-in fade-in"
                    title="Hapus guru terpilih secara massal"
                  >
                    <Trash2 size={14} />
                    <span>Hapus {selectedTeacherIds.length} Guru Terpilih</span>
                  </button>
                )}

                {/* Download Template */}
                <button
                  onClick={downloadTeacherExcelTemplate}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Unduh Format Excel Kosong untuk diisi"
                >
                  <Download size={14} className="text-slate-500" />
                  <span>Template Excel</span>
                </button>

                {/* Import Excel */}
                <button
                  onClick={() => teacherFileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Impor data guru dari file Excel / Spreadsheet"
                >
                  <FileSpreadsheet size={15} className="text-emerald-700" />
                  <span>Import Excel</span>
                </button>

                {/* Export Excel */}
                <button
                  onClick={() => exportTeachersToExcel(teachers)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Ekspor daftar guru saat ini ke file Excel"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>

                {/* Add Manual */}
                <button
                  onClick={() => openTeacherModal()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>+ Tambah Guru</span>
                </button>
              </div>
            </div>

            {/* Teacher Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeachers.map((t) => {
                const isSelected = selectedTeacherIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className={`border rounded-2xl p-4 transition flex flex-col justify-between space-y-3 relative ${
                      isSelected
                        ? 'bg-emerald-50/50 border-emerald-300 shadow-md ring-1 ring-emerald-400'
                        : 'bg-slate-50/70 border-slate-200/90 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox for batch selection */}
                      <div className="pt-0.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectTeacher(t.id)}
                          className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          title="Pilih guru ini untuk dihapus / kelola"
                        />
                      </div>

                      <img
                        src={t.photoUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&auto=format&fit=crop&q=80'}
                        alt={t.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                      />
                      <div className="space-y-0.5 overflow-hidden">
                        <h4 className="font-bold text-slate-900 text-xs truncate" title={t.name}>
                          {t.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-emerald-800 truncate">
                          {t.title}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          NIP: {t.nip}
                        </p>
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mata Pelajaran:</span>
                        <span className="font-semibold text-slate-800">{t.subject}</span>
                      </div>
                      {t.isHomeroom && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Wali Kelas:</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            {t.homeroomClass}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pendidikan:</span>
                        <span className="text-slate-700 truncate max-w-[140px]">{t.education}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400">ID: {t.id}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openTeacherModal(t)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          title="Edit Biodata Guru"
                        >
                          <Edit size={12} />
                          <span>Edit Data</span>
                        </button>

                        <button
                          onClick={() => confirmDeleteTeacher(t)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-lg transition cursor-pointer"
                          title="Hapus Guru"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUBTAB 2: DATA SANTRI / SISWA */}
        {/* ============================================================== */}
        {activeSubTab === 'siswa' && (
          <div className="space-y-4">
            {/* Filters & Action Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari santri, NIS, NISN, ortu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Filter Kelas */}
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs py-2 px-3 rounded-xl outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="ALL">Semua Kelas ({students.length})</option>
                  {dynamicClassNames.map((c) => (
                    <option key={c} value={c}>
                      {c} ({students.filter((s) => s.className === c).length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons: Add, Excel Import/Export, Mass Promote, Bulk Delete */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Bulk Delete Button when students are selected */}
                {selectedStudentIdsForDelete.length > 0 && (
                  <button
                    onClick={confirmBatchDeleteStudents}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer animate-in fade-in"
                    title="Hapus santri terpilih secara massal"
                  >
                    <Trash2 size={14} />
                    <span>Hapus {selectedStudentIdsForDelete.length} Santri Terpilih</span>
                  </button>
                )}

                {/* Download Template */}
                <button
                  onClick={downloadStudentExcelTemplate}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Unduh Format Excel Santri untuk diisi"
                >
                  <Download size={14} className="text-slate-500" />
                  <span>Template Excel</span>
                </button>

                {/* Import Excel */}
                <button
                  onClick={() => studentFileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Impor data santri dari file Excel"
                >
                  <FileSpreadsheet size={15} className="text-teal-700" />
                  <span>Import Excel</span>
                </button>

                {/* Export Excel */}
                <button
                  onClick={() => exportStudentsToExcel(students)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Ekspor daftar santri ke Excel"
                >
                  <Download size={14} />
                  <span>Export</span>
                </button>

                {/* Kenaikan / Pindah Kelas Massal */}
                <button
                  onClick={() => openBatchPromoteModal(classFilter !== 'ALL' ? classFilter : undefined)}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Pindah rombel / Kenaikan kelas massal"
                >
                  <ArrowRightLeft size={14} className="text-amber-700" />
                  <span>Pindah / Naik Kelas</span>
                </button>

                {/* Add Manual */}
                <button
                  onClick={() => openStudentModal()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>+ Tambah Santri</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={isAllStudentsSelected}
                        onChange={toggleSelectAllStudents}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        title={isAllStudentsSelected ? 'Batalkan pilihan semua santri' : 'Pilih semua santri yang tampil'}
                      />
                    </th>
                    <th className="py-3 px-4">Foto & Nama Santri</th>
                    <th className="py-3 px-4">NIS / NISN</th>
                    <th className="py-3 px-4">Kelas</th>
                    <th className="py-3 px-4">L/P</th>
                    <th className="py-3 px-4">Tempat, Tgl Lahir</th>
                    <th className="py-3 px-4">Orang Tua / Wali</th>
                    <th className="py-3 px-4">No. HP / WA</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Tidak ditemukan data santri yang cocok dengan pencarian / filter kelas.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = selectedStudentIdsForDelete.includes(s.id);
                      return (
                        <tr
                          key={s.id}
                          className={`transition ${
                            isSelected ? 'bg-emerald-50/60 font-medium' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          {/* Selection Checkbox */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectStudent(s.id)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                              title="Pilih santri ini untuk dihapus"
                            />
                          </td>

                          {/* Foto & Nama */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={s.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80'}
                                alt={s.name}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <p className="font-bold text-slate-900">{s.name}</p>
                                <span className="text-[10px] text-slate-400 truncate block max-w-[150px]">
                                  {s.address}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* NIS / NISN */}
                          <td className="py-3 px-4">
                            <span className="font-mono text-slate-800 font-semibold block">{s.nisn}</span>
                            <span className="text-[10px] text-slate-400 font-mono">NIS: {s.nis}</span>
                          </td>

                          {/* Kelas */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-[11px]">
                              {s.className}
                            </span>
                          </td>

                          {/* L/P */}
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                s.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                              }`}
                            >
                              {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                          </td>

                          {/* Tempat, Tgl Lahir */}
                          <td className="py-3 px-4 text-slate-600">
                            {s.birthPlaceDate}
                          </td>

                          {/* Ortu */}
                          <td className="py-3 px-4 font-semibold text-slate-800">
                            {s.parentName}
                          </td>

                          {/* WA */}
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                            {s.parentPhone}
                          </td>

                          {/* Aksi */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => openStudentModal(s)}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                                title="Edit Data Santri"
                              >
                                <Edit size={12} />
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => confirmDeleteStudent(s)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-lg transition cursor-pointer"
                                title="Hapus Data Santri"
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
        )}

        {/* ============================================================== */}
        {/* SUBTAB 3: KELOLA DATA KELAS & ROMBEL */}
        {/* ============================================================== */}
        {activeSubTab === 'kelas' && (
          <div className="space-y-6">
            {/* Class Management Explanation Banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-2">
                  <School size={16} className="text-emerald-700 shrink-0" />
                  <span>Pengaturan Rombongan Belajar (Rombel) & Ruang Kelas</span>
                </h4>
                <p className="text-[11px] text-emerald-800">
                  Mengubah nama kelas akan secara otomatis memperbarui seluruh data santri & wali kelas yang terdaftar pada kelas tersebut.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openBatchPromoteModal()}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRightLeft size={14} />
                  <span>Kenaikan / Pindah Kelas</span>
                </button>

                <button
                  onClick={() => openClassModal()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>+ Tambah Rombel Baru</span>
                </button>
              </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((cls) => {
                const studentCount = students.filter((s) => s.className === cls.name).length;
                const capacity = cls.capacity || 28;
                const isFull = studentCount >= capacity;

                return (
                  <div
                    key={cls.id}
                    className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-5 hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Class Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                            {cls.grade}
                          </span>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{cls.name}</h4>
                            <span className="text-[10px] text-slate-400">Tingkat Kelas {cls.grade}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isFull ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {studentCount} / {capacity} Santri
                        </span>
                      </div>

                      {/* Class Details */}
                      <div className="mt-4 bg-white p-3 rounded-xl border border-slate-200/70 text-xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <UserCheck size={12} />
                            <span>Wali Kelas:</span>
                          </span>
                          <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">
                            {cls.homeroomTeacherName || 'Belum Ditentukan'}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Building size={12} />
                            <span>Ruang Kelas:</span>
                          </span>
                          <span className="text-slate-700 font-medium text-right truncate max-w-[160px]">
                            {cls.room || 'Ruang Belajar'}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-400 text-[11px] flex items-center gap-1">
                            <Layers size={12} />
                            <span>Tahun Ajaran:</span>
                          </span>
                          <span className="text-slate-700 font-mono text-[11px]">
                            {cls.academicYear || '2025/2026'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Class Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          setClassFilter(cls.name);
                          setActiveSubTab('siswa');
                        }}
                        className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Lihat {studentCount} Santri</span>
                        <ArrowUpRight size={13} />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openBatchPromoteModal(cls.name)}
                          className="p-2 bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white rounded-lg transition cursor-pointer"
                          title="Pindahkan / Naikkan Santri di Kelas Ini"
                        >
                          <ArrowRightLeft size={13} />
                        </button>

                        <button
                          onClick={() => openClassModal(cls)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                          title="Ubah Data Kelas"
                        >
                          <Edit size={12} />
                          <span>Ubah</span>
                        </button>

                        <button
                          onClick={() => confirmDeleteClass(cls, studentCount)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white rounded-lg transition cursor-pointer"
                          title="Hapus Rombel"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: PREVIEW IMPORT EXCEL */}
      {/* ============================================================== */}
      {excelPreviewData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Konfirmasi Impor Spreadsheet
              </span>
              <h3 className="text-lg font-bold mt-1">
                Pratinjau Data Impor: {excelPreviewData.fileName}
              </h3>
              <p className="text-xs text-emerald-100">
                Ditemukan <strong>{excelPreviewData.items.length}</strong> baris data valid yang siap dimasukkan ke database madrasah.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Sistem akan otomatis mengabaikan data jika NIP / NISN sudah terdaftar sebelumnya untuk mencegah duplikasi data.
                </span>
              </div>

              {/* Table Preview (Max 5 rows) */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2.5">No</th>
                      <th className="p-2.5">Nama</th>
                      <th className="p-2.5">{excelPreviewData.type === 'guru' ? 'NIP' : 'NISN'}</th>
                      <th className="p-2.5">{excelPreviewData.type === 'guru' ? 'Mapel' : 'Kelas'}</th>
                      <th className="p-2.5">{excelPreviewData.type === 'guru' ? 'Pendidikan' : 'Nama Ortu'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {excelPreviewData.items.slice(0, 8).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 text-slate-400">{idx + 1}</td>
                        <td className="p-2.5 font-bold text-slate-900">{row.name}</td>
                        <td className="p-2.5 font-mono text-slate-600">{row.nip || row.nisn}</td>
                        <td className="p-2.5">{row.subject || row.className}</td>
                        <td className="p-2.5 text-slate-600">{row.education || row.parentName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {excelPreviewData.items.length > 8 && (
                <p className="text-[11px] text-slate-400 italic text-center">
                  ... dan {excelPreviewData.items.length - 8} data lainnya.
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExcelPreviewData(null)}
                  disabled={isImporting}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={isImporting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>{isImporting ? 'Sedang Memproses...' : `Impor ${excelPreviewData.items.length} Data Sekarang`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT / TAMBAH DATA KELAS (ROMBEL) */}
      {/* ============================================================== */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {editingClassId ? 'Edit Rombel' : 'Tambah Rombel Baru'}
              </span>
              <h3 className="text-lg font-bold mt-1">
                {editingClassId ? `Ubah Data: ${classNameInput}` : 'Formulir Rombel & Ruang Kelas'}
              </h3>
              <p className="text-xs text-emerald-100">
                Data kelas akan langsung terhubung ke jadwal pelajaran, absensi, dan e-Rapor.
              </p>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nama Rombel / Kelas *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kelas 1A atau Kelas 1-Abu Bakar"
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tingkat (1-6) *</label>
                  <select
                    value={classGradeInput}
                    onChange={(e) => setClassGradeInput(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={g} value={g}>Kelas {g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Homeroom Teacher */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Wali Kelas Pengampu</label>
                <select
                  value={classHomeroomTeacher}
                  onChange={(e) => setClassHomeroomTeacher(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-semibold text-slate-800"
                >
                  <option value="">-- Pilih Guru Sebagai Wali Kelas --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lokasi Ruang / Gedung</label>
                  <input
                    type="text"
                    placeholder="Contoh: Gedung A, Lt. 1 - R.101"
                    value={classRoomInput}
                    onChange={(e) => setClassRoomInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Daya Tampung (Kapasitas)</label>
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={classCapacity}
                    onChange={(e) => setClassCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Academic Year */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  placeholder="2025/2026"
                  value={classAcademicYear}
                  onChange={(e) => setClassAcademicYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Data Kelas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: PINDAH / KENAIKAN KELAS MASSAL */}
      {/* ============================================================== */}
      {isBatchPromoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-6">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Kenaikan / Perpindahan Rombel Massal
              </span>
              <h3 className="text-lg font-bold mt-1">
                Pindahkan Santri ke Kelas Baru
              </h3>
              <p className="text-xs text-amber-100">
                Fitur ini memudahkan Admin saat kenaikan kelas tahun ajaran baru atau pembagian rombel santri.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {/* Class Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div>
                  <label className="font-bold text-amber-950 block mb-1">Dari Kelas (Asal):</label>
                  <select
                    value={sourceClass}
                    onChange={(e) => {
                      const newSrc = e.target.value;
                      setSourceClass(newSrc);
                      const matchingStudents = students.filter((s) => s.className === newSrc).map((s) => s.id);
                      setSelectedStudentIds(matchingStudents);
                    }}
                    className="w-full bg-white border border-amber-300 p-2 rounded-xl outline-none font-bold text-slate-800"
                  >
                    {dynamicClassNames.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-amber-950 block mb-1">Pindah ke Kelas (Tujuan):</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full bg-white border border-amber-300 p-2 rounded-xl outline-none font-bold text-emerald-800"
                  >
                    {dynamicClassNames.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-800">
                    Pilih Santri yang Dipindahkan ({selectedStudentIds.length} santri terpilih):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const srcStudents = students.filter((s) => s.className === sourceClass).map((s) => s.id);
                      if (selectedStudentIds.length === srcStudents.length) {
                        setSelectedStudentIds([]);
                      } else {
                        setSelectedStudentIds(srcStudents);
                      }
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    {selectedStudentIds.length === students.filter((s) => s.className === sourceClass).length
                      ? 'Batalkan Semua'
                      : 'Pilih Semua'}
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100 p-2 bg-slate-50">
                  {students.filter((s) => s.className === sourceClass).length === 0 ? (
                    <p className="text-center py-4 text-slate-400">Tidak ada santri di {sourceClass}</p>
                  ) : (
                    students
                      .filter((s) => s.className === sourceClass)
                      .map((s) => {
                        const isChecked = selectedStudentIds.includes(s.id);
                        return (
                          <label
                            key={s.id}
                            className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStudentIds((prev) => [...prev, s.id]);
                                } else {
                                  setSelectedStudentIds((prev) => prev.filter((id) => id !== s.id));
                                }
                              }}
                              className="w-4 h-4 text-amber-600 rounded"
                            />
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <p className="font-bold text-slate-900">{s.name}</p>
                                <span className="text-[10px] text-slate-400 font-mono">NISN: {s.nisn}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-semibold">{s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                            </div>
                          </label>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchPromoteModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteBatchPromote}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRightLeft size={16} />
                  <span>Pindahkan {selectedStudentIds.length} Santri ke {targetClass}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: EDIT / TAMBAH DATA GURU */}
      {/* ============================================================== */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {editingTeacherId ? 'Edit Biodata GTK' : 'Tambah Guru Baru'}
              </span>
              <h3 className="text-lg font-bold mt-1">
                {editingTeacherId ? `Perbarui Data: ${teacherName}` : 'Formulir Guru & Tenaga Kependidikan'}
              </h3>
              <p className="text-xs text-emerald-100">
                Data akan langsung terbarui pada halaman profil guru di website dan rapor digital.
              </p>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={teacherPhotoUrl || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&auto=format&fit=crop&q=80'}
                  alt="Foto Guru"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-600 shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <label className="font-bold text-slate-800 block">Foto Profil Guru</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer transition text-xs">
                    <Camera size={14} />
                    <span>{isUploadingTeacherPhoto ? 'Memproses...' : 'Unggah / Ganti Foto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleTeacherPhotoUpload}
                      disabled={isUploadingTeacherPhoto}
                    />
                  </label>
                  <p className="text-[10px] text-slate-500">Mendukung format JPG, PNG, WebP (Maks 10MB).</p>
                </div>
              </div>

              {/* Name & NIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ustadz Ahmad Fauzi, S.Pd.I"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIP / NUPTK *</label>
                  <input
                    type="text"
                    required
                    placeholder="19880415..."
                    value={teacherNip}
                    onChange={(e) => setTeacherNip(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Title & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jabatan / Tugas</label>
                  <input
                    type="text"
                    placeholder="Contoh: Wali Kelas 4A & Guru Fikih"
                    value={teacherTitle}
                    onChange={(e) => setTeacherTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran Utama</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pendidikan Agama Islam"
                    value={teacherSubject}
                    onChange={(e) => setTeacherSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Homeroom Checkbox & Class */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                <label className="flex items-center gap-2 font-bold text-emerald-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={teacherIsHomeroom}
                    onChange={(e) => setTeacherIsHomeroom(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Bertugas Sebagai Wali Kelas</span>
                </label>

                {teacherIsHomeroom && (
                  <div className="pt-2">
                    <label className="font-bold text-emerald-900 block mb-1">Pilih Kelas Binaan:</label>
                    <select
                      value={teacherHomeroomClass}
                      onChange={(e) => setTeacherHomeroomClass(e.target.value)}
                      className="w-full bg-white border border-emerald-300 p-2 rounded-xl outline-none font-bold"
                    >
                      {dynamicClassNames.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Education & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    placeholder="Contoh: S1 Tarbiyah UIN Jakarta"
                    value={teacherEducation}
                    onChange={(e) => setTeacherEducation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Kepegawaian</label>
                  <select
                    value={teacherStatus}
                    onChange={(e) => setTeacherStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                  >
                    <option value="Guru Tetap Yayasan">Guru Tetap Yayasan (GTY)</option>
                    <option value="Guru Tidak Tetap">Guru Tidak Tetap (GTT) / Honorer</option>
                    <option value="PNS DPK Kemenag">PNS DPK Kementerian Agama</option>
                    <option value="Tenaga Kependidikan">Tenaga Kependidikan / Tata Usaha</option>
                  </select>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Data Guru</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: EDIT / TAMBAH DATA SANTRI */}
      {/* ============================================================== */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white p-6">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                {editingStudentId ? 'Edit Biodata Santri' : 'Tambah Santri Baru'}
              </span>
              <h3 className="text-lg font-bold mt-1">
                {editingStudentId ? `Perbarui Data: ${studentName}` : 'Formulir Pendaftaran Siswa Baru'}
              </h3>
              <p className="text-xs text-teal-100">
                Data santri ini terhubung dengan rapor digital, presensi kelas, dan portal orang tua.
              </p>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <img
                  src={studentPhotoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80'}
                  alt="Foto Santri"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-600 shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <label className="font-bold text-slate-800 block">Foto Santri</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl cursor-pointer transition text-xs">
                    <Camera size={14} />
                    <span>{isUploadingStudentPhoto ? 'Memproses...' : 'Unggah / Ganti Foto'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleStudentPhotoUpload}
                      disabled={isUploadingStudentPhoto}
                    />
                  </label>
                  <p className="text-[10px] text-slate-500">Mendukung format JPG, PNG, WebP (Maks 10MB).</p>
                </div>
              </div>

              {/* Name & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Santri *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Al Fatih"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-teal-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
                  <select
                    value={studentGender}
                    onChange={(e) => setStudentGender(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-bold"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              {/* NIS, NISN, & Kelas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NIS *</label>
                  <input
                    type="text"
                    required
                    placeholder="20260012"
                    value={studentNis}
                    onChange={(e) => setStudentNis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    placeholder="0092837190"
                    value={studentNisn}
                    onChange={(e) => setStudentNisn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas *</label>
                  <select
                    value={studentClassName}
                    onChange={(e) => setStudentClassName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none font-bold text-emerald-800"
                  >
                    {dynamicClassNames.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Birth Place Date */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tempat, Tanggal Lahir</label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta, 15 Mei 2014"
                  value={studentBirthPlaceDate}
                  onChange={(e) => setStudentBirthPlaceDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                />
              </div>

              {/* Parent Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-teal-50/60 p-3 rounded-2xl border border-teal-100">
                <div>
                  <label className="font-bold text-teal-900 block mb-1">Nama Orang Tua / Wali *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ibu Fatimah Zahra, S.E."
                    value={studentParentName}
                    onChange={(e) => setStudentParentName(e.target.value)}
                    className="w-full bg-white border border-teal-200 p-2 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-teal-900 block mb-1">No. WhatsApp Orang Tua</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567891"
                    value={studentParentPhone}
                    onChange={(e) => setStudentParentPhone(e.target.value)}
                    className="w-full bg-white border border-teal-200 p-2 rounded-xl outline-none font-mono"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan..."
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  <span>Simpan Data Santri</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: KONFIRMASI HAPUS DATA (IN-APP MODAL, TIDAK PAKAI WINDOW.CONFIRM) */}
      {/* ============================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-slate-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-red-700 text-white p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Trash2 size={24} className="text-white" />
              </div>
              <div>
                <span className="bg-white/25 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Konfirmasi Hapus
                </span>
                <h3 className="text-base font-bold mt-1">
                  {deleteTarget.type === 'teacher' && 'Hapus Data Guru'}
                  {deleteTarget.type === 'batch_teachers' && 'Hapus Guru Terpilih'}
                  {deleteTarget.type === 'student' && 'Hapus Data Santri'}
                  {deleteTarget.type === 'batch_students' && 'Hapus Santri Terpilih'}
                  {deleteTarget.type === 'class' && 'Hapus Rombel Kelas'}
                </h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  Tindakan ini akan menghapus data dari sistem madrasah.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-950">
                <p className="text-slate-600 font-medium mb-1">
                  Apakah Anda yakin ingin menghapus data berikut?
                </p>
                <p className="font-bold text-sm text-rose-800 break-words">
                  {deleteTarget.name}
                </p>
                <p className="text-[11px] text-rose-700/80 mt-2.5">
                  Setelah dihapus, data tidak dapat dipulihkan kembali kecuali diimpor ulang.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={executeDelete}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={15} />
                  <span>Ya, Hapus Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
