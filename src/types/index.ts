export type UserRole =
  | 'SUPER_ADMIN'
  | 'KEPALA_MADRASAH'
  | 'ADMIN'
  | 'BENDAHARA'
  | 'GURU'
  | 'WALI_KELAS'
  | 'SISWA'
  | 'ORANG_TUA'
  | 'OPERATOR';

export interface SchoolSettings {
  schoolName: string;
  shortName: string;
  tagline: string;
  subheadline: string;
  npsn: string;
  madrasahCode: string;
  status: string;
  foundation: string;
  accreditation: string;
  address: string;
  rtRw: string;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  youtube: string;
  facebook: string;
  vision: string;
  missions: string[];
  goals: string[];
  academicYear: string;
  schoolHours: string;
  principalName: string;
  footerText: string;
  themeColor: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  monthlyTuitionFee: number;
  logoUrl?: string;
  heroImageUrl?: string;
  principalPhotoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  studentId?: string; // For parents or students
  teacherId?: string; // For teachers
  classAssigned?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string; // NIP, NISN, or custom email/username
  password: string; // Initial or current password
  role: UserRole;
  email?: string;
  phone?: string;
  nip?: string;
  nisn?: string;
  studentName?: string; // For parent accounts
  className?: string;
  subject?: string; // For teacher accounts
  createdAt: string;
  lastLogin?: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface Student {
  id: string;
  nis: string;
  nisn: string;
  name: string;
  gender: 'L' | 'P';
  className: string;
  birthPlaceDate: string;
  parentName: string;
  parentPhone: string;
  address: string;
  photoUrl: string;
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  title: string;
  subject: string;
  isHomeroom: boolean;
  homeroomClass?: string;
  education: string;
  photoUrl: string;
  status: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Kelas 1A"
  grade: number; // 1 to 6
  homeroomTeacherId?: string;
  homeroomTeacherName?: string;
  room?: string; // e.g. "Ruang 101, Lt. 1"
  academicYear?: string; // e.g. "2025/2026"
  capacity?: number;
}

export interface ScheduleItem {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  time: string;
  className: string;
  subject: string;
  teacherName: string;
  room: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  className: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa' | 'Terlambat';
  timeRecorded: string;
  note?: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  formatif1: number;
  formatif2: number;
  sumatifLingkupMateri: number;
  pts: number;
  pas: number;
  finalScore: number;
  predicate: 'A' | 'B' | 'C' | 'D';
  competencyAchievement: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacherName: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  submissionsCount: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  score?: number;
  feedback?: string;
  status: 'Terkirim' | 'Dinilai';
}

export interface LearningMaterial {
  id: string;
  title: string;
  subject: string;
  className: string;
  type: 'video' | 'pdf' | 'lkpd' | 'modul';
  description: string;
  fileUrl: string;
  uploadedAt: string;
  progressPercentage: number;
}

export interface Question {
  id: string;
  type: 'pilihan_ganda' | 'benar_salah' | 'menjodohkan' | 'essay';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  className: string;
  durationMinutes: number;
  totalQuestions: number;
  deadline: string;
  questions: Question[];
}

export interface SPMBApplication {
  id: string;
  registrationNumber: string;
  studentName: string;
  birthPlace: string;
  birthDate: string;
  gender: 'L' | 'P';
  nik: string;
  nisn?: string;
  parentName: string;
  parentPhone: string;
  address: string;
  previousSchool: string; // Asal TK / RA
  programChosen: 'Kelas Reguler Unggulan' | 'Kelas Tahfiz & Digital Science';
  registrationDate: string;
  status: 'Menunggu Verifikasi' | 'Lolos Berkas' | 'Jadwal Observasi' | 'Diterima' | 'Tidak Lolos';
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  className: string;
  month: string;
  year: number;
  amount: number;
  status: 'Lunas' | 'Belum Bayar' | 'Menunggu Konfirmasi';
  paymentDate?: string;
  paymentMethod?: string;
  receiptUrl?: string;
}

export interface ComplaintTicket {
  id: string;
  ticketNumber: string;
  senderName: string;
  senderContact: string;
  category: 'Akademik' | 'Kesiswaan' | 'Sarana Prasarana' | 'Pelayanan' | 'Saran' | 'Pengaduan';
  message: string;
  date: string;
  status: 'Diterima' | 'Diproses' | 'Selesai';
  responseNote?: string;
}

export interface CharacterDimension {
  name: 'Disiplin' | 'Tanggung Jawab' | 'Kejujuran' | 'Kerja Sama' | 'Kebersihan' | 'Ibadah' | 'Literasi' | 'Kepedulian' | 'Kemandirian';
  score: number; // 0 - 100
  badge: string;
}

export interface CharacterPointRecord {
  id: string;
  studentId: string;
  studentName: string;
  dimension: 'Disiplin' | 'Tanggung Jawab' | 'Kejujuran' | 'Kerja Sama' | 'Kebersihan' | 'Ibadah' | 'Literasi' | 'Kepedulian' | 'Kemandirian';
  points: number;
  note: string;
  teacherName: string;
  date: string;
}

export interface WorshipLog {
  id: string;
  studentId: string;
  date: string;
  subuh: boolean;
  dzuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
  dhuha: boolean;
  tahajud: boolean;
  tadarusHalaman: number;
  parentApproved: boolean;
  teacherNote?: string;
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: 'Al-Qur\'an & Tafsir' | 'Hadits' | 'Fikih' | 'Akidah Akhlak' | 'Bahasa Indonesia' | 'Matematika' | 'Sains & IPAS' | 'Teknologi & Koding' | 'Cerita Islami Anak' | 'Literasi Karakter';
  availableCopies: number;
  totalCopies: number;
  coverColor: string;
  description: string;
}

export interface BookLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerName: string;
  borrowerRole: 'SISWA' | 'GURU';
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Dipinjam' | 'Dikembalikan' | 'Terlambat';
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: 'Berita Madrasah' | 'Prestasi' | 'Kegiatan Siswa' | 'Kegiatan Keislaman' | 'Akademik' | 'Kokurikuler' | 'Ekstrakurikuler' | 'Pengumuman';
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Olahraga' | 'Seni' | 'Keagamaan' | 'Pramuka' | 'Teknologi';
  rank: string;
  studentName: string;
  className: string;
  competition: string;
  organizer: string;
  year: number;
  verifiedByAdmin: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Belajar' | 'Keagamaan' | 'Field Trip' | 'Pramuka' | 'Olahraga' | 'Seni' | 'Sains' | 'Sosial';
  year: number;
  imageUrl: string;
  caption: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: 'Akademik' | 'Ujian' | 'Libur' | 'Kegiatan Madrasah' | 'Rapat Ortu' | 'Keagamaan' | 'Field Trip' | 'Ekskul';
  description: string;
}

export interface NotificationAlert {
  id: string;
  recipientRole: 'ORANG_TUA' | 'SISWA' | 'GURU' | 'ALL';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'attendance' | 'academic' | 'character' | 'payment' | 'general';
}
