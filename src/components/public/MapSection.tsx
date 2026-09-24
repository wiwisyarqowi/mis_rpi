import React from 'react';
import { MapPin, Navigation, ExternalLink, Phone, ShieldCheck } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const MapSection: React.FC = () => {
  const { settings } = useSchool();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${settings.schoolName} ${settings.address} Kuningan Timur Setiabudi Jakarta Selatan`
  )}`;

  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Info Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold">
              <MapPin size={14} className="text-emerald-600" />
              <span>Lokasi Strategis di Pusat Jakarta</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Akses Mudah & Lingkungan Belajar Kondusif
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              MI RPI Jakarta berada di koridor Jl. HR. Rasuna Said Kav. X2-2, Kuningan Timur, Setiabudi, Jakarta Selatan. Lokasi aman, mudah dijangkau dengan transportasi umum (LRT Jabodebek Stasiun Rasuna Said / Kuningan, Halte TransJakarta Kuningan Timur), serta dilengkapi area antar-jemput yang ramah anak.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">{settings.schoolName}</strong>
                  <span className="text-slate-600">
                    {settings.address}, RT {settings.rtRw}, Kel. {settings.subDistrict}, Kec. {settings.district}, {settings.city}, {settings.province} {settings.postalCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-slate-200/60">
                <Navigation size={16} className="text-teal-600 shrink-0" />
                <span className="text-slate-500">
                  Koordinat Geografis: <strong>{settings.latitude}, {settings.longitude}</strong>
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition inline-flex items-center gap-2"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink size={14} />
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition inline-flex items-center gap-2"
              >
                <Phone size={14} className="text-emerald-600" />
                <span>Panduan Rute via WA</span>
              </a>
            </div>
          </div>

          {/* Map Embed Frame */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 relative h-96">
              <iframe
                title="Peta Lokasi MI RPI Jakarta"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=106.8200%2C-6.2390%2C106.8390%2C-6.2280&amp;layer=mapnik&amp;marker=${settings.latitude}%2C${settings.longitude}`}
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-md border border-slate-200/80 text-xs max-w-xs">
                <p className="font-bold text-emerald-800">{settings.schoolName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Kav. X2-2 Kuningan Timur, Setiabudi</p>
                <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck size={12} />
                  Lokasi Terverifikasi Kemenag
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
