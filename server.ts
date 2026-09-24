import express, { type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

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
