import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Search,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { ComplaintTicket } from '../../types';

export const ContactPage: React.FC = () => {
  const { settings, complaints, submitComplaint } = useSchool();

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [category, setCategory] = useState<ComplaintTicket['category']>('Saran');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<ComplaintTicket | null>(null);

  // Tracking Ticket State
  const [ticketSearch, setTicketSearch] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<ComplaintTicket | null>(null);
  const [searchDone, setSearchDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;

    const ticket = submitComplaint({
      senderName,
      senderContact,
      category,
      message,
    });

    setSubmittedTicket(ticket);
    setSenderName('');
    setSenderContact('');
    setMessage('');
  };

  const handleTrackTicket = () => {
    setSearchDone(true);
    const found = complaints.find(
      (c) => c.ticketNumber.toLowerCase() === ticketSearch.trim().toLowerCase()
    );
    setSearchedTicket(found || null);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
            <MessageSquare size={14} className="text-emerald-600" />
            <span>Kanal Komunikasi & Layanan Warga</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hubungi Kami & "Suara Warga MI RPI"
          </h1>
          <p className="text-sm text-slate-600">
            Kami menyambut hangat setiap pertanyaan, aspirasi, saran membangun, maupun permohonan informasi resmi seputar MI RPI Jakarta.
          </p>
        </div>

        {/* Contact Info & Suara Warga Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Col Left: Official Info & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900 border-b pb-3 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Sekretariat & Tata Usaha</span>
              </h3>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block text-sm">{settings.schoolName}</strong>
                    <p className="mt-0.5">{settings.address}, RT {settings.rtRw}</p>
                    <p>Kel. {settings.subDistrict}, Kec. {settings.district}, {settings.city}</p>
                    <p>{settings.province} {settings.postalCode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-teal-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Telepon Kantor:</span>
                    <span className="font-semibold text-slate-800">{settings.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-600 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Resmi:</span>
                    <span className="font-semibold text-slate-800">{settings.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jam Operasional Kantor:</span>
                    <p className="font-semibold text-slate-800">Senin – Kamis: 07.30 – 15.00 WIB</p>
                    <p className="font-semibold text-slate-800">Jumat: 07.30 – 11.30 WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Frame */}
            <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-xs overflow-hidden h-72">
              <iframe
                title="Peta Lokasi"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=106.8200%2C-6.2390%2C106.8390%2C-6.2280&amp;layer=mapnik&amp;marker=${settings.latitude}%2C${settings.longitude}`}
                className="w-full h-full rounded-2xl border-0"
              ></iframe>
            </div>
          </div>

          {/* Col Right: Suara Warga Form & Tracking (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Form Box */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Kanal Aspirasi Terbuka
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">Suara Warga MI RPI</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kirimkan aspirasi, kritik konstruktif, pengaduan layanan, atau ide program secara transparan dengan tiket pelacakan otomatis.
                </p>
              </div>

              {submittedTicket && (
                <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs space-y-2 animate-in zoom-in-95">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-700" />
                      Tiket Aspirasi Berhasil Dibuat
                    </span>
                    <span className="font-mono font-bold bg-white px-2.5 py-1 rounded-lg text-emerald-800 border border-emerald-300">
                      {submittedTicket.ticketNumber}
                    </span>
                  </div>
                  <p className="text-emerald-800">
                    Aspirasi Anda telah diteruskan ke tata usaha. Simpan nomor tiket di atas untuk melacak status tanggapan pengelola madrasah.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nomor Kontak (WhatsApp/Email) *</label>
                    <input
                      type="text"
                      required
                      placeholder="08xxxxxxxxxx / email@..."
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Aspirasi / Pengaduan *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  >
                    <option value="Saran">Saran & Ide Program</option>
                    <option value="Akademik">Akademik & Kurikulum</option>
                    <option value="Kesiswaan">Kesiswaan & Pembiasaan</option>
                    <option value="Sarana Prasarana">Sarana & Prasarana</option>
                    <option value="Pelayanan">Pelayanan Administrasi / TU</option>
                    <option value="Pengaduan">Pengaduan Umum</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pesan / Isi Aspirasi *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tuliskan secara jelas, santun, dan objektif..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  <span>Kirim ke Tim Tata Usaha</span>
                </button>
              </form>
            </div>

            {/* Tracking Tiket Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Lacak Status Tiket Suara Warga</h4>
                  <p className="text-[11px] text-slate-500">Cek respon admin terhadap aspirasi yang telah Anda kirimkan</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nomor Tiket (contoh: SW-2026-0182)"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleTrackTicket}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
                >
                  Cek Tiket
                </button>
              </div>

              {searchDone && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 animate-in fade-in">
                  {searchedTicket ? (
                    <div>
                      <div className="flex items-center justify-between border-b pb-2 mb-2">
                        <span className="font-mono font-bold text-slate-900">{searchedTicket.ticketNumber}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          searchedTicket.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : searchedTicket.status === 'Diproses'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {searchedTicket.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-2"><strong>Aspirasi:</strong> "{searchedTicket.message}"</p>
                      <div className="p-3 bg-white rounded-xl border border-emerald-200 text-emerald-900">
                        <strong className="block text-[11px] text-emerald-700">Tanggapan Resmi Admin:</strong>
                        <p className="mt-0.5">{searchedTicket.responseNote || 'Belum ada tanggapan.'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-2">
                      Tiket "{ticketSearch}" tidak ditemukan dalam catatan sistem.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
