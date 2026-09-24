import React from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Laptop,
  Heart,
  ShieldCheck,
  Award,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

export const HeroSection: React.FC = () => {
  const { settings, navigate } = useSchool();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 pt-10 pb-20 border-b border-emerald-100/60">
      {/* Background Islamic Subtle Circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-900 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Super School Digital Platform • Kuningan, Jakarta Selatan</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Madrasah Unggul, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-800">
                Berakhlak Mulia,
              </span>{' '}
              Cakap di Era Digital
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {settings.subheadline}
            </p>

            {/* Key Value Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Madrasah Ramah Anak
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Tahsin & Tahfiz Bersanad
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
                <CheckCircle2 size={15} className="text-emerald-600" />
                Coding Cilik & Robotik
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate('spmb')}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-700/25 hover:shadow-xl transition duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Daftar SPMB 2027/2028</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('profil')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition flex items-center justify-center gap-2"
              >
                <span>Kenali MI RPI</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-8 text-slate-600">
              <div>
                <p className="text-xl font-extrabold text-emerald-800">Akreditasi A</p>
                <p className="text-xs text-slate-500">BAN-S/M Unggul</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-xl font-extrabold text-emerald-800">15 Program</p>
                <p className="text-xs text-slate-500">Unggulan Madrasah</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-xl font-extrabold text-emerald-800">100% Digital</p>
                <p className="text-xs text-slate-500">LMS & e-Rapor Kemenag</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composite Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Card */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white relative">
                <img
                  src={settings.heroImageUrl || "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80"}
                  alt="Aktivitas Belajar MI RPI Jakarta"
                  className="w-full h-80 object-cover"
                />
                <div className="p-5 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent absolute inset-0 flex flex-col justify-end text-white">
                  <span className="bg-emerald-500/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit mb-2 backdrop-blur-xs">
                    Budaya Belajar Ceria
                  </span>
                  <h3 className="font-bold text-lg">Pendidikan Holistik Islami & Sains Modern</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Membangun karakter tangguh dengan pembiasaan adab, empati, dan penguasaan sains digital.
                  </p>
                </div>
              </div>

              {/* Floating Mini Card 1: Tahsin & Qur'an */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center gap-3 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Hafalan Qur'an Mutqin</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Target Juz 30 & 29 Bersanad</p>
                </div>
              </div>

              {/* Floating Mini Card 2: Digital School */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-teal-100 flex items-center gap-3 animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                  <Laptop size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Laboratorium Komputer</p>
                  <p className="text-[10px] text-teal-600 font-semibold">Koding Cilik & Computational Thinking</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
