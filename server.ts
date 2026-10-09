import express, { type Request, type Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded media statically
const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Route to directly download the cPanel deployment package
app.get('/cpanel-app.zip', (req: Request, res: Response) => {
  const zipPath = path.resolve(__dirname, 'public', 'cpanel-app.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="cpanel-app.zip"');
    return res.sendFile(zipPath);
  }
  return res.status(404).send('File not found');
});

// Persistent database storage on server disk
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbFilePath = path.join(dataDir, 'school_database.json');
const backupsDir = path.join(dataDir, 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Helper to convert base64 dataUrl into static file on server
function extractBase64AndSave(val: string, prefix = 'media'): string {
  if (!val || typeof val !== 'string' || !val.startsWith('data:image/')) {
    return val;
  }
  try {
    const match = val.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!match) return val;
    const mimeType = match[1].toLowerCase();
    const extension = mimeType === 'svg+xml' ? 'svg' : mimeType === 'png' ? 'png' : mimeType === 'webp' ? 'webp' : 'jpg';
    const base64Data = match[2];
    const safeFileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;
    const targetFilePath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(targetFilePath, Buffer.from(base64Data, 'base64'));
    console.log(`[Auto-Extracted Media] Saved base64 to /uploads/${safeFileName}`);
    return `/uploads/${safeFileName}`;
  } catch (e) {
    console.error('Failed to extract base64 to file:', e);
    return val;
  }
}

// Deep sanitize object: converts any base64 images into physical files
function sanitizeObjectImages(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObjectImages(item));
  }
  const result: any = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string' && result[key].startsWith('data:image/')) {
      result[key] = extractBase64AndSave(result[key], key.replace(/[^a-zA-Z0-9]/g, ''));
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = sanitizeObjectImages(result[key]);
    }
  }
  return result;
}

const defaultDbFilePath = path.join(dataDir, 'default_database.json');

function readDatabase(): Record<string, any> {
  let defaultDb: Record<string, any> = {};
  try {
    if (fs.existsSync(defaultDbFilePath)) {
      defaultDb = JSON.parse(fs.readFileSync(defaultDbFilePath, 'utf-8'));
    }
  } catch (_) {}

  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf-8');
      const userDb = JSON.parse(content);
      return { ...defaultDb, ...userDb };
    }
  } catch (e) {
    console.error('Error reading school_database.json:', e);
  }
  return defaultDb;
}

// Single in-memory cache to guarantee atomic concurrent updates without race conditions
let databaseCache: Record<string, any> = readDatabase();

