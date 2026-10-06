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
 * Memisahkan kolom 'Tempat Lahir' dan 'Tanggal Lahir' tersendiri (tidak digabung) sesuai standar EMIS / RDM
 */
export const downloadStudentExcelTemplate = () => {
  const templateData = [
    {
      'Nama Lengkap Santri *': 'Muhammad Al Fatih',
      'NIS *': '20260001',
      'NISN *': '0092837190',
      'Jenis Kelamin (L/P) *': 'L',
      'Kelas *': 'Kelas 4A',
      'Tempat Lahir *': 'Jakarta',
      'Tanggal Lahir (DD/MM/YYYY) *': '15/05/2014',
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
      'Tempat Lahir *': 'Jakarta',
      'Tanggal Lahir (DD/MM/YYYY) *': '22/08/2014',
      'Nama Orang Tua / Wali *': 'Bapak Ir. Hendra Saputra',
      'No. WhatsApp Wali': '081298765432',
      'Alamat Tempat Tinggal': 'Jl. Menteng Atas Selatan, Setiabudi, Jakarta Selatan',
    },
    {
      'Nama Lengkap Santri *': 'Bilal Habasyi',
      'NIS *': '20260003',
      'NISN *': '0092837192',
      'Jenis Kelamin (L/P) *': 'L',
      'Kelas *': 'Kelas 4A',
      'Tempat Lahir *': 'Bandung',
      'Tanggal Lahir (DD/MM/YYYY) *': '10/01/2015',
      'Nama Orang Tua / Wali *': 'Ibu Maryam',
      'No. WhatsApp Wali': '081234567891',
      'Alamat Tempat Tinggal': 'Menteng Atas, Setiabudi, Jakarta Selatan',
    },
    {
      'Nama Lengkap Santri *': 'Khadijah Putri Pratama',
      'NIS *': '20260004',
      'NISN *': '0092837193',
      'Jenis Kelamin (L/P) *': 'P',
      'Kelas *': 'Kelas 4A',
      'Tempat Lahir *': 'Bogor',
      'Tanggal Lahir (DD/MM/YYYY) *': '30/09/2014',
      'Nama Orang Tua / Wali *': 'Bapak Rahmat Hidayat',
      'No. WhatsApp Wali': '081512345678',
      'Alamat Tempat Tinggal': 'Pasar Manggis, Setiabudi, Jakarta Selatan',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(templateData);
  worksheet['!cols'] = [
    { wch: 28 }, // Nama Lengkap
    { wch: 14 }, // NIS
    { wch: 16 }, // NISN
    { wch: 20 }, // Jenis Kelamin
    { wch: 14 }, // Kelas
    { wch: 20 }, // Tempat Lahir (Kolom Tersendiri)
    { wch: 28 }, // Tanggal Lahir (Kolom Tersendiri)
    { wch: 28 }, // Orang Tua / Wali
    { wch: 18 }, // No. WA
    { wch: 45 }, // Alamat
  ];

  // Sheet Petunjuk Pengisian
  const instructionsData = [
    {
      'Kolom': 'Nama Lengkap Santri *',
      'Kewajiban': 'Wajib',
      'Format & Keterangan': 'Nama lengkap santri sesuai akta kelahiran atau ijazah TK/RA.',
    },
    {
      'Kolom': 'NIS *',
      'Kewajiban': 'Wajib',
      'Format & Keterangan': 'Nomor Induk Santri lokal madrasah (misal: 20260001).',
    },
    {
      'Kolom': 'NISN *',
      'Kewajiban': 'Wajib',
      'Format & Keterangan': 'Nomor Induk Siswa Nasional (10 digit angka unik kemdikbud/kemenag).',
    },
    {
      'Kolom': 'Jenis Kelamin (L/P) *',
      'Kewajiban': 'Wajib',
      'Format & Keterangan': 'Isi "L" untuk Laki-laki atau "P" untuk Perempuan.',
    },
    {
      'Kolom': 'Kelas *',
      'Kewajiban': 'Wajib',
      'Format & Keterangan': 'Nama rombongan belajar (misal: Kelas 1A, Kelas 1B, Kelas 4A, Kelas 6B).',
    },
    {
      'Kolom': 'Tempat Lahir *',
      'Kewajiban': 'Wajib (Kolom Tersendiri)',
      'Format & Keterangan': 'KOTA/KABUPATEN tempat lahir santri saja (misal: Jakarta, Bandung, Surabaya). JANGAN DIGABUNG dengan tanggal lahir.',
    },
    {
      'Kolom': 'Tanggal Lahir (DD/MM/YYYY) *',
      'Kewajiban': 'Wajib (Kolom Tersendiri)',
      'Format & Keterangan': 'TANGGAL LAHIR santri (misal: 15/05/2014 atau format tanggal Excel). Kolom tersendiri.',
    },
    {
      'Kolom': 'Nama Orang Tua / Wali *',
      'Kewajiban': 'Wajib',
      'Format & Keterangan': 'Nama orang tua/wali santri (misal: Ibu Fatimah Zahra, S.E.).',
    },
    {
      'Kolom': 'No. WhatsApp Wali',
      'Kewajiban': 'Opsional',
      'Format & Keterangan': 'Nomor WhatsApp aktif orang tua/wali untuk notifikasi akademik & keuangan.',
    },
    {
      'Kolom': 'Alamat Tempat Tinggal',
      'Kewajiban': 'Opsional',
      'Format & Keterangan': 'Alamat domisili tempat tinggal santri saat ini.',
    },
  ];

  const instructionSheet = XLSX.utils.json_to_sheet(instructionsData);
  instructionSheet['!cols'] = [
    { wch: 30 },
    { wch: 25 },
    { wch: 75 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Format Santri MI RPI');
  XLSX.utils.book_append_sheet(workbook, instructionSheet, 'Petunjuk Pengisian');
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
 * Memisahkan kolom Tempat Lahir dan Tanggal Lahir tersendiri (tidak digabung)
 */
export const exportStudentsToExcel = (students: Student[]) => {
  const exportData = students.map((s, idx) => {
    let place = s.birthPlace || '';
    let date = s.birthDate || '';
    if (!place && s.birthPlaceDate && s.birthPlaceDate.includes(',')) {
      const parts = s.birthPlaceDate.split(',');
      place = parts[0].trim();
      date = parts.slice(1).join(',').trim();
    } else if (!place) {
      place = s.birthPlaceDate || '-';
    }

    return {
      'No': idx + 1,
      'Nama Santri': s.name,
      'NIS': s.nis,
      'NISN': s.nisn,
      'L/P': s.gender,
      'Kelas': s.className,
      'Tempat Lahir': place,
      'Tanggal Lahir': date,
      'Orang Tua / Wali': s.parentName,
      'No. WhatsApp': s.parentPhone,
      'Alamat': s.address,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 26 },
    { wch: 14 },
    { wch: 16 },
    { wch: 8 },
    { wch: 12 },
    { wch: 20 }, // Tempat Lahir
    { wch: 20 }, // Tanggal Lahir
    { wch: 26 },
    { wch: 16 },
    { wch: 35 },
  ];
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
 * Formats Excel date values (Date object, serial number, or string) into DD/MM/YYYY
 */
const formatExcelDate = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return '';
    const d = String(val.getDate()).padStart(2, '0');
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const y = val.getFullYear();
    return `${d}/${m}/${y}`;
  }
  if (typeof val === 'number') {
    // Excel serial date number
    if (val > 1000) {
      const utcDays = Math.floor(val - 25569);
      const utcValue = utcDays * 86400;
      const dateInfo = new Date(utcValue * 1000);
      if (!isNaN(dateInfo.getTime())) {
        const d = String(dateInfo.getUTCDate()).padStart(2, '0');
        const m = String(dateInfo.getUTCMonth() + 1).padStart(2, '0');
        const y = dateInfo.getUTCFullYear();
        return `${d}/${m}/${y}`;
      }
    }
    return String(val);
  }
  const str = String(val).trim();
  return str;
};

/**
 * Parses uploaded Excel / CSV file for Students
 * Mendukung kolom Tempat Lahir dan Tanggal Lahir tersendiri (tidak digabung)
 */
export const parseStudentExcel = async (file: File): Promise<Omit<Student, 'id'>[]> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
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

      // 1. Kolom Tempat Lahir Tersendiri
      let birthPlace = String(
        row['Tempat Lahir *'] ??
        row['Tempat Lahir'] ??
        row['tempat lahir'] ??
        row['Kota Lahir'] ??
        row['Tempat'] ??
        ''
      ).trim();

      // 2. Kolom Tanggal Lahir Tersendiri
      const rawBirthDate =
        row['Tanggal Lahir (DD/MM/YYYY) *'] ??
        row['Tanggal Lahir *'] ??
        row['Tanggal Lahir'] ??
        row['tanggal lahir'] ??
        row['Tgl Lahir *'] ??
        row['Tgl Lahir'] ??
        row['Tgl'] ??
        '';
      let birthDate = formatExcelDate(rawBirthDate);

      // Handle legacy fallback if old combined 'Tempat, Tanggal Lahir' / 'TTL' was used
      let birthPlaceDate = '';
      if (birthPlace && birthDate) {
        birthPlaceDate = `${birthPlace}, ${birthDate}`;
      } else if (row['Tempat, Tanggal Lahir'] || row['TTL']) {
        const legacy = String(row['Tempat, Tanggal Lahir'] || row['TTL']).trim();
        birthPlaceDate = legacy;
        if (!birthPlace && legacy.includes(',')) {
          const parts = legacy.split(',');
          birthPlace = parts[0].trim();
          birthDate = parts.slice(1).join(',').trim();
        } else if (!birthPlace) {
          birthPlace = legacy;
        }
      } else {
        birthPlace = birthPlace || 'Jakarta';
        birthDate = birthDate || '15/05/2014';
        birthPlaceDate = `${birthPlace}, ${birthDate}`;
      }

      const parentName = row['Nama Orang Tua / Wali *'] || row['Nama Orang Tua'] || row['Nama Wali'] || row['Orang Tua'] || 'Wali Santri';
      const parentPhone = String(row['No. WhatsApp Wali'] || row['No WhatsApp'] || row['No HP'] || row['WA'] || '0812').trim();
      const address = row['Alamat Tempat Tinggal'] || row['Alamat'] || 'Jakarta Selatan';

      return {
        name: String(name).trim(),
        nis,
        nisn,
        gender,
        className: String(className).trim(),
        birthPlace,
        birthDate,
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
