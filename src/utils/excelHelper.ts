import * as XLSX from 'xlsx';
import { Teacher, Student } from '../types';

/**
 * Downloads a ready-to-use Excel template for importing Dewan Guru (GTK)
 */
export const downloadTeacherExcelTemplate = () => {
  const templateData = [
    {
      'Nama Lengkap & Gelar *': 'Ustadzah Siti Aminah, S.Pd',
      'NIP / NUPTK *': '198905202014022003',
      'Jabatan / Tugas': 'Wali Kelas 1A & Guru Al-Qur\'an',
      'Mata Pelajaran': 'Al-Qur\'an Hadits',
      'Wali Kelas (Ya/Tidak)': 'Ya',
      'Kelas Binaan': 'Kelas 1A',
      'Pendidikan Terakhir': 'S1 Pendidikan Agama Islam',
      'Status Kepegawaian': 'Guru Tetap Yayasan',
    },
    {
      'Nama Lengkap & Gelar *': 'Ustadz Muhammad Yusuf, S.Pd.I',
      'NIP / NUPTK *': '199102142016011005',
      'Jabatan / Tugas': 'Guru Bahasa Arab',
      'Mata Pelajaran': 'Bahasa Arab & Tahsin',
      'Wali Kelas (Ya/Tidak)': 'Tidak',
      'Kelas Binaan': '',
      'Pendidikan Terakhir': 'S1 Bahasa Arab',
      'Status Kepegawaian': 'Guru Tetap Yayasan',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  // Auto-width columns
  worksheet['!cols'] = [
    { wch: 30 },
    { wch: 22 },
    { wch: 30 },
    { wch: 25 },
    { wch: 20 },
    { wch: 16 },
    { wch: 28 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Format Guru MI RPI');
  XLSX.writeFile(workbook, 'Template_Import_Guru_MI_RPI.xlsx');
};

/**
 * Downloads a ready-to-use Excel template for importing Siswa / Santri
 */
export const downloadStudentExcelTemplate = () => {
  const templateData = [
    {
      'Nama Lengkap Santri *': 'Muhammad Al Fatih',
      'NIS *': '20260001',
      'NISN *': '0092837190',
      'Jenis Kelamin (L/P) *': 'L',
      'Kelas *': 'Kelas 4A',
      'Tempat, Tanggal Lahir': 'Jakarta, 15 Mei 2014',
      'Nama Orang Tua / Wali *': 'Ibu Fatimah Zahra, S.E.',
      'No. WhatsApp Wali': '081234567890',
      'Alamat Tempat Tinggal': 'Jl. Rasuna Said, Kuningan Timur, Setiabudi, Jakarta Selatan',
    },
    {
      'Nama Lengkap Santri *': 'Aisyah Humaira',
      'NIS *': '20260002',
      'NISN *': '0092837191',
      'Jenis Kelamin (L/P) *': 'P',
      'Kelas *': 'Kelas 4A',
      'Tempat, Tanggal Lahir': 'Jakarta, 22 Agustus 2014',
      'Nama Orang Tua / Wali *': 'Bapak Ir. Hendra Saputra',
      'No. WhatsApp Wali': '081298765432',
      'Alamat Tempat Tinggal': 'Jl. Menteng Atas Selatan, Setiabudi, Jakarta Selatan',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  worksheet['!cols'] = [
    { wch: 28 },
    { wch: 14 },
    { wch: 16 },
    { wch: 20 },
    { wch: 14 },
    { wch: 25 },
    { wch: 28 },
    { wch: 18 },
    { wch: 45 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Format Santri MI RPI');
  XLSX.writeFile(workbook, 'Template_Import_Santri_MI_RPI.xlsx');
};

/**
 * Exports existing teacher list to Excel (.xlsx)
 */
export const exportTeachersToExcel = (teachers: Teacher[]) => {
  const exportData = teachers.map((t, idx) => ({
    'No': idx + 1,
    'Nama Lengkap': t.name,
    'NIP / NUPTK': t.nip,
    'Jabatan': t.title,
    'Mata Pelajaran': t.subject,
    'Wali Kelas': t.isHomeroom ? 'Ya' : 'Tidak',
    'Kelas Binaan': t.homeroomClass || '-',
    'Pendidikan': t.education,
    'Status': t.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Guru MI RPI');
  XLSX.writeFile(workbook, `Data_Guru_MI_RPI_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Exports existing student list to Excel (.xlsx)
 */
export const exportStudentsToExcel = (students: Student[]) => {
  const exportData = students.map((s, idx) => ({
    'No': idx + 1,
    'Nama Santri': s.name,
    'NIS': s.nis,
    'NISN': s.nisn,
    'L/P': s.gender,
    'Kelas': s.className,
    'TTL': s.birthPlaceDate,
    'Orang Tua / Wali': s.parentName,
    'No. WhatsApp': s.parentPhone,
    'Alamat': s.address,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Santri MI RPI');
  XLSX.writeFile(workbook, `Data_Santri_MI_RPI_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Parses uploaded Excel / CSV file for Teachers
 */
export const parseTeacherExcel = async (file: File): Promise<Omit<Teacher, 'id'>[]> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

  if (!rawRows || rawRows.length === 0) {
    throw new Error('File Excel kosong atau tidak terbaca.');
  }

  const defaultPhoto = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80';

  const teachers: Omit<Teacher, 'id'>[] = rawRows
    .map((row) => {
      // Look up common key variants
      const name = row['Nama Lengkap & Gelar *'] || row['Nama Lengkap'] || row['Nama'] || row['nama'] || '';
      const nip = String(row['NIP / NUPTK *'] || row['NIP'] || row['nip'] || row['NUPTK'] || '').trim();
      const title = row['Jabatan / Tugas'] || row['Jabatan'] || row['jabatan'] || 'Guru';
      const subject = row['Mata Pelajaran'] || row['Mapel'] || row['mapel'] || 'Umum';
      const isHomeroomRaw = String(row['Wali Kelas (Ya/Tidak)'] || row['Wali Kelas'] || '').toLowerCase();
      const isHomeroom = isHomeroomRaw.includes('ya') || isHomeroomRaw.includes('true') || isHomeroomRaw.includes('1');
      const homeroomClass = row['Kelas Binaan'] || row['Kelas'] || undefined;
      const education = row['Pendidikan Terakhir'] || row['Pendidikan'] || 'S1 Pendidikan';
      const status = row['Status Kepegawaian'] || row['Status'] || 'Guru Tetap Yayasan';

      return {
        name: String(name).trim(),
        nip,
        title: String(title).trim(),
        subject: String(subject).trim(),
        isHomeroom,
        homeroomClass: isHomeroom && homeroomClass ? String(homeroomClass).trim() : undefined,
        education: String(education).trim(),
        status: String(status).trim(),
        photoUrl: defaultPhoto,
      };
    })
    .filter((t) => t.name.length > 0 && t.nip.length > 0);

  return teachers;
};

/**
 * Parses uploaded Excel / CSV file for Students
 */
export const parseStudentExcel = async (file: File): Promise<Omit<Student, 'id'>[]> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet);

  if (!rawRows || rawRows.length === 0) {
    throw new Error('File Excel kosong atau tidak terbaca.');
  }

  const defaultPhoto = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80';

  const students: Omit<Student, 'id'>[] = rawRows
    .map((row) => {
      const name = row['Nama Lengkap Santri *'] || row['Nama Lengkap'] || row['Nama Santri'] || row['Nama'] || '';
      const nis = String(row['NIS *'] || row['NIS'] || row['nis'] || `2026${Math.floor(1000 + Math.random() * 9000)}`).trim();
      const nisn = String(row['NISN *'] || row['NISN'] || row['nisn'] || '').trim();
      const rawGender = String(row['Jenis Kelamin (L/P) *'] || row['Jenis Kelamin'] || row['L/P'] || 'L').trim().toUpperCase();
      const gender: 'L' | 'P' = rawGender.startsWith('P') ? 'P' : 'L';
      const className = row['Kelas *'] || row['Kelas'] || row['kelas'] || 'Kelas 1A';
      const birthPlaceDate = row['Tempat, Tanggal Lahir'] || row['TTL'] || 'Jakarta, 1 Januari 2015';
      const parentName = row['Nama Orang Tua / Wali *'] || row['Nama Orang Tua'] || row['Nama Wali'] || row['Orang Tua'] || 'Wali Santri';
      const parentPhone = String(row['No. WhatsApp Wali'] || row['No WhatsApp'] || row['No HP'] || row['WA'] || '0812').trim();
      const address = row['Alamat Tempat Tinggal'] || row['Alamat'] || 'Jakarta Selatan';

      return {
        name: String(name).trim(),
        nis,
        nisn,
        gender,
        className: String(className).trim(),
        birthPlaceDate: String(birthPlaceDate).trim(),
        parentName: String(parentName).trim(),
        parentPhone,
        address: String(address).trim(),
        photoUrl: defaultPhoto,
      };
    })
    .filter((s) => s.name.length > 0 && s.nisn.length > 0);

  return students;
};