function saveDatabase(newData: Record<string, any>): Record<string, any> {
  try {
    databaseCache = {
      ...databaseCache,
      ...newData,
      lastUpdated: new Date().toISOString(),
    };

    // Write to primary database file
    fs.writeFileSync(dbFilePath, JSON.stringify(databaseCache, null, 2), 'utf-8');

    // Create automatic daily/hourly backup snapshot
    try {
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const snapPath = path.join(backupsDir, `snapshot-${dateStr}.json`);
      fs.writeFileSync(snapPath, JSON.stringify(databaseCache, null, 2), 'utf-8');

      // Keep latest snapshot
      const latestPath = path.join(backupsDir, 'latest-backup.json');
      fs.writeFileSync(latestPath, JSON.stringify(databaseCache, null, 2), 'utf-8');

      // Prune old snapshots if more than 30
      const existingBackups = fs.readdirSync(backupsDir).filter((f) => f.startsWith('snapshot-'));
      if (existingBackups.length > 30) {
        existingBackups.sort();
        while (existingBackups.length > 30) {
          const toDelete = existingBackups.shift();
          if (toDelete) {
            try {
              fs.unlinkSync(path.join(backupsDir, toDelete));
            } catch (_) {}
          }
        }
      }
    } catch (_) {}

    return databaseCache;
  } catch (e) {
    console.error('Error writing school_database.json:', e);
    return databaseCache;
  }
}

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System knowledge base for RPI Smart Assistant
const RPI_SYSTEM_INSTRUCTION = `
Anda adalah "RPI Smart Assistant", asisten kecerdasan buatan resmi untuk Madrasah Ibtidaiyah RPI Jakarta (MI RPI Jakarta / MIS RPI Jakarta).
Motto madrasah: "Madrasah Unggul, Berakhlak Mulia, Cakap di Era Digital".
Nilai utama: Akhlak Mulia, Keislaman, Literasi, Sains, Teknologi Digital, Kemandirian.

Identitas Resmi MI RPI Jakarta:
- NPSN: 60706249
- Kode Madrasah: 111231740119
- Status: Swasta
- Bentuk Pendidikan: Madrasah Ibtidaiyah (MI)
- Naungan: Kementerian Agama (Kemenag)
- Yayasan: Yayasan Rumah Pendidikan Islam
- Akreditasi: A (Unggul)
- Alamat: Jl. HR. Rasuna Said Kav. X2-2, RT 008 / RW 04, Kuningan Timur, Setiabudi, Jakarta Selatan, DKI Jakarta 12950. Lokasi strategis di pusat Kuningan, Jakarta Selatan.
- Koordinat Lokasi: Latitude -6.2337, Longitude 106.8296.

Program Unggulan (15 Program):
1. Madrasah Ramah Anak
2. Social Emotional Learning (SEL)
3. Pramuka Wajib
4. Tahsin & Tahfiz Al-Qur'an (Target Juz 30 & Juz 29)
5. Gerakan Literasi Madrasah
6. Sains dan Teknologi Cilik (STEM)
7. Pembelajaran Digital & Coding
8. Kegiatan Seni Islami & Kaligrafi
9. Panahan (Archery Sunnah Sport)
10. Pencak Silat
11. Tari Saman
12. Hadrah & Marawis
13. Pembiasaan Ibadah (Shalat Dhuha, Dhuhur Berjamaah, Tadarus)
14. Kegiatan Sosial (Jumat Bersih & Amal)
15. Kokurikuler Berbasis Proyek (P5-PPRA)

SPMB (Sistem Penerimaan Murid Baru) 2027/2028:
- Pendaftaran dibuka secara online melalui website menu SPMB.
- Kuota terbatas demi rasio murid-guru yang ideal dan lingkungan ramah anak.
- Syarat: Usia minimal 6 tahun pada 1 Juli tahun berjalan, Akta Kelahiran, Kartu Keluarga, Ijazah/Surat Keterangan TK/RA.

Aturan Penting AI:
1. Awali dengan salam hangat dan islami (contoh: "Assalamu'alaikum Warahmatullahi Wabarakatuh...").
2. Gunakan bahasa Indonesia yang santun, hangat, profesional, dan ramah anak/orang tua.
3. JANGAN MENGARANG DATA. Jika data belum tersedia (seperti nomor telepon pribadi guru atau data belum diisi admin), katakan secara jujur:
   "Saya belum menemukan informasi resmi tersebut. Silakan hubungi tim administrasi madrasah melalui menu Kontak atau WhatsApp resmi MI RPI Jakarta."
4. Jangan pernah menampilkan data pribadi siswa (NIK, alamat rumah, nomor HP ortu, nilai privat) kepada publik.
`;

// API Endpoint for RPI Smart Assistant (with Thinking Mode on gemini-3.1-pro-preview)
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Graceful informative fallback if API key is not configured yet
      return res.json({
        reply: `Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di MI RPI Jakarta! 
MI RPI Jakarta adalah Madrasah Ibtidaiyah berakreditasi A di Jl. HR. Rasuna Said Kav. X2-2, Kuningan Timur, Setiabudi, Jakarta Selatan (NPSN: 60706249). 
Saat ini pendaftaran SPMB Tahun Ajaran 2027/2028 telah dibuka dengan kuota terbatas. Untuk pertanyaan lebih lanjut mengenai pendaftaran, akademik, atau biaya, silakan kunjungi menu SPMB atau hubungi admin via tombol WhatsApp di pojok kanan bawah.`,
        modelUsed: 'local-knowledge-base',
      });
    }

    // Call gemini-3.1-pro-preview with ThinkingLevel.HIGH as mandated
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        ...(Array.isArray(history)
          ? history.map((h: { role: string; content: string }) => ({
              role: h.role === 'user' ? 'user' : 'model',
              parts: [{ text: h.content }],
            }))
          : []),
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction: RPI_SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const reply = response.text || 'Maaf, saya tidak dapat merespons saat ini. Silakan hubungi admin MI RPI.';
    return res.json({ reply, modelUsed: 'gemini-3.1-pro-preview' });
  } catch (error: any) {
    console.error('Error in /api/assistant/chat:', error);

    // If quota or auth error, provide smart domain-grounded response
    const fallbackAnswer = getLocalSmartFallback(req.body.message || '');
    return res.json({
      reply: fallbackAnswer,
      modelUsed: 'smart-fallback',
      warning: error?.message,
    });
  }
});

