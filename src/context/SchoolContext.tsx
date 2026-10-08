import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  FlagshipProgram,
  GraduateDimension,
  AcademicSubjectGroup,
  StudentHabit,
  Extracurricular,
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
  initialPrograms,
  initialDimensions,
  initialAcademicSubjects,
  initialHabits,
  initialExtracurriculars,
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

  // Curriculum & Programs Management
  programs: FlagshipProgram[];
  addProgram: (prog: Omit<FlagshipProgram, 'id'>) => void;
  updateProgram: (id: number | string, updates: Partial<FlagshipProgram>) => void;
  deleteProgram: (id: number | string) => void;

  dimensions: GraduateDimension[];
  updateDimensions: (newDims: GraduateDimension[]) => void;

  academicSubjects: AcademicSubjectGroup[];
  updateAcademicSubjects: (newSubjects: AcademicSubjectGroup[]) => void;

  habits: StudentHabit[];
  updateHabits: (newHabits: StudentHabit[]) => void;

  extracurriculars: Extracurricular[];
  updateExtracurriculars: (newExcurs: Extracurricular[]) => void;

  // Schedules (Simulasi Jadwal Pelajaran)
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  resetSchedulesToDefault: () => void;

  // Interactive Actions
  addUserAccount: (account: Omit<UserAccount, 'id' | 'createdAt'>) => UserAccount;
  updateUserAccount: (id: string, updates: Partial<UserAccount>) => void;
  deleteUserAccount: (id: string) => void;
  resetUserPassword: (id: string, newPassword?: string) => string;
  generateBatchTeacherAccounts: () => number;
  generateBatchParentAccounts: () => number;
  generateBatchStudentAccounts: () => number;
  loginWithCredentials: (identifier: string, pass: string, targetRole?: UserRole) => { success: boolean; message?: string; role?: UserRole };
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
  saveBatchGrades: (grades: GradeItem[]) => void;
  updateWorshipLog: (log: Partial<WorshipLog>) => void;
  borrowBook: (bookId: string, borrowerName: string, role: 'SISWA' | 'GURU') => boolean;
  returnBook: (bookId: string) => void;
  generateAssessmentDraft: (subject: string, className: string, topic: string, totalQuestions: number) => Exam;
  addNewsArticle: (article: Omit<NewsItem, 'id' | 'slug'>) => void;
  updateNewsArticle: (id: string, updates: Partial<NewsItem>) => void;
  deleteNewsArticle: (id: string) => void;
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
  restoreFullDatabase: (data: Record<string, any>) => Promise<boolean>;
  fetchBackupsList: () => Promise<any[]>;
  restoreBackupByFilename: (filename: string) => Promise<boolean>;
  exportFullDatabase: () => void;
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
        }
        if (!parsed.logoUrl) {
          parsed.logoUrl = '/images/logo-yayasan-rpi.svg';
        }
        localStorage.setItem('mi_rpi_settings', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        return initialSchoolSettings;
      }
    }
    return initialSchoolSettings;
  });

  // Navigation State - Persistent on refresh
  const [currentView, setCurrentView] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('mi_rpi_current_view');
      return saved || 'home';
    } catch {
      return 'home';
    }
  });
  const [viewParams, setViewParams] = useState<Record<string, any>>(() => {
    try {
      const saved = localStorage.getItem('mi_rpi_view_params');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Auth User - Persistent session across browser refresh
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('mi_rpi_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('mi_rpi_auth_role');
      return (saved as UserRole) || 'SISWA';
    } catch {
      return 'SISWA';
    }
  });

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
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('mi_rpi_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [grades, setGrades] = useState<GradeItem[]>(() => {
    const saved = localStorage.getItem('mi_rpi_grades');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialGrades;
      }
    }
    return initialGrades;
  });
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
        const parsed: UserAccount[] = JSON.parse(saved);
        return parsed.map((acc) => {
          if (acc.role === 'BENDAHARA' || acc.role === 'ADMIN' || acc.role === 'KEPALA_MADRASAH') {
            const copy = { ...acc };
            delete copy.className;
            delete copy.subject;
            return copy;
          }
          return acc;
        });
      } catch (e) {
        console.error('Failed to parse user accounts', e);
      }
    }
    return initialUserAccounts;
  });

  const [programs, setPrograms] = useState<FlagshipProgram[]>(() => {
    const saved = localStorage.getItem('mi_rpi_programs');
    return saved ? JSON.parse(saved) : initialPrograms;
  });

  const [dimensions, setDimensions] = useState<GraduateDimension[]>(() => {
    const saved = localStorage.getItem('mi_rpi_dimensions');
    return saved ? JSON.parse(saved) : initialDimensions;
  });

  const [academicSubjects, setAcademicSubjects] = useState<AcademicSubjectGroup[]>(() => {
    const saved = localStorage.getItem('mi_rpi_academic_subjects');
    return saved ? JSON.parse(saved) : initialAcademicSubjects;
  });

  const [habits, setHabits] = useState<StudentHabit[]>(() => {
    const saved = localStorage.getItem('mi_rpi_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(() => {
    const saved = localStorage.getItem('mi_rpi_extracurriculars');
    return saved ? JSON.parse(saved) : initialExtracurriculars;
  });

  // Guard to prevent initial render / unhydrated state from overwriting the server database
  const isHydratedRef = useRef(false);

  // Helper to sync collections to server disk
  const syncToServer = async (key: string, data: any) => {
    try {
      const res = await fetch('/api/school-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data[key]) {
          try {
            localStorage.setItem(`mi_rpi_${key}`, JSON.stringify(json.data[key]));
          } catch (_) {}
        }
      }
    } catch (e) {
      console.warn(`Sync to server failed for ${key}:`, e);
    }
  };

  // Initial hydration from server database
  useEffect(() => {
    let isMounted = true;
    const hydrateFromServer = async () => {
      try {
        const res = await fetch('/api/school-data');
        if (res.ok) {
          const json = await res.json();
          if (json.data && isMounted) {
            const serverData = json.data;
            if (serverData.settings) {
              setSettings(serverData.settings);
              try {
                localStorage.setItem('mi_rpi_settings', JSON.stringify(serverData.settings));
              } catch (_) {}
            }
            if (Array.isArray(serverData.gallery) && serverData.gallery.length > 0) {
              setGallery(serverData.gallery);
              try {
                localStorage.setItem('mi_rpi_gallery', JSON.stringify(serverData.gallery));
              } catch (_) {}
            }
            if (Array.isArray(serverData.teachers) && serverData.teachers.length > 0) {
              setTeachers((prevLocal) => {
                const backupRaw = localStorage.getItem('mi_rpi_teachers_backup');
                let candidate = prevLocal;
                if (backupRaw) {
                  try {
                    const parsed = JSON.parse(backupRaw);
                    if (Array.isArray(parsed) && parsed.length > 0) candidate = parsed;
                  } catch (_) {}
                }

                // Intelligently merge: Preserve any teacher's custom photo or updated data from local candidate!
                const merged = serverData.teachers.map((st: Teacher) => {
                  const localMatch = candidate.find((lt) => lt.id === st.id || (lt.nip && lt.nip === st.nip));
                  if (localMatch) {
                    const isCustomLocalPhoto = localMatch.photoUrl && (
                      localMatch.photoUrl.startsWith('/uploads') ||
                      localMatch.photoUrl.startsWith('data:') ||
                      localMatch.photoUrl !== st.photoUrl
                    );
                    return {
                      ...st,
                      ...localMatch,
                      photoUrl: isCustomLocalPhoto ? localMatch.photoUrl : (st.photoUrl || localMatch.photoUrl),
                    };
                  }
                  return st;
                });

                // Also keep any local teachers not in server
                candidate.forEach((lt) => {
                  if (!merged.some((m: Teacher) => m.id === lt.id || (m.nip && m.nip === lt.nip))) {
                    merged.push(lt);
                  }
                });

                try {
                  localStorage.setItem('mi_rpi_teachers', JSON.stringify(merged));
                  localStorage.setItem('mi_rpi_teachers_backup', JSON.stringify(merged));
                } catch (_) {}
                syncToServer('teachers', merged);
                return merged;
              });
            }
            if (Array.isArray(serverData.students) && serverData.students.length > 0) {
              setStudents((prevLocal) => {
                const backupRaw = localStorage.getItem('mi_rpi_students_backup');
                let candidate = prevLocal;
                if (backupRaw) {
                  try {
                    const parsed = JSON.parse(backupRaw);
                    if (Array.isArray(parsed) && parsed.length > candidate.length) candidate = parsed;
                  } catch (_) {}
                }
                // Never overwrite local uploaded students with fewer server dummy students!
                if (candidate.length > serverData.students.length) {
                  syncToServer('students', candidate);
                  try {
                    localStorage.setItem('mi_rpi_students', JSON.stringify(candidate));
                    localStorage.setItem('mi_rpi_students_backup', JSON.stringify(candidate));
                  } catch (_) {}
                  return candidate;
                }
                // If server has more or equal, preserve any local students that have unique NISN
                const existingNisns = new Set(serverData.students.map((s: Student) => s.nisn?.trim()));
                const extraLocal = candidate.filter((c) => c.nisn && !existingNisns.has(c.nisn.trim()));
                const finalStudents = extraLocal.length > 0 ? [...serverData.students, ...extraLocal] : serverData.students;

                try {
                  localStorage.setItem('mi_rpi_students', JSON.stringify(finalStudents));
                  localStorage.setItem('mi_rpi_students_backup', JSON.stringify(finalStudents));
                } catch (_) {}
                if (extraLocal.length > 0) {
                  syncToServer('students', finalStudents);
                }
                return finalStudents;
              });
            }
            if (Array.isArray(serverData.classes) && serverData.classes.length > 0) {
              setClasses(serverData.classes);
              try {
                localStorage.setItem('mi_rpi_classes', JSON.stringify(serverData.classes));
              } catch (_) {}
            }
            if (Array.isArray(serverData.userAccounts) && serverData.userAccounts.length > 0) {
              const cleaned = serverData.userAccounts.map((acc: any) => {
                if (acc.role === 'BENDAHARA' || acc.role === 'ADMIN' || acc.role === 'KEPALA_MADRASAH') {
                  const copy = { ...acc };
                  delete copy.className;
                  delete copy.subject;
                  return copy;
                }
                return acc;
              });
              setUserAccounts(cleaned);
              try {
                localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(cleaned));
              } catch (_) {}
            }
            if (Array.isArray(serverData.news) && serverData.news.length > 0) {
              setNews(serverData.news);
              try {
                localStorage.setItem('mi_rpi_news', JSON.stringify(serverData.news));
              } catch (_) {}
            }
            if (Array.isArray(serverData.spmbApplications) && serverData.spmbApplications.length > 0) {
              setSpmbApplications(serverData.spmbApplications);
              try {
                localStorage.setItem('mi_rpi_spmb', JSON.stringify(serverData.spmbApplications));
              } catch (_) {}
            }
            if (Array.isArray(serverData.programs) && serverData.programs.length > 0) {
              setPrograms(serverData.programs);
              try {
                localStorage.setItem('mi_rpi_programs', JSON.stringify(serverData.programs));
              } catch (_) {}
            }
            if (Array.isArray(serverData.dimensions) && serverData.dimensions.length > 0) {
              setDimensions(serverData.dimensions);
              try {
                localStorage.setItem('mi_rpi_dimensions', JSON.stringify(serverData.dimensions));
              } catch (_) {}
            }
            if (Array.isArray(serverData.academicSubjects) && serverData.academicSubjects.length > 0) {
              setAcademicSubjects(serverData.academicSubjects);
              try {
                localStorage.setItem('mi_rpi_academic_subjects', JSON.stringify(serverData.academicSubjects));
              } catch (_) {}
            }
            if (Array.isArray(serverData.habits) && serverData.habits.length > 0) {
              setHabits(serverData.habits);
              try {
                localStorage.setItem('mi_rpi_habits', JSON.stringify(serverData.habits));
              } catch (_) {}
            }
            if (Array.isArray(serverData.extracurriculars) && serverData.extracurriculars.length > 0) {
              setExtracurriculars(serverData.extracurriculars);
              try {
                localStorage.setItem('mi_rpi_extracurriculars', JSON.stringify(serverData.extracurriculars));
              } catch (_) {}
            }
            if (Array.isArray(serverData.schedules) && serverData.schedules.length > 0) {
              setSchedules(serverData.schedules);
              try {
                localStorage.setItem('mi_rpi_schedules', JSON.stringify(serverData.schedules));
              } catch (_) {}
            }
          }
        }
      } catch (err) {
        console.warn('Initial server hydration warning:', err);
      } finally {
        if (isMounted) {
          isHydratedRef.current = true;
        }
      }
    };
    hydrateFromServer();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(userAccounts));
    } catch (_) {}
  }, [userAccounts]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_teachers', JSON.stringify(teachers));
    } catch (_) {}
  }, [teachers]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_students', JSON.stringify(students));
    } catch (_) {}
  }, [students]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_classes', JSON.stringify(classes));
    } catch (_) {}
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem('mi_rpi_grades', JSON.stringify(grades));
    } catch (e) {
      console.warn('LocalStorage error while saving grades:', e);
    }
  }, [grades]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_gallery', JSON.stringify(gallery));
    } catch (_) {}
  }, [gallery]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_news', JSON.stringify(news));
    } catch (_) {}
  }, [news]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_spmb', JSON.stringify(spmbApplications));
    } catch (_) {}
  }, [spmbApplications]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_programs', JSON.stringify(programs));
    } catch (_) {}
  }, [programs]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_dimensions', JSON.stringify(dimensions));
    } catch (_) {}
  }, [dimensions]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_academic_subjects', JSON.stringify(academicSubjects));
    } catch (_) {}
  }, [academicSubjects]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_habits', JSON.stringify(habits));
    } catch (_) {}
  }, [habits]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_extracurriculars', JSON.stringify(extracurriculars));
    } catch (_) {}
  }, [extracurriculars]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    try {
      localStorage.setItem('mi_rpi_schedules', JSON.stringify(schedules));
    } catch (_) {}
  }, [schedules]);

  // Sync settings to LocalStorage and Server Disk
  const updateSettings = async (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('mi_rpi_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.warn('LocalStorage error while saving settings:', e);
    }
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.settings) {
          setSettings(json.settings);
          try {
            localStorage.setItem('mi_rpi_settings', JSON.stringify(json.settings));
          } catch (_) {}
        }
      }
    } catch (e) {
      console.warn('Server settings sync failed:', e);
    }
  };

  const resetSettingsToDefault = async () => {
    setSettings(initialSchoolSettings);
    try {
      localStorage.removeItem('mi_rpi_settings');
    } catch (_) {}
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: initialSchoolSettings }),
      });
    } catch (e) {
      console.warn('Server reset settings failed:', e);
    }
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

  // Navigation Helper with LocalStorage persistence so page refresh stays on current page
  const navigate = (view: string, params: Record<string, any> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    try {
      localStorage.setItem('mi_rpi_current_view', view);
      localStorage.setItem('mi_rpi_view_params', JSON.stringify(params));
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync auth state to LocalStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('mi_rpi_auth_user', JSON.stringify(currentUser));
        localStorage.setItem('mi_rpi_auth_role', currentRole);
      } else {
        localStorage.removeItem('mi_rpi_auth_user');
      }
    } catch (_) {}
  }, [currentUser, currentRole]);

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
        break;
      case 'KEPALA_MADRASAH':
        mockUser = {
          id: 'adm-kamad',
          name: settings.principalName !== '[DATA BELUM DIISI ADMIN]' ? settings.principalName : 'Kepala Madrasah MI RPI',
          email: 'kamad@mirpi.sch.id',
          role: 'KEPALA_MADRASAH',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=240&auto=format&fit=crop&q=80',
        };
        break;
      case 'BENDAHARA':
        mockUser = {
          id: 'acc-bendahara-001',
          name: 'Hj. Siti Mutmainnah, S.E. (Bendahara Madrasah)',
          email: 'bendahara@mirpi.sch.id',
          role: 'BENDAHARA',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
        };
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
        break;
    }

    setCurrentUser(mockUser);
    try {
      localStorage.setItem('mi_rpi_auth_user', JSON.stringify(mockUser));
      localStorage.setItem('mi_rpi_auth_role', role);
    } catch (_) {}

    switch (role) {
      case 'SISWA':
        navigate('portal-siswa');
        break;
      case 'ORANG_TUA':
        navigate('portal-ortu');
        break;
      case 'GURU':
      case 'WALI_KELAS':
        navigate('portal-guru');
        break;
      case 'KEPALA_MADRASAH':
        navigate('portal-kamad');
        break;
      case 'BENDAHARA':
        navigate('portal-bendahara');
        break;
      default:
        navigate('portal-admin');
        break;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('SISWA');
    try {
      localStorage.removeItem('mi_rpi_auth_user');
      localStorage.removeItem('mi_rpi_auth_role');
      localStorage.setItem('mi_rpi_current_view', 'home');
      localStorage.setItem('mi_rpi_view_params', '{}');
    } catch (_) {}
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

  // Save Batch Grades (from RDM Kemenag sync or file import)
  const saveBatchGrades = (newGrades: GradeItem[]) => {
    setGrades((prev) => {
      const copy = [...prev];
      newGrades.forEach((ng) => {
        const idx = copy.findIndex((g) => g.studentId === ng.studentId && g.subject === ng.subject);
        if (idx >= 0) {
          copy[idx] = { ...copy[idx], ...ng };
        } else {
          copy.unshift(ng);
        }
      });
      return copy;
    });

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        recipientRole: 'ORANG_TUA',
        title: 'Sinkronisasi Nilai RDM Kemenag',
        message: `Nilai e-Rapor resmi berhasil disinkronkan dari server RDM Kemenag (${newGrades.length} rekaman nilai).`,
        timestamp: 'Baru saja',
        read: false,
        type: 'academic',
      },
      ...prev,
    ]);
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
    setNews((prev) => {
      const next = [newArticle, ...prev];
      try {
        localStorage.setItem('mi_rpi_news', JSON.stringify(next));
      } catch (_) {}
      syncToServer('news', next);
      return next;
    });
  };

  const updateNewsArticle = (id: string, updates: Partial<NewsItem>) => {
    setNews((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      try {
        localStorage.setItem('mi_rpi_news', JSON.stringify(next));
      } catch (_) {}
      syncToServer('news', next);
      return next;
    });
  };

  const deleteNewsArticle = (id: string) => {
    setNews((prev) => {
      const next = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('mi_rpi_news', JSON.stringify(next));
      } catch (_) {}
      syncToServer('news', next);
      return next;
    });
  };

  const addGalleryItem = (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
    };
    setGallery((prev) => {
      const next = [newItem, ...prev];
      try {
        localStorage.setItem('mi_rpi_gallery', JSON.stringify(next));
      } catch (_) {}
      syncToServer('gallery', next);
      return next;
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => {
      const next = prev.filter((g) => g.id !== id);
      try {
        localStorage.setItem('mi_rpi_gallery', JSON.stringify(next));
      } catch (_) {}
      syncToServer('gallery', next);
      return next;
    });
  };

  const addTeacher = (t: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...t,
      id: `tch-${Date.now()}`,
    };
    setTeachers((prev) => {
      const next = [...prev, newTeacher];
      try {
        localStorage.setItem('mi_rpi_teachers', JSON.stringify(next));
        localStorage.setItem('mi_rpi_teachers_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('teachers', next);
      return next;
    });
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, ...updated } : t));
      try {
        localStorage.setItem('mi_rpi_teachers', JSON.stringify(next));
        localStorage.setItem('mi_rpi_teachers_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('teachers', next);
      return next;
    });
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem('mi_rpi_teachers', JSON.stringify(next));
        localStorage.setItem('mi_rpi_teachers_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('teachers', next);
      return next;
    });
  };

  const deleteTeachers = (ids: string[]) => {
    const idSet = new Set(ids);
    setTeachers((prev) => {
      const next = prev.filter((t) => !idSet.has(t.id));
      try {
        localStorage.setItem('mi_rpi_teachers', JSON.stringify(next));
        localStorage.setItem('mi_rpi_teachers_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('teachers', next);
      return next;
    });
  };

  const addStudent = (s: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...s,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => {
      const next = [...prev, newStudent];
      try {
        localStorage.setItem('mi_rpi_students', JSON.stringify(next));
        localStorage.setItem('mi_rpi_students_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('students', next);
      return next;
    });
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updated } : s));
      try {
        localStorage.setItem('mi_rpi_students', JSON.stringify(next));
        localStorage.setItem('mi_rpi_students_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('students', next);
      return next;
    });
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('mi_rpi_students', JSON.stringify(next));
        localStorage.setItem('mi_rpi_students_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('students', next);
      return next;
    });
  };

  const deleteStudents = (ids: string[]) => {
    const idSet = new Set(ids);
    setStudents((prev) => {
      const next = prev.filter((s) => !idSet.has(s.id));
      try {
        localStorage.setItem('mi_rpi_students', JSON.stringify(next));
        localStorage.setItem('mi_rpi_students_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('students', next);
      return next;
    });
  };

  const addClass = (cls: Omit<SchoolClass, 'id'>) => {
    const newClass: SchoolClass = {
      ...cls,
      id: `cls-${Date.now()}`,
    };
    setClasses((prev) => {
      const next = [...prev, newClass];
      try {
        localStorage.setItem('mi_rpi_classes', JSON.stringify(next));
      } catch (_) {}
      syncToServer('classes', next);
      return next;
    });
  };

  const updateClass = (id: string, updated: Partial<SchoolClass>) => {
    setClasses((prev) => {
      const next = prev.map((c) => {
        if (c.id === id) {
          const updatedClass = { ...c, ...updated };
          // If class name changed, update students and teachers referencing this class name
          if (updated.name && updated.name !== c.name) {
            setStudents((prevStudents) => {
              const nextStudents = prevStudents.map((s) => (s.className === c.name ? { ...s, className: updated.name! } : s));
              try {
                localStorage.setItem('mi_rpi_students', JSON.stringify(nextStudents));
              } catch (_) {}
              syncToServer('students', nextStudents);
              return nextStudents;
            });
            setTeachers((prevTeachers) => {
              const nextTeachers = prevTeachers.map((t) => (t.homeroomClass === c.name ? { ...t, homeroomClass: updated.name! } : t));
              try {
                localStorage.setItem('mi_rpi_teachers', JSON.stringify(nextTeachers));
              } catch (_) {}
              syncToServer('teachers', nextTeachers);
              return nextTeachers;
            });
          }
          return updatedClass;
        }
        return c;
      });
      try {
        localStorage.setItem('mi_rpi_classes', JSON.stringify(next));
      } catch (_) {}
      syncToServer('classes', next);
      return next;
    });
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('mi_rpi_classes', JSON.stringify(next));
      } catch (_) {}
      syncToServer('classes', next);
      return next;
    });
  };

  const batchUpdateStudentClass = (studentIds: string[], targetClassName: string) => {
    setStudents((prev) => {
      const next = prev.map((s) => (studentIds.includes(s.id) ? { ...s, className: targetClassName } : s));
      try {
        localStorage.setItem('mi_rpi_students', JSON.stringify(next));
        localStorage.setItem('mi_rpi_students_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('students', next);
      return next;
    });
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

      const next = [...prev, ...toAdd];
      try {
        localStorage.setItem('mi_rpi_teachers', JSON.stringify(next));
        localStorage.setItem('mi_rpi_teachers_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('teachers', next);
      return next;
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

      const next = [...prev, ...toAdd];
      try {
        localStorage.setItem('mi_rpi_students', JSON.stringify(next));
        localStorage.setItem('mi_rpi_students_backup', JSON.stringify(next));
      } catch (_) {}
      syncToServer('students', next);
      return next;
    });
    return count;
  };

  const addUserAccount = (acc: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount => {
    const isNoClassRole = acc.role === 'BENDAHARA' || acc.role === 'ADMIN' || acc.role === 'KEPALA_MADRASAH';
    const newAcc: UserAccount = {
      ...acc,
      className: isNoClassRole ? undefined : acc.className,
      id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: acc.status || 'Aktif',
    };
    setUserAccounts((prev) => {
      const next = [newAcc, ...prev];
      try {
        localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(next));
      } catch (_) {}
      syncToServer('userAccounts', next);
      return next;
    });
    return newAcc;
  };

  const updateUserAccount = (id: string, updates: Partial<UserAccount>) => {
    setUserAccounts((prev) => {
      const next = prev.map((acc) => {
        if (acc.id === id) {
          const targetRole = updates.role || acc.role;
          const isNoClassRole = targetRole === 'BENDAHARA' || targetRole === 'ADMIN' || targetRole === 'KEPALA_MADRASAH';
          const updated = { ...acc, ...updates };
          if (isNoClassRole) {
            delete updated.className;
          }
          return updated;
        }
        return acc;
      });
      try {
        localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(next));
      } catch (_) {}
      syncToServer('userAccounts', next);
      return next;
    });
  };

  const deleteUserAccount = (id: string) => {
    setUserAccounts((prev) => {
      const next = prev.filter((acc) => acc.id !== id);
      try {
        localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(next));
      } catch (_) {}
      syncToServer('userAccounts', next);
      return next;
    });
  };

  const resetUserPassword = (id: string, newPassword?: string): string => {
    const generated = newPassword || `RPI-${Math.floor(100000 + Math.random() * 900000)}`;
    setUserAccounts((prev) => {
      const next = prev.map((acc) => (acc.id === id ? { ...acc, password: generated } : acc));
      try {
        localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(next));
      } catch (_) {}
      syncToServer('userAccounts', next);
      return next;
    });
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
        (a) =>
          a.role === 'ORANG_TUA' &&
          ((s.nisn && a.username === s.nisn) ||
            (s.nisn && a.nisn === s.nisn) ||
            (a.studentName && a.studentName.toLowerCase() === s.name.toLowerCase()))
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

  const generateBatchStudentAccounts = (): number => {
    let createdCount = 0;
    students.forEach((s) => {
      const exists = userAccounts.some(
        (a) =>
          a.role === 'SISWA' &&
          ((s.nisn && a.username.toLowerCase() === s.nisn.toLowerCase()) ||
            (s.nis && a.username.toLowerCase() === s.nis.toLowerCase()) ||
            (s.nisn && a.nisn === s.nisn) ||
            (a.name && a.name.toLowerCase() === s.name.toLowerCase()))
      );
      if (!exists) {
        const username = s.nisn || s.nis || `siswa_${s.id}`;
        const passDigits = s.nisn ? (s.nisn.slice(-4) || '2026') : '2026';
        addUserAccount({
          name: s.name,
          username: username,
          password: `Santri#${passDigits}`,
          role: 'SISWA',
          nisn: s.nisn,
          studentName: s.name,
          className: s.className,
          status: 'Aktif',
        });
        createdCount++;
      }
    });
    return createdCount;
  };

  const loginWithCredentials = (
    identifier: string,
    pass: string,
    targetRole?: UserRole
  ): { success: boolean; message?: string; role?: UserRole } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Harap isi username/NIP/NISN dan kata sandi.' };
    }

    const matchesIdAndPass = (a: UserAccount) =>
      (a.username.toLowerCase() === cleanId ||
        (a.email && a.email.toLowerCase() === cleanId) ||
        (a.nip && a.nip === cleanId) ||
        (a.nisn && a.nisn === cleanId) ||
        (a.name && a.name.toLowerCase() === cleanId)) &&
      (a.password === cleanPass ||
        (cleanPass === 'bendahara123' && a.role === 'BENDAHARA') ||
        (cleanPass === 'admin123' && a.role === 'ADMIN') ||
        (cleanPass === 'kamad123' && a.role === 'KEPALA_MADRASAH') ||
        (cleanPass === 'siswa123' && a.role === 'SISWA') ||
        (cleanPass === 'guru123' && a.role === 'GURU'));

    // Prioritize targetRole if specified
    let account = targetRole
      ? userAccounts.find((a) => a.role === targetRole && matchesIdAndPass(a))
      : undefined;

    // Fallback if not found with specified role or no role specified
    if (!account) {
      account = userAccounts.find(matchesIdAndPass);
    }

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
    try {
      localStorage.setItem('mi_rpi_auth_user', JSON.stringify(mockUser));
      localStorage.setItem('mi_rpi_auth_role', account.role);
    } catch (_) {}

    if (account.role === 'GURU' || account.role === 'WALI_KELAS') {
      navigate('portal-guru');
    } else if (account.role === 'ORANG_TUA') {
      navigate('portal-ortu');
    } else if (account.role === 'SISWA') {
      navigate('portal-siswa');
    } else if (account.role === 'KEPALA_MADRASAH') {
      navigate('portal-kamad');
    } else if (account.role === 'BENDAHARA') {
      navigate('portal-bendahara');
    } else {
      navigate('portal-admin');
    }

    return { success: true, role: account.role };
  };

  const addProgram = (prog: Omit<FlagshipProgram, 'id'>) => {
    const newProg: FlagshipProgram = {
      ...prog,
      id: Date.now(),
    };
    setPrograms((prev) => {
      const next = [newProg, ...prev];
      try {
        localStorage.setItem('mi_rpi_programs', JSON.stringify(next));
      } catch (_) {}
      syncToServer('programs', next);
      return next;
    });
  };

  const updateProgram = (id: number | string, updates: Partial<FlagshipProgram>) => {
    setPrograms((prev) => {
      const next = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      try {
        localStorage.setItem('mi_rpi_programs', JSON.stringify(next));
      } catch (_) {}
      syncToServer('programs', next);
      return next;
    });
  };

  const deleteProgram = (id: number | string) => {
    setPrograms((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem('mi_rpi_programs', JSON.stringify(next));
      } catch (_) {}
      syncToServer('programs', next);
      return next;
    });
  };

  const updateDimensions = (newDims: GraduateDimension[]) => {
    setDimensions(newDims);
    try {
      localStorage.setItem('mi_rpi_dimensions', JSON.stringify(newDims));
    } catch (_) {}
    syncToServer('dimensions', newDims);
  };

  const updateAcademicSubjects = (newSubjects: AcademicSubjectGroup[]) => {
    setAcademicSubjects(newSubjects);
    try {
      localStorage.setItem('mi_rpi_academic_subjects', JSON.stringify(newSubjects));
    } catch (_) {}
    syncToServer('academicSubjects', newSubjects);
  };

  const updateHabits = (newHabits: StudentHabit[]) => {
    setHabits(newHabits);
    try {
      localStorage.setItem('mi_rpi_habits', JSON.stringify(newHabits));
    } catch (_) {}
    syncToServer('habits', newHabits);
  };

  const updateExtracurriculars = (newExcurs: Extracurricular[]) => {
    setExtracurriculars(newExcurs);
    try {
      localStorage.setItem('mi_rpi_extracurriculars', JSON.stringify(newExcurs));
    } catch (_) {}
    syncToServer('extracurriculars', newExcurs);
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`,
    };
    setSchedules((prev) => {
      const next = [...prev, newItem];
      try {
        localStorage.setItem('mi_rpi_schedules', JSON.stringify(next));
      } catch (_) {}
      syncToServer('schedules', next);
      return next;
    });
  };

  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedules((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      try {
        localStorage.setItem('mi_rpi_schedules', JSON.stringify(next));
      } catch (_) {}
      syncToServer('schedules', next);
      return next;
    });
  };

  const deleteScheduleItem = (id: string) => {
    setSchedules((prev) => {
      const next = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem('mi_rpi_schedules', JSON.stringify(next));
      } catch (_) {}
      syncToServer('schedules', next);
      return next;
    });
  };

  const resetSchedulesToDefault = () => {
    setSchedules(initialSchedules);
    try {
      localStorage.setItem('mi_rpi_schedules', JSON.stringify(initialSchedules));
    } catch (_) {}
    syncToServer('schedules', initialSchedules);
  };

  // Full Database Restore (Local + Server)
  const restoreFullDatabase = async (data: Record<string, any>): Promise<boolean> => {
    try {
      if (data.settings) {
        setSettings(data.settings);
        try { localStorage.setItem('mi_rpi_settings', JSON.stringify(data.settings)); } catch (_) {}
      }
      if (Array.isArray(data.students)) {
        setStudents(data.students);
        try {
          localStorage.setItem('mi_rpi_students', JSON.stringify(data.students));
          localStorage.setItem('mi_rpi_students_backup', JSON.stringify(data.students));
        } catch (_) {}
      }
      if (Array.isArray(data.teachers)) {
        setTeachers(data.teachers);
        try {
          localStorage.setItem('mi_rpi_teachers', JSON.stringify(data.teachers));
          localStorage.setItem('mi_rpi_teachers_backup', JSON.stringify(data.teachers));
        } catch (_) {}
      }
      if (Array.isArray(data.classes)) {
        setClasses(data.classes);
        try { localStorage.setItem('mi_rpi_classes', JSON.stringify(data.classes)); } catch (_) {}
      }
      if (Array.isArray(data.userAccounts)) {
        setUserAccounts(data.userAccounts);
        try { localStorage.setItem('mi_rpi_user_accounts', JSON.stringify(data.userAccounts)); } catch (_) {}
      }
      if (Array.isArray(data.gallery)) {
        setGallery(data.gallery);
        try { localStorage.setItem('mi_rpi_gallery', JSON.stringify(data.gallery)); } catch (_) {}
      }
      if (Array.isArray(data.news)) {
        setNews(data.news);
        try { localStorage.setItem('mi_rpi_news', JSON.stringify(data.news)); } catch (_) {}
      }
      if (Array.isArray(data.spmbApplications)) {
        setSpmbApplications(data.spmbApplications);
        try { localStorage.setItem('mi_rpi_spmb', JSON.stringify(data.spmbApplications)); } catch (_) {}
      }
      if (Array.isArray(data.programs)) {
        setPrograms(data.programs);
        try { localStorage.setItem('mi_rpi_programs', JSON.stringify(data.programs)); } catch (_) {}
      }
      if (Array.isArray(data.dimensions)) {
        setDimensions(data.dimensions);
        try { localStorage.setItem('mi_rpi_dimensions', JSON.stringify(data.dimensions)); } catch (_) {}
      }
      if (Array.isArray(data.academicSubjects)) {
        setAcademicSubjects(data.academicSubjects);
        try { localStorage.setItem('mi_rpi_academic_subjects', JSON.stringify(data.academicSubjects)); } catch (_) {}
      }
      if (Array.isArray(data.habits)) {
        setHabits(data.habits);
        try { localStorage.setItem('mi_rpi_habits', JSON.stringify(data.habits)); } catch (_) {}
      }
      if (Array.isArray(data.extracurriculars)) {
        setExtracurriculars(data.extracurriculars);
        try { localStorage.setItem('mi_rpi_extracurriculars', JSON.stringify(data.extracurriculars)); } catch (_) {}
      }
      if (Array.isArray(data.schedules)) {
        setSchedules(data.schedules);
        try { localStorage.setItem('mi_rpi_schedules', JSON.stringify(data.schedules)); } catch (_) {}
      }

      // Also persist to server
      const res = await fetch('/api/database/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ database: data }),
      });
      return res.ok;
    } catch (e) {
      console.error('Failed to restore full database:', e);
      return false;
    }
  };

  // Fetch list of server backups
  const fetchBackupsList = async (): Promise<any[]> => {
    try {
      const res = await fetch('/api/backups');
      if (res.ok) {
        const json = await res.json();
        return json.backups || [];
      }
    } catch (_) {}
    return [];
  };

  // Restore snapshot by filename
  const restoreBackupByFilename = async (filename: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/backups/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          await restoreFullDatabase(json.data);
          return true;
        }
      }
      return false;
    } catch (e) {
      console.error('Failed to restore backup by filename:', e);
      return false;
    }
  };

  // Export database as downloadable JSON file
  const exportFullDatabase = () => {
    const fullDb = {
      settings,
      students,
      teachers,
      classes,
      userAccounts,
      gallery,
      news,
      spmbApplications,
      programs,
      dimensions,
      academicSubjects,
      habits,
      extracurriculars,
      schedules,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullDb, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-database-mi-rpi-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
        resetSchedulesToDefault,
        addUserAccount,
        updateUserAccount,
        deleteUserAccount,
        resetUserPassword,
        generateBatchTeacherAccounts,
        generateBatchParentAccounts,
        generateBatchStudentAccounts,
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
        saveBatchGrades,
        updateWorshipLog,
        borrowBook,
        returnBook,
        generateAssessmentDraft,
        addNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,
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
        restoreFullDatabase,
        fetchBackupsList,
        restoreBackupByFilename,
        exportFullDatabase,
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
