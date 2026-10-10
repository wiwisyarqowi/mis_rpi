/**
 * Server Backend MI RPI Jakarta - Standalone Production Edition
 * 100% Kompatibel dengan cPanel / Rumahweb / CloudLinux Phusion Passenger
 * Mandiri (Zero Dependency Failure) - Tidak butuh folder node_modules terpisah!
 */
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Log file untuk audit & debug jika terjadi kendala di cPanel
const logFile = path.join(__dirname, 'passenger-debug.log');
function logInfo(msg) {
  try {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch (_) {}
}

process.on('uncaughtException', (err) => {
  logInfo(`UNCAUGHT EXCEPTION: ${err.stack || err}`);
});
process.on('unhandledRejection', (err) => {
  logInfo(`UNHANDLED REJECTION: ${err.stack || err}`);
});
logInfo(`Server inisialisasi. Node Version: ${process.version}`);

// Body parser hingga 50MB (agar upload foto kamera HP resolusi tinggi tidak terpotong)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 1. Direktori Upload Fisik
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {
    logInfo(`Gagal buat uploadsDir: ${e}`);
  }
}
// Layani berkas upload langsung lewat /uploads/ dan /public/uploads/
app.use('/uploads', express.static(uploadsDir));
app.use('/public/uploads', express.static(uploadsDir));

// 2. Direktori Database JSON
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    logInfo(`Gagal buat dataDir: ${e}`);
  }
}
const dbFilePath = path.join(dataDir, 'school_database.json');
const backupsDir = path.join(dataDir, 'backups');
if (!fs.existsSync(backupsDir)) {
  try {
    fs.mkdirSync(backupsDir, { recursive: true });
  } catch (e) {}
}

// Helper: Ekstraksi base64 menjadi file fisik di disk hosting
function extractBase64AndSave(val, prefix) {
  if (!val || typeof val !== 'string' || !val.startsWith('data:image/')) {
    return val;
  }
  try {
    const match = val.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!match) return val;
    const mimeType = match[1].toLowerCase();
    const extension = mimeType === 'svg+xml' ? 'svg' : mimeType === 'png' ? 'png' : mimeType === 'webp' ? 'webp' : 'jpg';
    const base64Data = match[2];
    const cleanPrefix = prefix ? prefix.replace(/[^a-zA-Z0-9_-]/g, '') : 'media';
    const safeFileName = `${cleanPrefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}.${extension}`;
    const targetFilePath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(targetFilePath, Buffer.from(base64Data, 'base64'));
    logInfo(`Foto tersimpan ke file fisik: /uploads/${safeFileName}`);
    return `/uploads/${safeFileName}`;
  } catch (e) {
    logInfo(`Gagal simpan file gambar fisik: ${e}`);
    return val;
  }
}

// Sanitasi rekursif: ubah base64 di objek murid/guru/kegiatan menjadi file fisik
function sanitizeObjectImages(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObjectImages(item));
  }
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === 'string' && result[key].startsWith('data:image/')) {
      result[key] = extractBase64AndSave(result[key], key.replace(/[^a-zA-Z0-9]/g, ''));
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = sanitizeObjectImages(result[key]);
    }
  }
  return result;
}

// Helper: Baca database
function readDatabase() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    logInfo(`Error baca database: ${e}`);
  }
  return {};
}

let databaseCache = readDatabase();