// Domain-grounded fallback responses
function getLocalSmartFallback(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('spmb') || q.includes('daftar') || q.includes('ppdb') || q.includes('biaya') || q.includes('syarat')) {
    return "Assalamu'alaikum! Pendaftaran SPMB MI RPI Jakarta Tahun Pelajaran 2027/2028 telah dibuka secara daring di website ini. Syarat utama mencakup Akta Kelahiran, Kartu Keluarga, dan Keterangan Lulus TK/RA. Kuota kelas terbatas untuk menjamin pembelajaran ramah anak. Silakan klik tombol 'Daftar SPMB 2027/2028' di menu atas untuk mengisi formulir langsung.";
  }
  if (q.includes('lokasi') || q.includes('alamat') || q.includes('dimana') || q.includes('kuningan')) {
    return "Assalamu'alaikum! MI RPI Jakarta beralamat di Jl. HR. Rasuna Said Kav. X2-2, RT 008 / RW 04, Kelurahan Kuningan Timur, Kecamatan Setiabudi, Jakarta Selatan, DKI Jakarta 12950 (Samping/Kawasan Rasuna Said). Anda dapat melihat peta interaktif di bagian bawah halaman Kontak.";
  }
  if (q.includes('akreditasi') || q.includes('npsn') || q.includes('status')) {
    return "Assalamu'alaikum! MI RPI Jakarta berstatus Swasta di bawah naungan Kementerian Agama dan Yayasan Rumah Pendidikan Islam. Terakreditasi A (Unggul) dengan NPSN 60706249 dan Kode Madrasah 111231740119.";
  }
  if (q.includes('program') || q.includes('unggulan') || q.includes('ekskul') || q.includes('tahfiz')) {
    return "Assalamu'alaikum! MI RPI Jakarta memiliki 15 Program Unggulan, di antaranya: Madrasah Ramah Anak, Social Emotional Learning (SEL), Tahsin & Tahfiz Qur'an (Juz 30 & 29), Pramuka Wajib, Sains & Robotik Digital, Panahan, Pencak Silat, Tari Saman, Hadrah, serta Pembiasaan Ibadah Harian.";
  }
  return "Assalamu'alaikum Warahmatullahi Wabarakatuh. Terima kasih telah menghubungi MI RPI Jakarta. Untuk informasi lebih mendalam seputar jadwal, kurikulum, dan pendaftaran, Anda dapat mengakses menu Profil, Akademik, atau menghubungi tim admin kami via WhatsApp resmi.";
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    school: 'MI RPI Jakarta',
    npsn: '60706249',
    accreditation: 'A',
    timestamp: new Date().toISOString(),
  });
});

