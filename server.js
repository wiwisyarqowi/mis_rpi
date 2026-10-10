// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT || 3e3;
var isProduction = process.env.NODE_ENV === "production";
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
var uploadsDir = path.resolve(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));
app.get("/cpanel-app.zip", (req, res) => {
  const zipPath = path.resolve(__dirname, "public", "cpanel-app.zip");
  if (fs.existsSync(zipPath)) {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="cpanel-app.zip"');
    return res.sendFile(zipPath);
  }
  return res.status(404).send("File not found");
});
app.get("/cpanel-lengkap-misrpijakarta.zip", (req, res) => {
  const zipPath = path.resolve(__dirname, "public", "cpanel-lengkap-misrpijakarta.zip");
  if (fs.existsSync(zipPath)) {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="cpanel-lengkap-misrpijakarta.zip"');
    return res.sendFile(zipPath);
  }
  const fallbackZip = path.resolve(__dirname, "public", "cpanel-app.zip");
  if (fs.existsSync(fallbackZip)) {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="cpanel-lengkap-misrpijakarta.zip"');
    return res.sendFile(fallbackZip);
  }
  return res.status(404).send("File not found");
});
var dataDir = path.resolve(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
var dbFilePath = path.join(dataDir, "school_database.json");
var backupsDir = path.join(dataDir, "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}
function extractBase64AndSave(val, prefix = "media") {
  if (!val || typeof val !== "string" || !val.startsWith("data:image/")) {
    return val;
  }
  try {
    const match = val.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!match) return val;
    const mimeType = match[1].toLowerCase();
    const extension = mimeType === "svg+xml" ? "svg" : mimeType === "png" ? "png" : mimeType === "webp" ? "webp" : "jpg";
    const base64Data = match[2];
    const safeFileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e4)}.${extension}`;
    const targetFilePath = path.join(uploadsDir, safeFileName);
    fs.writeFileSync(targetFilePath, Buffer.from(base64Data, "base64"));
    console.log(`[Auto-Extracted Media] Saved base64 to /uploads/${safeFileName}`);
    return `/uploads/${safeFileName}`;
  } catch (e) {
    console.error("Failed to extract base64 to file:", e);
    return val;
  }
}
function sanitizeObjectImages(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObjectImages(item));
  }
  const result = { ...obj };
  for (const key of Object.keys(result)) {
    if (typeof result[key] === "string" && result[key].startsWith("data:image/")) {
      result[key] = extractBase64AndSave(result[key], key.replace(/[^a-zA-Z0-9]/g, ""));
    } else if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = sanitizeObjectImages(result[key]);
    }
  }
  return result;
}
var defaultDbFilePath = path.join(dataDir, "default_database.json");
function readDatabase() {
  let defaultDb = {};
  try {
    if (fs.existsSync(defaultDbFilePath)) {
      defaultDb = JSON.parse(fs.readFileSync(defaultDbFilePath, "utf-8"));
    }
  } catch (_) {
  }
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, "utf-8");
      const userDb = JSON.parse(content);
      return { ...defaultDb, ...userDb };
    }
  } catch (e) {
    console.error("Error reading school_database.json:", e);
  }
  return defaultDb;
}
var databaseCache = readDatabase();
function saveDatabase(newData) {
  try {
    databaseCache = {
      ...databaseCache,
      ...newData,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(databaseCache, null, 2), "utf-8");
    try {
      const dateStr = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
      const snapPath = path.join(backupsDir, `snapshot-${dateStr}.json`);
      fs.writeFileSync(snapPath, JSON.stringify(databaseCache, null, 2), "utf-8");
      const latestPath = path.join(backupsDir, "latest-backup.json");
      fs.writeFileSync(latestPath, JSON.stringify(databaseCache, null, 2), "utf-8");
      const existingBackups = fs.readdirSync(backupsDir).filter((f) => f.startsWith("snapshot-"));
      if (existingBackups.length > 30) {
        existingBackups.sort();
        while (existingBackups.length > 30) {
          const toDelete = existingBackups.shift();
          if (toDelete) {
            try {
              fs.unlinkSync(path.join(backupsDir, toDelete));
            } catch (_) {
            }
          }
        }
      }
    } catch (_) {
    }
    return databaseCache;
  } catch (e) {
    console.error("Error writing school_database.json:", e);
    return databaseCache;
  }
}
var aiClient = null;
async function getAIClient() {
  if (aiClient) return aiClient;
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const { GoogleGenAI } = await import("@google/genai");
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    return aiClient;
  } catch (e) {
    console.warn("Could not load @google/genai SDK:", e);
    return null;
  }
}
var RPI_SYSTEM_INSTRUCTION = `
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
app.post("/api/assistant/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: `Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di MI RPI Jakarta! 
MI RPI Jakarta adalah Madrasah Ibtidaiyah berakreditasi A di Jl. HR. Rasuna Said Kav. X2-2, Kuningan Timur, Setiabudi, Jakarta Selatan (NPSN: 60706249). 
Saat ini pendaftaran SPMB Tahun Ajaran 2027/2028 telah dibuka dengan kuota terbatas. Untuk pertanyaan lebih lanjut mengenai pendaftaran, akademik, atau biaya, silakan kunjungi menu SPMB atau hubungi admin via tombol WhatsApp di pojok kanan bawah.`,
        modelUsed: "local-knowledge-base"
      });
    }
    const client = await getAIClient();
    if (!client) {
      const fallbackAnswer = getLocalSmartFallback(message);
      return res.json({ reply: fallbackAnswer, modelUsed: "local-knowledge-base" });
    }
    const response = await client.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        ...Array.isArray(history) ? history.map((h) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        })) : [],
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: RPI_SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingLevel: "HIGH"
        }
      }
    });
    const reply = response.text || "Maaf, saya tidak dapat merespons saat ini. Silakan hubungi admin MI RPI.";
    return res.json({ reply, modelUsed: "gemini-3.1-pro-preview" });
  } catch (error) {
    console.error("Error in /api/assistant/chat:", error);
    const fallbackAnswer = getLocalSmartFallback(req.body.message || "");
    return res.json({
      reply: fallbackAnswer,
      modelUsed: "smart-fallback",
      warning: error?.message
    });
  }
});
function getLocalSmartFallback(query) {
  const q = query.toLowerCase();
  if (q.includes("spmb") || q.includes("daftar") || q.includes("ppdb") || q.includes("biaya") || q.includes("syarat")) {
    return "Assalamu'alaikum! Pendaftaran SPMB MI RPI Jakarta Tahun Pelajaran 2027/2028 telah dibuka secara daring di website ini. Syarat utama mencakup Akta Kelahiran, Kartu Keluarga, dan Keterangan Lulus TK/RA. Kuota kelas terbatas untuk menjamin pembelajaran ramah anak. Silakan klik tombol 'Daftar SPMB 2027/2028' di menu atas untuk mengisi formulir langsung.";
  }
  if (q.includes("lokasi") || q.includes("alamat") || q.includes("dimana") || q.includes("kuningan")) {
    return "Assalamu'alaikum! MI RPI Jakarta beralamat di Jl. HR. Rasuna Said Kav. X2-2, RT 008 / RW 04, Kelurahan Kuningan Timur, Kecamatan Setiabudi, Jakarta Selatan, DKI Jakarta 12950 (Samping/Kawasan Rasuna Said). Anda dapat melihat peta interaktif di bagian bawah halaman Kontak.";
  }
  if (q.includes("akreditasi") || q.includes("npsn") || q.includes("status")) {
    return "Assalamu'alaikum! MI RPI Jakarta berstatus Swasta di bawah naungan Kementerian Agama dan Yayasan Rumah Pendidikan Islam. Terakreditasi A (Unggul) dengan NPSN 60706249 dan Kode Madrasah 111231740119.";
  }
  if (q.includes("program") || q.includes("unggulan") || q.includes("ekskul") || q.includes("tahfiz")) {
    return "Assalamu'alaikum! MI RPI Jakarta memiliki 15 Program Unggulan, di antaranya: Madrasah Ramah Anak, Social Emotional Learning (SEL), Tahsin & Tahfiz Qur'an (Juz 30 & 29), Pramuka Wajib, Sains & Robotik Digital, Panahan, Pencak Silat, Tari Saman, Hadrah, serta Pembiasaan Ibadah Harian.";
  }
  return "Assalamu'alaikum Warahmatullahi Wabarakatuh. Terima kasih telah menghubungi MI RPI Jakarta. Untuk informasi lebih mendalam seputar jadwal, kurikulum, dan pendaftaran, Anda dapat mengakses menu Profil, Akademik, atau menghubungi tim admin kami via WhatsApp resmi.";
}
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    school: "MI RPI Jakarta",
    npsn: "60706249",
    accreditation: "A",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/upload", (req, res) => {
  try {
    const { image, filename } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ error: "Data gambar tidak valid atau kosong" });
    }
    const uploadsDirectory = path.resolve(__dirname, "public", "uploads");
    if (!fs.existsSync(uploadsDirectory)) {
      fs.mkdirSync(uploadsDirectory, { recursive: true });
    }
    let base64Data = image;
    let extension = "jpg";
    const match = image.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1].toLowerCase();
      extension = mimeType === "svg+xml" ? "svg" : mimeType === "png" ? "png" : mimeType === "webp" ? "webp" : "jpg";
      base64Data = match[2];
    }
    const cleanPrefix = filename ? filename.replace(/[^a-zA-Z0-9_-]/g, "") : "media";
    const safeFileName = `${cleanPrefix}-${Date.now()}-${Math.floor(Math.random() * 1e4)}.${extension}`;
    const targetFilePath = path.join(uploadsDirectory, safeFileName);
    fs.writeFileSync(targetFilePath, Buffer.from(base64Data, "base64"));
    const publicUrl = `/uploads/${safeFileName}`;
    console.log(`[Media Upload] File saved successfully to ${publicUrl}`);
    return res.json({
      success: true,
      url: publicUrl
    });
  } catch (err) {
    console.error("Error saving uploaded file:", err);
    return res.status(500).json({ error: "Gagal menyimpan file gambar di server" });
  }
});
app.get("/api/settings", (req, res) => {
  const db = readDatabase();
  return res.json({
    success: true,
    settings: db.settings || null
  });
});
app.post("/api/settings", (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "Data settings tidak valid" });
    }
    const sanitizedSettings = sanitizeObjectImages(settings);
    const updated = saveDatabase({ settings: sanitizedSettings });
    console.log("[Settings Persistence] School settings updated and saved to server disk");
    return res.json({
      success: true,
      settings: updated.settings
    });
  } catch (err) {
    console.error("Error saving settings to server:", err);
    return res.status(500).json({ error: "Gagal menyimpan pengaturan di server" });
  }
});
app.get("/api/school-data", (req, res) => {
  if (!databaseCache || Object.keys(databaseCache).length === 0) {
    databaseCache = readDatabase();
  }
  return res.json({
    success: true,
    data: databaseCache
  });
});
app.post("/api/school-data", (req, res) => {
  try {
    const { key, data, payload } = req.body;
    let dataToSave = {};
    if (key && data !== void 0) {
      dataToSave[key] = sanitizeObjectImages(data);
    } else if (payload && typeof payload === "object") {
      dataToSave = sanitizeObjectImages(payload);
    } else if (req.body && typeof req.body === "object") {
      const sanitized = sanitizeObjectImages(req.body);
      delete sanitized.key;
      delete sanitized.data;
      dataToSave = sanitized;
    }
    const updated = saveDatabase(dataToSave);
    console.log(`[School Data Persistence] Updated keys: ${Object.keys(dataToSave).join(", ")}`);
    return res.json({
      success: true,
      data: updated
    });
  } catch (err) {
    console.error("Error persisting school data to server:", err);
    return res.status(500).json({ error: "Gagal menyimpan data ke server" });
  }
});
app.get("/api/backups", (req, res) => {
  try {
    if (!fs.existsSync(backupsDir)) {
      return res.json({ success: true, backups: [] });
    }
    const files = fs.readdirSync(backupsDir).filter((f) => f.endsWith(".json"));
    const backups = files.map((file) => {
      const filePath = path.join(backupsDir, file);
      const stat = fs.statSync(filePath);
      let studentCount = 0;
      let teacherCount = 0;
      try {
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (Array.isArray(content.students)) studentCount = content.students.length;
        if (Array.isArray(content.teachers)) teacherCount = content.teachers.length;
      } catch (_) {
      }
      return {
        filename: file,
        sizeBytes: stat.size,
        createdAt: stat.mtime.toISOString(),
        studentCount,
        teacherCount,
        isLatest: file === "latest-backup.json"
      };
    });
    backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ success: true, backups });
  } catch (err) {
    console.error("Error listing backups:", err);
    return res.status(500).json({ error: "Gagal membaca daftar cadangan" });
  }
});
app.post("/api/backups/restore", (req, res) => {
  try {
    const { filename, snapshotData } = req.body;
    let dataToRestore = null;
    if (filename) {
      const targetPath = path.join(backupsDir, path.basename(filename));
      if (!fs.existsSync(targetPath)) {
        return res.status(404).json({ error: "File cadangan tidak ditemukan di server" });
      }
      dataToRestore = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
    } else if (snapshotData && typeof snapshotData === "object") {
      dataToRestore = sanitizeObjectImages(snapshotData);
    }
    if (!dataToRestore || typeof dataToRestore !== "object") {
      return res.status(400).json({ error: "Data cadangan tidak valid" });
    }
    try {
      const preRestorePath = path.join(backupsDir, `pre-restore-${Date.now()}.json`);
      fs.writeFileSync(preRestorePath, JSON.stringify(databaseCache, null, 2), "utf-8");
    } catch (_) {
    }
    databaseCache = {
      ...dataToRestore,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(databaseCache, null, 2), "utf-8");
    console.log(`[Backup Restored] Database successfully restored! Students: ${databaseCache.students?.length || 0}, Teachers: ${databaseCache.teachers?.length || 0}`);
    return res.json({
      success: true,
      message: "Database berhasil dipulihkan secara penuh!",
      data: databaseCache
    });
  } catch (err) {
    console.error("Error restoring backup:", err);
    return res.status(500).json({ error: "Gagal memulihkan database dari cadangan" });
  }
});
app.get("/api/database/export", (req, res) => {
  try {
    if (!databaseCache || Object.keys(databaseCache).length === 0) {
      databaseCache = readDatabase();
    }
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="database-mi-rpi-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json"`);
    return res.send(JSON.stringify(databaseCache, null, 2));
  } catch (err) {
    return res.status(500).json({ error: "Gagal mengekspor database" });
  }
});
app.post("/api/database/import", (req, res) => {
  try {
    const { database } = req.body;
    if (!database || typeof database !== "object") {
      return res.status(400).json({ error: "File data database tidak valid" });
    }
    const sanitized = sanitizeObjectImages(database);
    databaseCache = {
      ...databaseCache,
      ...sanitized,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(databaseCache, null, 2), "utf-8");
    try {
      const snapPath = path.join(backupsDir, `snapshot-imported-${Date.now()}.json`);
      fs.writeFileSync(snapPath, JSON.stringify(databaseCache, null, 2), "utf-8");
    } catch (_) {
    }
    return res.json({
      success: true,
      message: "Database berhasil diimpor dan disimpan permanen!",
      data: databaseCache
    });
  } catch (err) {
    return res.status(500).json({ error: "Gagal mengimpor database" });
  }
});
async function startServer() {
  const distDir = path.resolve(__dirname, "dist");
  const hasDist = fs.existsSync(distDir) && fs.existsSync(path.join(distDir, "index.html"));
  if (isProduction || hasDist) {
    app.use(express.static(distDir));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distDir, "index.html"));
    });
  } else {
    try {
      const viteModule = "vite";
      const { createServer: createViteServer } = await import(
        /* @vite-ignore */
        viteModule
      );
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.warn("Vite dev server failed to load, falling back to static:", err);
    }
  }
  const server = app.listen(PORT, () => {
    console.log(`[MI RPI Platform] Server running on port ${PORT}`);
  });
  server.on("error", (err) => {
    console.error("[MI RPI Platform] Server error:", err);
  });
}
startServer();
