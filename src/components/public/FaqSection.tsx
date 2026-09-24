import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const FaqSection: React.FC = () => {
  const { settings, navigate } = useSchool();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apa itu MI RPI Jakarta?',
      a: `Madrasah Ibtidaiyah (MI) RPI Jakarta adalah lembaga pendidikan formal setingkat Sekolah Dasar (SD) yang memadukan kurikulum nasional, kurikulum keagamaan Kementerian Agama, dan literasi teknologi era digital di bawah naungan Yayasan Rumah Pendidikan Islam.`,
    },
    {
      q: 'Di mana lokasi MI RPI Jakarta?',
      a: `MI RPI Jakarta berlokasi di Jl. HR. Rasuna Said Kav. X2-2, RT 008 / RW 04, Kelurahan Kuningan Timur, Kecamatan Setiabudi, Jakarta Selatan, DKI Jakarta 12950. Lokasi sangat strategis dan mudah diakses di pusat koridor Kuningan.`,
    },
    {
      q: 'Apa status dan akreditasi MI RPI?',
      a: `MI RPI Jakarta berstatus Swasta di bawah naungan Kementerian Agama dan berakreditasi A (Unggul) berdasarkan keputusan Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M).`,
    },
    {
      q: 'Berapa NPSN dan Kode Madrasah MI RPI?',
      a: `NPSN resmi MI RPI Jakarta adalah 60706249, dan Kode Registrasi Madrasah Kemenag adalah 111231740119.`,
    },
    {
      q: 'Bagaimana cara mendaftar siswa baru (SPMB 2027/2028)?',
      a: `Pendaftaran dapat dilakukan secara online melalui menu "SPMB" di website ini. Calon wali murid mengisi formulir data siswa dan orang tua, mengunggah berkas (Akta Kelahiran, Kartu Keluarga, Ijazah/Surat Keterangan TK), kemudian sistem akan memberikan Nomor Pendaftaran digital untuk memantau status verifikasi dan jadwal observasi.`,
    },
    {
      q: 'Apa saja 15 program unggulan di MI RPI?',
      a: `Program unggulan meliputi: 1. Madrasah Ramah Anak, 2. Social Emotional Learning (SEL), 3. Pramuka Wajib, 4. Tahsin & Tahfiz (Target Juz 30 & 29), 5. Gerakan Literasi Madrasah, 6. Sains & STEM, 7. Pembelajaran Digital & Coding, 8. Seni Islami & Kaligrafi, 9. Panahan Sunnah, 10. Pencak Silat, 11. Tari Saman, 12. Hadrah Shalawat, 13. Pembiasaan Ibadah Harian, 14. Kegiatan Sosial & Peduli Lingkungan, 15. Kokurikuler Berbasis Proyek (P5-PPRA).`,
    },
    {
      q: 'Apa saja ekstrakurikuler yang dapat diikuti siswa?',
      a: `Ekstrakurikuler di MI RPI meliputi Panahan, Robotik & Coding Scratch, Pencak Silat, Tari Saman, Seni Hadrah/Marawis, Drum Band/Marching Band Cilik, Sains Club, English & Arabic Club, serta Tahfiz Intensif.`,
    },
    {
      q: 'Bagaimana orang tua melihat informasi akademik dan absensi?',
      a: `Orang tua dapat masuk ke "Portal Orang Tua" di website ini menggunakan akun terdaftar. Di portal tersebut, orang tua dapat memantau presensi real-time ananda, nilai tugas dan asesmen, catatan perkembangan karakter, jurnal ibadah, tagihan SPP digital, hingga mengunduh e-Rapor resmi.`,
    },
    {
      q: 'Bagaimana cara menghubungi pihak madrasah?',
      a: `Anda dapat menghubungi madrasah melalui tombol WhatsApp resmi yang tersedia di pojok kanan bawah, mengirim pesan melalui menu Kontak "Suara Warga MI RPI", atau datang langsung ke kantor sekretariat madrasah pada jam kerja Senin–Jumat 07.30–15.00 WIB.`,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3">
            <HelpCircle size={14} className="text-emerald-600" />
            <span>Pertanyaan yang Sering Diajukan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Jawaban lengkap seputar profil, penerimaan siswa baru, kurikulum, dan layanan digital MI RPI Jakarta.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-800 hover:text-emerald-700 transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-10 p-6 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl text-white text-center sm:flex sm:items-center sm:justify-between gap-6">
          <div className="text-left mb-4 sm:mb-0">
            <h4 className="font-bold text-base">Punya Pertanyaan Lain yang Belum Terjawab?</h4>
            <p className="text-xs text-emerald-200 mt-1">
              Konsultasikan kebutuhan pendidikan putra-putri Anda bersama tim konselor madrasah kami.
            </p>
          </div>
          <button
            onClick={() => navigate('kontak')}
            className="px-5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl shadow-md transition whitespace-nowrap"
          >
            Hubungi Sekretariat
          </button>
        </div>
      </div>
    </section>
  );
};