// Image upload and persistence endpoint
app.post('/api/upload', (req: Request, res: Response) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Data gambar tidak valid atau kosong' });
    }

    const uploadsDirectory = path.resolve(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadsDirectory)) {
      fs.mkdirSync(uploadsDirectory, { recursive: true });
    }

    let base64Data = image;
    let extension = 'jpg';

    // Parse data URL scheme
    const match = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1].toLowerCase();
      extension = mimeType === 'svg+xml' ? 'svg' : mimeType === 'png' ? 'png' : mimeType === 'webp' ? 'webp' : 'jpg';
      base64Data = match[2];
    }

    const cleanPrefix = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'media';
    const safeFileName = `${cleanPrefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;
    const targetFilePath = path.join(uploadsDirectory, safeFileName);

    fs.writeFileSync(targetFilePath, Buffer.from(base64Data, 'base64'));

    const publicUrl = `/uploads/${safeFileName}`;
    console.log(`[Media Upload] File saved successfully to ${publicUrl}`);
    return res.json({
      success: true,
      url: publicUrl,
    });
  } catch (err: any) {
    console.error('Error saving uploaded file:', err);
    return res.status(500).json({ error: 'Gagal menyimpan file gambar di server' });
  }
});

// Settings GET & POST endpoints with automatic base64 conversion & server disk persistence
app.get('/api/settings', (req: Request, res: Response) => {
  const db = readDatabase();
  return res.json({
    success: true,
    settings: db.settings || null,
  });
});

app.post('/api/settings', (req: Request, res: Response) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Data settings tidak valid' });
    }

    // Sanitize any base64 images inside settings (e.g. logoUrl, heroImageUrl, principalPhotoUrl)
    const sanitizedSettings = sanitizeObjectImages(settings);
    const updated = saveDatabase({ settings: sanitizedSettings });

    console.log('[Settings Persistence] School settings updated and saved to server disk');
    return res.json({
      success: true,
      settings: updated.settings,
    });
  } catch (err: any) {
    console.error('Error saving settings to server:', err);
    return res.status(500).json({ error: 'Gagal menyimpan pengaturan di server' });
  }
});

// Unified School Data GET & POST endpoints for full-app persistence
app.get('/api/school-data', (req: Request, res: Response) => {
  if (!databaseCache || Object.keys(databaseCache).length === 0) {
    databaseCache = readDatabase();
  }
  return res.json({
    success: true,
    data: databaseCache,
  });
});

app.post('/api/school-data', (req: Request, res: Response) => {
  try {
    const { key, data, payload } = req.body;
    let dataToSave: Record<string, any> = {};

    if (key && data !== undefined) {
      dataToSave[key] = sanitizeObjectImages(data);
    } else if (payload && typeof payload === 'object') {
      dataToSave = sanitizeObjectImages(payload);
    } else if (req.body && typeof req.body === 'object') {
      const sanitized = sanitizeObjectImages(req.body);
      delete sanitized.key;
      delete sanitized.data;
      dataToSave = sanitized;
    }

    const updated = saveDatabase(dataToSave);
    console.log(`[School Data Persistence] Updated keys: ${Object.keys(dataToSave).join(', ')}`);
    return res.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    console.error('Error persisting school data to server:', err);
    return res.status(500).json({ error: 'Gagal menyimpan data ke server' });
  }
});

// List all server-side backups with details
app.get('/api/backups', (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(backupsDir)) {
      return res.json({ success: true, backups: [] });
    }
    const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith('.json'));
    const backups = files.map((file) => {
      const filePath = path.join(backupsDir, file);
      const stat = fs.statSync(filePath);
      let studentCount = 0;
      let teacherCount = 0;
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (Array.isArray(content.students)) studentCount = content.students.length;
        if (Array.isArray(content.teachers)) teacherCount = content.teachers.length;
      } catch (_) {}

      return {
        filename: file,
        sizeBytes: stat.size,
        createdAt: stat.mtime.toISOString(),
        studentCount,
        teacherCount,
        isLatest: file === 'latest-backup.json',
      };
    });

    backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ success: true, backups });
  } catch (err: any) {
    console.error('Error listing backups:', err);
    return res.status(500).json({ error: 'Gagal membaca daftar cadangan' });
  }
});

// Restore database from a backup snapshot or uploaded full database JSON
app.post('/api/backups/restore', (req: Request, res: Response) => {
  try {
    const { filename, snapshotData } = req.body;
    let dataToRestore: Record<string, any> | null = null;

    if (filename) {
      const targetPath = path.join(backupsDir, path.basename(filename));
      if (!fs.existsSync(targetPath)) {
        return res.status(404).json({ error: 'File cadangan tidak ditemukan di server' });
      }
      dataToRestore = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    } else if (snapshotData && typeof snapshotData === 'object') {
      dataToRestore = sanitizeObjectImages(snapshotData);
    }

    if (!dataToRestore || typeof dataToRestore !== 'object') {
      return res.status(400).json({ error: 'Data cadangan tidak valid' });
    }

    // Save current as pre-restore backup first
    try {
      const preRestorePath = path.join(backupsDir, `pre-restore-${Date.now()}.json`);
      fs.writeFileSync(preRestorePath, JSON.stringify(databaseCache, null, 2), 'utf-8');
    } catch (_) {}

    // Overwrite databaseCache and school_database.json
    databaseCache = {
      ...dataToRestore,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(databaseCache, null, 2), 'utf-8');

    console.log(`[Backup Restored] Database successfully restored! Students: ${databaseCache.students?.length || 0}, Teachers: ${databaseCache.teachers?.length || 0}`);
    return res.json({
      success: true,
      message: 'Database berhasil dipulihkan secara penuh!',
      data: databaseCache,
    });
  } catch (err: any) {
    console.error('Error restoring backup:', err);
    return res.status(500).json({ error: 'Gagal memulihkan database dari cadangan' });
  }
});

// Full database export
app.get('/api/database/export', (req: Request, res: Response) => {
  try {
    if (!databaseCache || Object.keys(databaseCache).length === 0) {
      databaseCache = readDatabase();
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="database-mi-rpi-${new Date().toISOString().split('T')[0]}.json"`);
    return res.send(JSON.stringify(databaseCache, null, 2));
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal mengekspor database' });
  }
});

// Full database import
app.post('/api/database/import', (req: Request, res: Response) => {
  try {
    const { database } = req.body;
    if (!database || typeof database !== 'object') {
      return res.status(400).json({ error: 'File data database tidak valid' });
    }

    const sanitized = sanitizeObjectImages(database);
    databaseCache = {
      ...databaseCache,
      ...sanitized,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(databaseCache, null, 2), 'utf-8');

    // Create immediate snapshot
    try {
      const snapPath = path.join(backupsDir, `snapshot-imported-${Date.now()}.json`);
      fs.writeFileSync(snapPath, JSON.stringify(databaseCache, null, 2), 'utf-8');
    } catch (_) {}

    return res.json({
      success: true,
      message: 'Database berhasil diimpor dan disimpan permanen!',
      data: databaseCache,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal mengimpor database' });
  }
});

// Setup Vite middlewares in dev or static serve in prod
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[MI RPI Platform] Server running on http://localhost:${PORT}`);
  });
}

startServer();
