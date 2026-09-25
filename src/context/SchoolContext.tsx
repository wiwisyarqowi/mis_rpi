import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolSettings,
  User,
  UserRole,
  Student,
  Teacher,
  ScheduleItem,
  AttendanceRecord,
  GradeItem,
  Assignment,
  LearningMaterial,
  Exam,
  SPMBApplication,
  PaymentRecord,
  ComplaintTicket,
  CharacterPointRecord,
  WorshipLog,
  LibraryBook,
  NewsItem,
  AchievementItem,
  GalleryItem,
  EventItem,
  NotificationAlert,
  UserAccount,
  SchoolClass,
} from '../types';
import {
  initialSchoolSettings,
  initialStudents,
  initialTeachers,
  initialClasses,
  initialSchedules,
  initialAttendanceRecords,
  initialGrades,
  initialAssignments,
  initialMaterials,
  initialExams,
  initialSPMBApplications,
  initialPayments,
  initialComplaints,
  initialCharacterRecords,
  initialWorshipLogs,
  initialBooks,
  initialNews,
  initialAchievements,
  initialGallery,
  initialEvents,
  initialNotifications,
  initialUserAccounts,
} from '../data/initialData';

interface SchoolContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: SchoolSettings) => void;
  resetSettingsToDefault: () => void;
  
  currentUser: User | null;
  currentRole: UserRole;
  loginAsRole: (role: UserRole) => void;
  logout: () => void;
  
  currentView: string;
  viewParams: Record<string, any>;
  navigate: (view: string, params?: Record<string, any>) => void;

  students: Student[];
  teachers: Teacher[];
  schedules: ScheduleItem[];
  attendance: AttendanceRecord[];
  grades: GradeItem[];
  assignments: Assignment[];
  materials: LearningMaterial[];
  exams: Exam[];
  spmbApplications: SPMBApplication[];
  payments: PaymentRecord[];
  complaints: ComplaintTicket[];
  characterRecords: CharacterPointRecord[];
  worshipLogs: WorshipLog[];
  books: LibraryBook[];
  news: NewsItem[];
  achievements: AchievementItem[];
  gallery: GalleryItem[];
  events: EventItem[];
  notifications: NotificationAlert[];
  userAccounts: UserAccount[];

  // Interactive Actions
  addUserAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => UserAccount;
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => void;
  deleteUserAccount: (id: string) => void;
  resetUserPassword: (id: string, newPassword?: string) => string;
  generateBatchTeacherAccounts: () => number;
  generateBatchParentAccounts: () => number;
  loginWithCredentials: (identifier: string, pass: string) => { success: boolean; message?: string; role?: UserRole };
  submitSPMB: (data: Partial<SPMBApplication>) => SPMBApplication;
  updateSPMBStatus: (id: string, status: SPMBApplication['status'], notes?: string) => void;
  submitComplaint: (data: { senderName: string; senderContact: string; category: ComplaintTicket['category']; message: string }) => ComplaintTicket;
  updateComplaintStatus: (id: string, status: ComplaintTicket['status'], responseNote?: string) => void;
  markAttendance: (studentId: string, status: AttendanceRecord['status'], note?: string) => void;
  addCharacterPoints: (studentId: string, dimension: CharacterPointRecord['dimension'], points: number, note: string) => void;
  payTuition: (invoiceNumber: string, method: string) => void;
  addPaymentRecord: (record: Omit<PaymentRecord, 'id'>) => PaymentRecord;
  updatePaymentRecord: (id: string, updates: Partial<PaymentRecord>) => void;
  deletePaymentRecord: (id: string) => void;
  generateMonthlyInvoices: (month: string, year: number) => number;
  saveGrade: (grade: GradeItem) => void;
  updateWorshipLog: (log: Partial<WorshipLog>) => void;
  borrowBook: (bookId: string, borrowerName: string, role: 'SISWA' | 'GURU') => boolean;
  returnBook: (bookId: string) => void;
  generateAssessmentDraft: (subject: string, className: string, topic: string, totalQuestions: number) => Exam;
  addNewsArticle: (article: Omit<NewsItem, 'id' | 'slug'>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  deleteTeachers: (ids: string[]) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  deleteStudents: (ids: string[]) => void;
  classes: SchoolClass[];
  addClass: (cls: Omit<SchoolClass, 'id'>) => void;
  updateClass: (id: string, updated: Partial<SchoolClass>) => void;
  deleteClass: (id: string) => void;
  batchUpdateStudentClass: (studentIds: string[], targetClassName: string) => void;
  importTeachersFromExcel: (newTeachers: Omit<Teacher, 'id'>[]) => number;
  importStudentsFromExcel: (newStudents: Omit<Student, 'id'>[]) => number;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load settings with LocalStorage persistence
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('mi_rpi_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.academicYear === '2026/2027') {
          parsed.academicYear = '2027/2028';
          localStorage.setItem('mi_rpi_settings', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        return initialSchoolSettings;
      }
    }
    return initialSchoolSettings;
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, any>>({});

  // Auth User
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('SISWA');

  // Dynamic state arrays
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('mi_rpi_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('mi_rpi_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    const saved = localStorage.getItem('mi_rpi_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  const [schedules] = useState<ScheduleItem[]>(initialSchedules);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [grades, setGrades] = useState<GradeItem[]>(initialGrades);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [materials] = useState<LearningMaterial[]>(initialMaterials);
  const [exams, setExams] = useState<Exam[]>(initialExams);
  
  const [spmbApplications, setSpmbApplications] = useState<SPMBApplication[]>(() => {
    const saved = localStorage.getItem('mi_rpi_spmb');
    return saved ? JSON.parse(saved) : initialSPMBApplications;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('mi_rpi_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [complaints, setComplaints] = useState<ComplaintTicket[]>(() => {
    const saved = localStorage.getItem('mi_rpi_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [characterRecords, setCharacterRecords] = useState<CharacterPointRecord[]>(initialCharacterRecords);
  const [worshipLogs, setWorshipLogs] = useState<WorshipLog[]>(initialWorshipLogs);
  const [books, setBooks] = useState<LibraryBook[]>(initialBooks);
  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('mi_rpi_news');
    return saved ? JSON.parse(saved) : initialNews;
  });
  const [achievements, setAchievements] = useState<AchievementItem[]>(initialAchievements);
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('mi_rpi_gallery');
    return saved ? JSON.parse(saved) : initialGallery;
  });
  const [events] = useState<EventItem[]>(initialEvents);
  const [notifications, setNotifications] = useState<NotificationAlert[]>(initialNotifications);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('mi_rpi_user_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user accounts', e);
      }
    }
    return initialUserAccounts;
  });

  useEffect(() => {
    localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(userAccounts));
  }, [userAccounts]);

  useEffect(() => {
    localStorage.setItem('mi_rpi_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('mi_rpi_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('mi_rpi_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('mi_rpi_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('mi_rpi_news', JSON.stringify(news));
  }, [news]);

  // Sync settings to LocalStorage
  const updateSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    localStorage.setItem('mi_rpi_settings', JSON.stringify(newSettings));
  };

  const resetSettingsToDefault = () => {
    setSettings(initialSchoolSettings);
    localStorage.removeItem('mi_rpi_settings');
  };

  // Sync SPMB to LocalStorage
  useEffect(() => {
    localStorage.setItem('mi_rpi_spmb', JSON.stringify(spmbApplications));
  }, [spmbApplications]);

  // Sync Payments to LocalStorage
  useEffect(() => {
    localStorage.setItem('mi_rpi_payments', JSON.stringify(payments));
  }, [payments]);

  // Sync Complaints to LocalStorage
  useEffect(() => {
    localStorage.setItem('mi_rpi_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Navigation Helper
  const navigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Role Login Helper
  const loginAsRole = (role: UserRole) => {
    setCurrentRole(role);
    let mockUser: User;
    switch (role) {
      case 'SISWA':
        mockUser = {
          id: 'std-001',
          name: 'Muhammad Al Fatih',
          email: 'alfatih@siswa.mirpi.sch.id',
          role: 'SISWA',
          studentId: 'std-001',
          classAssigned: 'Kelas 4A',
          avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=240&auto=format&fit=crop&q=80',
        };
        setCurrentUser(mockUser);
        navigate('portal-siswa');
        break;
      case 'ORANG_TUA':
        mockUser = {
          id: 'prt-001',
          name: 'Ibu Fatimah Zahra, S.E.',
          email: 'fatimah.zahra@gmail.com',
          role: 'ORANG_TUA',
          studentId: 'std-001',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
        };
        setCurrentUser(mockUser);
        navigate('portal-ortu');
        break;
      case 'GURU':
      case 'WALI_KELAS':
        mockUser = {
          id: 'tch-001',
          name: 'Ustadz Ahmad Fauzi, S.Pd.I',
          email: 'ahmad.fauzi@guru.mirpi.sch.id',
          role: 'GURU',
          teacherId: 'tch-001',
          classAssigned: 'Kelas 4A',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80',
        };
        setCurrentUser(mockUser);
        navigate('portal-guru');
        break;
      case 'KEPALA_MADRASAH':
        mockUser = {
          id: 'adm-kamad',
          name: settings.principalName !== '[DATA BELUM DIISI ADMIN]' ? settings.principalName : 'Kepala Madrasah MI RPI',
          email: 'kamad@mirpi.sch.id',
          role: 'KEPALA_MADRASAH',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
        };
        setCurrentUser(mockUser);
        navigate('portal-kepsek');
        break;
      case 'ADMIN':
      case 'SUPER_ADMIN':
      case 'OPERATOR':
      default:
        mockUser = {
          id: 'adm-001',
          name: 'Administrator MI RPI',
          email: 'admin@mirpi.sch.id',
          role: 'ADMIN',
          avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
        };
        setCurrentUser(mockUser);
        navigate('portal-admin');
        break;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('home');
  };

  // Submit SPMB Application
  const submitSPMB = (data: Partial<SPMBApplication>): SPMBApplication => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newApp: SPMBApplication = {
      id: `spmb-${Date.now()}`,
      registrationNumber: `SPMB-2027-${randomNum}`,
      studentName: data.studentName || 'Calon Siswa',
      birthPlace: data.birthPlace || 'Jakarta',
      birthDate: data.birthDate || '2020-01-01',
      gender: data.gender || 'L',
      nik: data.nik || '3174000000000000',
      nisn: data.nisn || '',
      parentName: data.parentName || 'Orang Tua Murid',
      parentPhone: data.parentPhone || '081234567890',
      address: data.address || 'Jakarta Selatan',
      previousSchool: data.previousSchool || 'TK / RA Asal',
      programChosen: data.programChosen || 'Kelas Reguler Unggulan',
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Menunggu Verifikasi',
      notes: 'Formulir telah diterima sistem. Menunggu pengecekan kelengkapan berkas oleh panitia.',
    };

    setSpmbApplications((prev) => [newApp, ...prev]);

    // Send push notification to Admin
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'ALL',
        title: 'Pendaftaran SPMB Baru',
        message: `Pendaftaran baru atas nama ${newApp.studentName} (${newApp.registrationNumber}) telah masuk.`,
        timestamp: 'Baru saja',
        read: false,
        type: 'general',
      },
      ...prev,
    ]);

    return newApp;
  };

  const updateSPMBStatus = (id: string, status: SPMBApplication['status'], notes?: string) => {
    setSpmbApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status, notes: notes || app.notes } : app))
    );
  };

  // Submit Complaint / Suara Warga
  const submitComplaint = (data: {
    senderName: string;
    senderContact: string;
    category: ComplaintTicket['category'];
    message: string;
  }): ComplaintTicket => {
    const ticketRandom = Math.floor(100 + Math.random() * 900);
    const newTicket: ComplaintTicket = {
      id: `cmp-${Date.now()}`,
      ticketNumber: `SW-2026-${ticketRandom}`,
      senderName: data.senderName,
      senderContact: data.senderContact,
      category: data.category,
      message: data.message,
      date: new Date().toISOString().split('T')[0],
      status: 'Diterima',
      responseNote: 'Aspirasi Anda telah diterima oleh bagian humas & tata usaha madrasah. Sedang dalam telaah.',
    };

    setComplaints((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateComplaintStatus = (id: string, status: ComplaintTicket['status'], responseNote?: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, responseNote: responseNote || c.responseNote } : c))
    );
  };

  // Mark Attendance
  const markAttendance = (studentId: string, status: AttendanceRecord['status'], note?: string) => {
    const student = students.find((s) => s.id === studentId);
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    setAttendance((prev) => {
      const filtered = prev.filter((a) => !(a.studentId === studentId && a.date === today));
      return [
        {
          id: `att-${Date.now()}`,
          date: today,
          studentId,
          studentName: student?.name || 'Siswa',
          className: student?.className || 'Kelas 4A',
          status,
          timeRecorded: nowTime,
          note: note || (status === 'Hadir' ? 'Tepat waktu' : status),
        },
        ...filtered,
      ];
    });

    // Alert notification for Parent
    if (studentId === 'std-001') {
      const msg =
        status === 'Hadir'
          ? `Ananda ${student?.name} telah hadir di madrasah hari ini pukul ${nowTime}.`
          : `Pemberitahuan absensi: Ananda ${student?.name} berstatus ${status} pada hari ini.`;
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          recipientRole: 'ORANG_TUA',
          title: 'Presensi Siswa Harian',
          message: msg,
          timestamp: nowTime,
          read: false,
          type: 'attendance',
        },
        ...prev,
      ]);
    }
  };

  // Add Character Points
  const addCharacterPoints = (
    studentId: string,
    dimension: CharacterPointRecord['dimension'],
    points: number,
    note: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    const record: CharacterPointRecord = {
      id: `cp-${Date.now()}`,
      studentId,
      studentName: student?.name || 'Siswa',
      dimension,
      points,
      note,
      teacherName: currentUser?.name || 'Ustadz Ahmad Fauzi, S.Pd.I',
      date: new Date().toISOString().split('T')[0],
    };

    setCharacterRecords((prev) => [record, ...prev]);

    // Notify Parent
    if (studentId === 'std-001') {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          recipientRole: 'ORANG_TUA',
          title: `Apresiasi Karakter: ${dimension}`,
          message: `Alhamdulillah! Ananda ${student?.name} mendapatkan apresiasi +${points} Poin Karakter ${dimension}: "${note}".`,
          timestamp: 'Hari ini',
          read: false,
          type: 'character',
        },
        ...prev,
      ]);
    }
  };

  // Pay SPP
  const payTuition = (invoiceNumber: string, method: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.invoiceNumber === invoiceNumber
          ? {
              ...p,
              status: 'Lunas',
              paymentDate: new Date().toISOString().split('T')[0],
              paymentMethod: method,
            }
          : p
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'ORANG_TUA',
        title: 'Pembayaran SPP Berhasil',
        message: `Pembayaran SPP tagihan ${invoiceNumber} telah terverifikasi lunas. Terima kasih atas partisipasi aktif Bapak/Ibu.`,
        timestamp: 'Baru saja',
        read: false,
        type: 'payment',
      },
      ...prev,
    ]);
  };

  // Add Payment Record manually by Admin
  const addPaymentRecord = (record: Omit<PaymentRecord, 'id'>): PaymentRecord => {
    const newRecord: PaymentRecord = {
      ...record,
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setPayments((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  // Update Payment Record
  const updatePaymentRecord = (id: string, updates: Partial<PaymentRecord>) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  // Delete Payment Record
  const deletePaymentRecord = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  // Generate Monthly Invoices for all students
  const generateMonthlyInvoices = (month: string, year: number): number => {
    let createdCount = 0;
    const newInvoices: PaymentRecord[] = [];

    students.forEach((student) => {
      const exists = payments.some(
        (p) => p.studentId === student.id && p.month === month && p.year === year
      );
      if (!exists) {
        createdCount++;
        const randNum = Math.floor(1000 + Math.random() * 9000);
        newInvoices.push({
          id: `pay-${Date.now()}-${student.id}`,
          invoiceNumber: `INV-${year}${month.substring(0, 3).toUpperCase()}-${student.nisn?.slice(-4) || randNum}`,
          studentId: student.id,
          studentName: student.name,
          className: student.className,
          month,
          year,
          amount: settings.monthlyTuitionFee || 650000,
          status: 'Belum Bayar',
        });
      }
    });

    if (newInvoices.length > 0) {
      setPayments((prev) => [...newInvoices, ...prev]);
    }
    return createdCount;
  };

  // Save Grade
  const saveGrade = (grade: GradeItem) => {
    setGrades((prev) => {
      const exists = prev.some((g) => g.id === grade.id);
      if (exists) {
        return prev.map((g) => (g.id === grade.id ? grade : g));
      }
      return [grade, ...prev];
    });

    if (grade.studentId === 'std-001') {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          recipientRole: 'ORANG_TUA',
          title: `Pembaruan Nilai ${grade.subject}`,
          message: `Nilai akhir ${grade.subject} ananda adalah ${grade.finalScore} (Predikat ${grade.predicate}).`,
          timestamp: 'Baru saja',
          read: false,
          type: 'academic',
        },
        ...prev,
      ]);
    }
  };

  // Update Worship Log
  const updateWorshipLog = (log: Partial<WorshipLog>) => {
    const today = new Date().toISOString().split('T')[0];
    setWorshipLogs((prev) => {
      const idx = prev.findIndex((l) => l.date === today && l.studentId === (log.studentId || 'std-001'));
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...log };
        return updated;
      }
      return [
        {
          id: `wl-${Date.now()}`,
          studentId: log.studentId || 'std-001',
          date: today,
          subuh: log.subuh ?? true,
          dzuhur: log.dzuhur ?? true,
          ashar: log.ashar ?? true,
          maghrib: log.maghrib ?? true,
          isya: log.isya ?? true,
          dhuha: log.dhuha ?? true,
          tahajud: log.tahajud ?? false,
          tadarusHalaman: log.tadarusHalaman ?? 2,
          parentApproved: true,
          teacherNote: log.teacherNote || 'MasyaAllah, ananda istiqomah dalam ibadah.',
        },
        ...prev,
      ];
    });
  };

  // Borrow Library Book
  const borrowBook = (bookId: string, borrowerName: string, role: 'SISWA' | 'GURU') => {
    const book = books.find((b) => b.id === bookId);
    if (!book || book.availableCopies <= 0) return false;

    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );
    return true;
  };

  const returnBook = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) } : b))
    );
  };

  // Generate Assessment Draft (for Teacher Bank Soal)
  const generateAssessmentDraft = (
    subject: string,
    className: string,
    topic: string,
    totalQuestions: number
  ): Exam => {
    const sampleQuestions = [
      {
        id: `gen-q-1`,
        type: 'pilihan_ganda' as const,
        questionText: `Pada pembelajaran ${subject} mengenai ${topic}, manakah perilaku berikut yang mencerminkan akhlak terpuji?`,
        options: ['Membantu teman tanpa pamrih', 'Mencontek saat ujian', 'Menghina pendapat orang lain', 'Mengabaikan kebersihan kelas'],
        correctAnswer: 'Membantu teman tanpa pamrih',
        points: 20,
        explanation: 'Membantu teman adalah perwujudan akhlak karimah dan ta\'awun.',
      },
      {
        id: `gen-q-2`,
        type: 'benar_salah' as const,
        questionText: `Penerapan ${topic} dalam kehidupan sehari-hari harus dilandasi dengan niat ikhlas lillahi ta'ala.`,
        options: ['Benar', 'Salah'],
        correctAnswer: 'Benar',
        points: 20,
        explanation: 'Segala amal perbuatan dalam Islam dinilai berdasarkan niatnya.',
      },
      {
        id: `gen-q-3`,
        type: 'essay' as const,
        questionText: `Jelaskan secara singkat 2 hikmah mempelajari materi ${topic} untuk kehidupan di era modern!`,
        correctAnswer: 'Meningkatkan pemahaman kontekstual dan memperkuat karakter islami.',
        points: 30,
        explanation: 'Jawaban mengukur nalar kritis dan pemaknaan peserta didik.',
      },
      {
        id: `gen-q-4`,
        type: 'pilihan_ganda' as const,
        questionText: `Berdasarkan materi ${topic}, apa langkah awal yang harus dilakukan saat menghadapi perbedaan pendapat?`,
        options: ['Bermusyawarah dengan santun', 'Memaksakan kehendak', 'Meninggalkan teman', 'Marah dan membantah'],
        correctAnswer: 'Bermusyawarah dengan santun',
        points: 30,
        explanation: 'Musyawarah adalah prinsip utama dalam Al-Qur\'an.',
      },
    ];

    const newExam: Exam = {
      id: `ex-${Date.now()}`,
      title: `Asesmen Formatif: ${topic}`,
      subject,
      className,
      durationMinutes: 45,
      totalQuestions: sampleQuestions.length,
      deadline: '2026-10-05 14.00 WIB',
      questions: sampleQuestions,
    };

    setExams((prev) => [newExam, ...prev]);
    return newExam;
  };

  const addNewsArticle = (article: Omit<NewsItem, 'id' | 'slug'>) => {
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newArticle: NewsItem = {
      ...article,
      id: `nws-${Date.now()}`,
      slug,
    };
    setNews((prev) => [newArticle, ...prev]);
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    setGallery((prev) => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const addTeacher = (t: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...t,
      id: `tch-${Date.now()}`,
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteTeachers = (ids: string[]) => {
    const idSet = new Set(ids);
    setTeachers((prev) => prev.filter((t) => !idSet.has(t.id)));
  };

  const addStudent = (s: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...s,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const deleteStudents = (ids: string[]) => {
    const idSet = new Set(ids);
    setStudents((prev) => prev.filter((s) => !idSet.has(s.id)));
  };

  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...cls,
      id: `cls-${Date.now()}`,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const updateClass = (id: string, updated: Partial<SchoolClass>) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedClass = { ...c, ...updated };
          // If class name changed, update students and teachers referencing this class name
          if (updated.name && updated.name !== c.name) {
            setStudents((prevStudents) =>
              prevStudents.map((s) => (s.className === c.name ? { ...s, className: updated.name! } : s))
            );
            setTeachers((prevTeachers) =>
              prevTeachers.map((t) => (t.homeroomClass === c.name ? { ...t, homeroomClass: updated.name! } : t))
            );
          }
          return updatedClass;
        }
        return c;
      })
    );
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
  };

  const batchUpdateStudentClass = (studentIds: string[], targetClassName: string) => {
    setStudents((prev) =>
      prev.map((s) => (studentIds.includes(s.id) ? { ...s, className: targetClassName } : s))
    );
  };

  const importTeachersFromExcel = (newTeachers: Omit<Teacher, 'id'>[]): number => {
    let count = 0;
    setTeachers((prev) => {
      const existingNips = new Set(prev.map((t) => t.nip.trim()));
      const toAdd: Teacher[] = [];

      newTeachers.forEach((t) => {
        if (t.name && t.nip && !existingNips.has(t.nip.trim())) {
          toAdd.push({
            ...t,
            id: `tch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          });
          existingNips.add(t.nip.trim());
          count++;
        }
      });

      return [...prev, ...toAdd];
    });
    return count;
  };

  const importStudentsFromExcel = (newStudents: Omit<Student, 'id'>[]): number => {
    let count = 0;
    setStudents((prev) => {
      const existingNisns = new Set(prev.map((s) => s.nisn.trim()));
      const toAdd: Student[] = [];

      newStudents.forEach((s) => {
        if (s.name && s.nisn && !existingNisns.has(s.nisn.trim())) {
          toAdd.push({
            ...s,
            id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          });
          existingNisns.add(s.nisn.trim());
          count++;
        }
      });

      return [...prev, ...toAdd];
    });
    return count;
  };

  const addUserAccount = (acc: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount => {
    const newAcc: UserAccount = {
      ...acc,
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: acc.status || 'Aktif',
    };
    setUserAccounts((prev) => [newAcc, ...prev]);
    return newAcc;
  };

  const updateUserAccount = (id: string, updates: Partial<UserAccount>) => {
    setUserAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc))
    );
  };

  const deleteUserAccount = (id: string) => {
    setUserAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  const resetUserPassword = (id: string, newPassword?: string): string => {
    const generated = newPassword || `RPI-${Math.floor(100000 + Math.random() * 900000)}`;
    setUserAccounts((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, password: generated } : acc))
    );
    return generated;
  };

  const generateBatchTeacherAccounts = (): number => {
    let createdCount = 0;
    teachers.forEach((t) => {
      const exists = userAccounts.some(
        (a) => a.username === t.nip || a.nip === t.nip || a.name.toLowerCase() === t.name.toLowerCase()
      );
      if (!exists && t.nip) {
        const cleanName = t.name.replace(/[^a-zA-Z]/g, '').toLowerCase().slice(0, 10);
        addUserAccount({
          name: t.name,
          username: t.nip,
          password: `GuruRPI#${t.nip.slice(-4) || '2026'}`,
          role: 'GURU',
          nip: t.nip,
          email: `${cleanName}@guru.mirpi.sch.id`,
          subject: t.subject,
          className: t.homeroomClass,
          status: 'Aktif',
        });
        createdCount++;
      }
    });
    return createdCount;
  };

  const generateBatchParentAccounts = (): number => {
    let createdCount = 0;
    students.forEach((s) => {
      const exists = userAccounts.some(
        (a) => a.username === s.nisn || a.nisn === s.nisn || (a.studentName && a.studentName.toLowerCase() === s.name.toLowerCase())
      );
      if (!exists && s.nisn) {
        addUserAccount({
          name: s.parentName || `Wali dari ${s.name}`,
          username: s.nisn,
          password: `Wali#${s.nisn.slice(-4) || '2026'}`,
          role: 'ORANG_TUA',
          nisn: s.nisn,
          studentName: s.name,
          className: s.className,
          phone: s.parentPhone,
          status: 'Aktif',
        });
        createdCount++;
      }
    });
    return createdCount;
  };

  const loginWithCredentials = (
    identifier: string,
    pass: string
  ): { success: boolean; message?: string; role?: UserRole } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Harap isi username/NIP/NISN dan kata sandi.' };
    }

    const account = userAccounts.find(
      (a) =>
        (a.username.toLowerCase() === cleanId ||
          (a.email && a.email.toLowerCase() === cleanId) ||
          (a.nip && a.nip === cleanId) ||
          (a.nisn && a.nisn === cleanId)) &&
        a.password === cleanPass
    );

    if (!account) {
      return {
        success: false,
        message: 'Username/NIP/NISN atau kata sandi tidak cocok. Silakan cek kembali atau hubungi Administrator.',
      };
    }

    if (account.status === 'Nonaktif') {
      return {
        success: false,
        message: 'Akun Anda dinonaktifkan oleh administrator madrasah. Hubungi tata usaha.',
      };
    }

    // Update lastLogin timestamp
    updateUserAccount(account.id, {
      lastLogin: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    setCurrentRole(account.role);
    const mockUser: User = {
      id: account.id,
      name: account.name,
      email: account.email || `${account.username}@mirpi.sch.id`,
      role: account.role,
      studentId: account.nisn,
      teacherId: account.nip,
      classAssigned: account.className,
    };
    setCurrentUser(mockUser);

    if (account.role === 'GURU' || account.role === 'WALI_KELAS') {
      navigate('portal-guru');
    } else if (account.role === 'ORANG_TUA') {
      navigate('portal-ortu');
    } else if (account.role === 'SISWA') {
      navigate('portal-siswa');
    } else if (account.role === 'KEPALA_MADRASAH') {
      navigate('portal-kamad');
    } else {
      navigate('portal-admin');
    }

    return { success: true, role: account.role };
  };

  return (
    <SchoolContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettingsToDefault,
        currentUser,
        currentRole,
        loginAsRole,
        logout,
        currentView,
        viewParams,
        navigate,
        students,
        teachers,
        schedules,
        attendance,
        grades,
        assignments,
        materials,
        exams,
        spmbApplications,
        payments,
        complaints,
        characterRecords,
        worshipLogs,
        books,
        news,
        achievements,
        gallery,
        events,
        notifications,
        userAccounts,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
        resetUserPassword,
        generateBatchTeacherAccounts,
        generateBatchParentAccounts,
        loginWithCredentials,
        submitSPMB,
        updateSPMBStatus,
        submitComplaint,
        updateComplaintStatus,
        markAttendance,
        addCharacterPoints,
        payTuition,
        addPaymentRecord,
        updatePaymentRecord,
        deletePaymentRecord,
        generateMonthlyInvoices,
        saveGrade,
        updateWorshipLog,
        borrowBook,
        returnBook,
        generateAssessmentDraft,
        addNewsArticle,
        addGalleryItem,
        deleteGalleryItem,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        deleteTeachers,
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
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
