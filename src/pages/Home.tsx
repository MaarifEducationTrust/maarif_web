import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
  SiteSettings,
  HomepageSection,
  Program,
  Problem,
  StudentStatistic,
  LegalDocument
} from '../types';
import {
  getSiteSettings,
  getHomepageSections,
  getPrograms,
  getProblems,
  getStudentStatistics,
  getLegalDocuments
} from '../lib/db';
import { SafeImage } from '../components/common/SafeImage';
import { VideoEmbed } from '../components/common/VideoEmbed';
import { IconRenderer } from '../components/common/IconRenderer';
import { QRCodeDisplay } from '../components/common/QRCodeDisplay';
import {
  ArrowRight,
  Heart,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  QrCode,
  Building2,
  Sparkles,
  Compass,
  Award,
  Video
} from 'lucide-react';

interface HomeProps {
  onOpenDonate: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenDonate }) => {
  const { t, getField, isRtl } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [needs, setNeeds] = useState<Problem[]>([]);
  const [stats, setStats] = useState<StudentStatistic[]>([]);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sSettings, sSections, sPrograms, sNeeds, sStats, sDocs] = await Promise.all([
          getSiteSettings(),
          getHomepageSections(),
          getPrograms(false),
          getProblems(false),
          getStudentStatistics(false),
          getLegalDocuments(false),
        ]);
        setSettings(sSettings);
        setSections(sSections);
        setPrograms(sPrograms.slice(0, 3));
        setNeeds(sNeeds.filter(n => n.status === 'active').slice(0, 3));
        setStats(sStats);
        setDocuments(sDocs.slice(0, 3));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Reactive listener for settings updates from admin panel
    const handleSettingsUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      } else {
        getSiteSettings().then(s => setSettings(s));
      }
    };
    window.addEventListener('madrasa_settings_updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('madrasa_settings_updated', handleSettingsUpdate);
    };
  }, []);

  if (loading || !settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-emerald-950">Loading Madrasa Portal...</span>
        </div>
      </div>
    );
  }

  const isSectionVisible = (key: string) => {
    const sec = sections.find(s => s.section_key === key);
    return sec ? sec.is_visible : true;
  };

  const madrasaName = getField(settings, 'madrasa_name');
  const heroBadge = getField(settings, 'hero_badge');
  const heroTitle = getField(settings, 'hero_title');
  const heroSubtitle = getField(settings, 'hero_subtitle');
  const aboutHeading = getField(settings, 'about_heading');
  const aboutHistory = getField(settings, 'about_history');
  const aboutMission = getField(settings, 'about_mission');
  const aboutVision = getField(settings, 'about_vision');
  const aboutObjectives = getField(settings, 'about_objectives');
  const videoTitle = getField(settings, 'intro_video_title');
  const videoDesc = getField(settings, 'intro_video_desc');

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 w-full overflow-x-hidden">
      {/* SECTION A: HERO */}
      {isSectionVisible('hero') && (
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-8 pb-14 sm:py-20 md:py-24">
          <div className="absolute inset-0 bg-islamic-pattern opacity-15 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headings & CTAs */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left rtl:lg:text-right min-w-0">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-amber-400/30 text-amber-300 text-[11px] sm:text-xs font-semibold shadow-2xs max-w-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{heroBadge || t('hero_badge_default')}</span>
                </div>

                <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight break-words">
                  {heroTitle || madrasaName}
                </h1>

                <p className="text-xs xs:text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {heroSubtitle}
                </p>

                <div className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center justify-center lg:justify-start rtl:lg:justify-end gap-2.5 sm:gap-4 pt-2">
                  {/* <a
                    href="#about-section"
                    className="w-full xs:w-auto px-5 py-3 rounded-xl bg-white text-emerald-950 hover:bg-stone-100 font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>{t('hero_btn_learn')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </a> */}

                  {settings.donation_enabled && (
                    <button
                      onClick={onOpenDonate}
                      className="w-full xs:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 border border-amber-300/60 transform hover:-translate-y-0.5 shrink-0"
                    >
                      <Heart className="w-3.5 h-3.5 text-emerald-950 fill-emerald-950/20" />
                      <span>{t('hero_btn_support')}</span>
                    </button>
                  )}

                  <Link
                    to="/programs"
                    className="w-full xs:w-auto px-5 py-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-emerald-100 font-semibold text-xs sm:text-sm border border-emerald-700/60 transition-all inline-flex items-center justify-center gap-2 shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('hero_btn_programs')}</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Hero Photograph */}
              <div className="lg:col-span-5 w-full">
                <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 to-emerald-400/30 rounded-3xl blur-md opacity-60" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-emerald-700/50 bg-emerald-950 aspect-[4/3] w-full">
                    {settings.hero_image_url ? (
                      <SafeImage
                        src={settings.hero_image_url}
                        alt={madrasaName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-emerald-900/60 text-center">
                        <Building2 className="w-12 h-12 text-amber-400 mb-2 opacity-80" />
                        <span className="font-bold text-base text-white">{madrasaName}</span>
                        <span className="text-xs text-emerald-200 mt-1 line-clamp-1">{getField(settings, 'tagline')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION B: ABOUT THE MADRASA */}
      {isSectionVisible('about') && (
        <section id="about-section" className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-2">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2.5">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-200/60">
              {t('sec_about_title')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
              {aboutHeading || t('sec_about_title')}
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed">
              {t('sec_about_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {/* History Card */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-2xs border border-stone-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-amber-400 transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2">
                {isRtl ? 'تاریخ و پس منظر' : 'Brief History'}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {aboutHistory}
              </p>
            </div>

            {/* Mission & Vision Card */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-2xs border border-stone-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2">
                {isRtl ? 'مشن اور وژن' : 'Mission & Vision'}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-3">
                <strong className="text-stone-800 block mb-0.5">{isRtl ? 'مشن:' : 'Mission:'}</strong>
                {aboutMission}
              </p>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed border-t border-stone-100 pt-2.5">
                <strong className="text-stone-800 block mb-0.5">{isRtl ? 'وژن:' : 'Vision:'}</strong>
                {aboutVision}
              </p>
            </div>

            {/* Objectives Card */}
            <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-2xs border border-stone-200/80 hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4 group-hover:bg-emerald-800 group-hover:text-amber-400 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2">
                {isRtl ? 'بنیادی تعلیمی مقاصد' : 'Educational Objectives'}
              </h3>
              <div className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {aboutObjectives}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION C: INTRO VIDEO */}
      {isSectionVisible('video') && settings.intro_video_url && (
        <section className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-stone-900 to-stone-950 p-4 sm:p-8 md:p-10 rounded-3xl text-white shadow-xl border border-stone-800">
            <div className="text-center max-w-2xl mx-auto mb-6 space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400">
                {videoTitle || t('sec_video_title')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                {videoDesc || t('sec_video_subtitle')}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <VideoEmbed url={settings.intro_video_url} title={videoTitle} />
            </div>
          </div>
        </section>
      )}

      {/* SECTION D: EDUCATIONAL PROGRAMS PREVIEW */}
      {isSectionVisible('programs') && (
        <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
            <div className="space-y-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200/60">
                {t('sec_programs_title')}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900">
                {isRtl ? 'منتخب تعلیمی شعبہ جات' : 'Featured Educational Offerings'}
              </h2>
            </div>
            <Link
              to="/programs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all shrink-0 self-start sm:self-auto"
            >
              <span>{isRtl ? 'تمام شعبے ملاحظہ فرمائیں' : 'View All Programs'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {programs.map((prog) => {
              const title = getField(prog, 'title');
              const shortDesc = getField(prog, 'short_desc');
              const ageGroup = getField(prog, 'age_group');
              return (
                <div
                  key={prog.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xs border border-stone-200/80 flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  {prog.image_url && (
                    <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                      <SafeImage
                        src={prog.image_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      {ageGroup && (
                        <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
                          {ageGroup}
                        </span>
                      )}
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {title}
                      </h3>
                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {shortDesc}
                      </p>
                    </div>

                    <Link
                      to={`/programs`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 pt-2 border-t border-stone-100"
                    >
                      <span>{t('view_details')}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION E: STUDENTS & IMPACT STATISTICS */}
      {isSectionVisible('impact') && stats.length > 0 && (
        <section className="bg-emerald-950 text-white py-12 sm:py-16 px-3.5 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                {t('sec_impact_title')}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">
                {isRtl ? 'تصدیق شدہ اعداد و شمار' : 'Transparent Institutional Metrics'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80">
                {t('sec_impact_subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {stats.map((item) => {
                const label = getField(item, 'label');
                const subtext = getField(item, 'subtext');
                return (
                  <div
                    key={item.id}
                    className="bg-emerald-900/60 p-4 sm:p-6 rounded-2xl border border-emerald-800/80 text-center flex flex-col items-center justify-center space-y-1.5 hover:border-amber-400/40 transition-colors shadow-2xs"
                  >
                    <div className="p-2.5 sm:p-3 bg-emerald-800/80 rounded-xl text-amber-400 mb-1 border border-emerald-700/60">
                      <IconRenderer name={item.icon_name} className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
                      {item.value}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-amber-200">
                      {label}
                    </span>
                    {subtext && (
                      <span className="text-[10px] sm:text-[11px] text-emerald-200/70">
                        {subtext}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION F: CURRENT NEEDS PREVIEW */}
      {isSectionVisible('needs') && needs.length > 0 && (
        <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-3">
            <div className="space-y-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200/60">
                {t('sec_needs_title')}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900">
                {isRtl ? 'فعال تعمیری و تعلیمی ضروریات' : 'Immediate Appeals for Support'}
              </h2>
            </div>
            <Link
              to="/needs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all shrink-0 self-start sm:self-auto"
            >
              <span>{isRtl ? 'تمام ضروریات دیکھیں' : 'View All Needs'}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {needs.map((item) => {
              const title = getField(item, 'title');
              const summary = getField(item, 'summary');
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xs border border-stone-200/80 flex flex-col justify-between hover:shadow-md transition-all group"
                >
                  {item.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                      <SafeImage
                        src={item.image_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.video_url && (
                        <span
                          className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-2 py-0.5 bg-red-600 text-white rounded-full shadow-md flex items-center gap-1 text-[10px] font-bold"
                          title="Appeal Video Available"
                        >
                          <Video className="w-3 h-3" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>
                  ) : item.video_url ? (
                    <div className="h-24 bg-gradient-to-br from-stone-900 to-stone-950 text-white p-4 relative flex items-center justify-between border-b border-stone-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-xs">
                          <Video className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white">Video Appeal Attached</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60 uppercase">
                          {t('status_active')}
                        </span>
                        {item.requested_amount && (
                          <span className="text-xs font-bold text-stone-900 truncate">
                            {item.requested_amount}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {title}
                      </h3>
                      <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                        {summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <Link
                        to="/needs"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                      >
                        <span>{t('view_details')}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                      </Link>

                      {settings.donation_enabled && (
                        <button
                          onClick={onOpenDonate}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Heart className="w-3 h-3 text-amber-300" />
                          <span>{t('hero_btn_support')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION G: LEGAL & TRANSPARENCY PREVIEW */}
      {isSectionVisible('documents') && documents.length > 0 && (
        <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="bg-stone-100/70 rounded-3xl p-5 sm:p-8 md:p-12 border border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
              <div className="space-y-1.5">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200/60">
                  {t('sec_documents_title')}
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900">
                  {isRtl ? 'سرکاری اسناد و الحاق نامے' : 'Institutional Transparency'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                  {t('sec_documents_subtitle')}
                </p>
              </div>
              <Link
                to="/documents"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-2xs hover:shadow-xs transition-all shrink-0 self-start sm:self-auto"
              >
                <span>{isRtl ? 'تمام دستاویزات ملاحظہ کریں' : 'View All Documents'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {documents.map((doc) => {
                const title = getField(doc, 'title');
                const category = getField(doc, 'category');
                return (
                  <div
                    key={doc.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-sm transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="p-1.5 bg-emerald-50 text-emerald-800 rounded-lg shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 uppercase truncate">
                          {category}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-900 mb-1.5 line-clamp-2">
                        {title}
                      </h4>
                      {doc.document_number && (
                        <p className="text-[10px] sm:text-[11px] font-mono text-stone-500">
                          ID: {doc.document_number}
                        </p>
                      )}
                    </div>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3.5 pt-3 border-t border-stone-100 inline-flex items-center justify-between text-xs font-bold text-emerald-800 hover:text-emerald-950"
                    >
                      <span>{t('open_document')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SECTION H: DONATION SECTION */}
      {isSectionVisible('donation') && settings.donation_enabled && (
        <section id="donation-section" className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-5 sm:p-8 md:p-12 text-white shadow-2xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-islamic-pattern opacity-10 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-4 text-center md:text-left rtl:md:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                  <Heart className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('sec_donation_title')}</span>
                </span>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {isRtl ? 'تعاون اور صدقۂ جاریہ' : 'Contribute Directly to Sacred Knowledge'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  {getField(settings, 'donation_instructions') || t('sec_donation_subtitle')}
                </p>

                <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start rtl:md:justify-end">
                  <button
                    onClick={onOpenDonate}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4 text-emerald-950" />
                    <span>{t('donation_scan_title')}</span>
                  </button>
                </div>
              </div>

              {/* QR Preview Widget with Responsive QRCodeDisplay */}
              <div className="md:col-span-5 flex flex-col items-center justify-center w-full">
                <div
                  onClick={onOpenDonate}
                  className="cursor-pointer bg-white p-3.5 sm:p-5 rounded-2xl shadow-xl border-2 border-amber-400/50 hover:scale-[1.02] transition-transform text-center group w-full max-w-xs"
                >
                  <QRCodeDisplay
                    qrUrl={settings.donation_qr_url}
                    upiId={settings.upi_id}
                    size="sm"
                    showDownload={false}
                    className="mx-auto"
                  />
                  <span className="text-[11px] font-bold text-emerald-900 group-hover:text-emerald-700 block mt-2 truncate">
                    {settings.upi_id ? `UPI: ${settings.upi_id}` : t('view_details')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