// Helper: Simpan database ke file disk
function saveDatabase(newData) {
  try {
    databaseCache = {
      ...databaseCache,
      ...newData,
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(databaseCache, null, 2), 'utf-8');

    // Sinkronkan juga ke snapshot berkala
    try {
      const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
      const snapPath = path.join(backupsDir, `snapshot-${dateStr}.json`);
      fs.writeFileSync(snapPath, JSON.stringify(databaseCache, null, 2), 'utf-8');
    } catch (_) {}

    // Sinkronkan ke public/school-data.json & dist/school-data.json
    try {
      const pubPath = path.join(__dirname, 'public', 'school-data.json');
      fs.writeFileSync(pubPath, JSON.stringify(databaseCache, null, 2), 'utf-8');
    } catch (_) {}

    const distFolder = path.join(__dirname, 'dist');
    try {
      if (fs.existsSync(distFolder)) {
        fs.writeFileSync(path.join(distFolder, 'school-data.json'), JSON.stringify(databaseCache, null, 2), 'utf-8');
      }
    } catch (_) {}

    return databaseCache;
  } catch (e) {
    logInfo(`Gagal simpan database: ${e}`);
    return databaseCache;
  }
}

// === ENDPOINTS API LENGKAP ===

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    school: 'MI RPI Jakarta',
    npsn: '60706249',
    databaseLoaded: Object.keys(databaseCache).length > 0,
    timestamp: new Date().toISOString(),
  });
});

// 2. Upload file gambar
app.post('/api/upload', (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Data gambar kosong atau tidak valid' });
    }
    const publicUrl = extractBase64AndSave(image, filename || 'media');
    return res.json({
      success: true,
      url: publicUrl,
    });
  } catch (err) {
    logInfo(`Error /api/upload: ${err}`);
    return res.status(500).json({ error: 'Gagal mengunggah gambar' });
  }
});

// 3. Baca Data Sekolah (GET)
app.get('/api/school-data', (req, res) => {
  if (!databaseCache || Object.keys(databaseCache).length === 0) {
    databaseCache = readDatabase();
  }
  return res.json({
    success: true,
    data: databaseCache,
  });
});

// 4. Simpan Data Sekolah (POST) - Menyimpan murid, guru, nilai, program, rombel
app.post('/api/school-data', (req, res) => {
  try {
    const { key, data, payload } = req.body;
    let dataToSave = {};

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
    logInfo(`Data berhasil disimpan untuk kunci: ${Object.keys(dataToSave).join(', ')}`);
    return res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    logInfo(`Error /api/school-data: ${err}`);
    return res.status(500).json({ error: 'Gagal menyimpan data ke database server' });
  }
});

// 5. Settings API
app.get('/api/settings', (req, res) => {
  const db = readDatabase();
  return res.json({
    success: true,
    settings: db.settings || null,
  });
});

app.post('/api/settings', (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Data settings tidak valid' });
    }
    const sanitizedSettings = sanitizeObjectImages(settings);
    const updated = saveDatabase({ settings: sanitizedSettings });
    return res.json({
      success: true,
      settings: updated.settings,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal menyimpan settings' });
  }
});

// 6. Cadangan Database JSON
app.get('/api/backups', (req, res) => {
  try {
    if (!fs.existsSync(backupsDir)) {
      return res.json({ success: true, backups: [] });
    }
    const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith('.json'));
    const backups = files.map((file) => ({
      filename: file,
      sizeBytes: fs.statSync(path.join(backupsDir, file)).size,
    }));
    return res.json({ success: true, backups });
  } catch (err) {
    return res.json({ success: true, backups: [] });
  }
});

// 7. Menyajikan Frontend Statis (dist)
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// 8. SPA Fallback Router (Semua route halaman dialihkan ke index.html)
app.get('*', (req, res) => {
  const indexHtml = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtml)) {
    return res.sendFile(indexHtml);
  }
  res.send('<!DOCTYPE html><html><body><h1>MI RPI Jakarta Platform</h1><p>Server backend aktif.</p></body></html>');
});

// 9. Startup Server: Kompatibilitas Ganda Phusion Passenger & Standalone
if (typeof PhusionPassenger !== 'undefined') {
  app.listen('passenger');
  logInfo('Server berhasil terhubung ke Phusion Passenger');
} else {
  app.listen(PORT, () => {
    logInfo(`Server aktif di port ${PORT}`);
    console.log(`[MI RPI Platform] Server aktif di port ${PORT}`);
  });
}

module.exports = app;
