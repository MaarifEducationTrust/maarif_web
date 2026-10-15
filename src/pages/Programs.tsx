import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Program } from '../types';
import { getPrograms } from '../lib/db';
import { SafeImage } from '../components/common/SafeImage';
import { VideoEmbed } from '../components/common/VideoEmbed';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Users, 
  CheckCircle, 
  X, 
  Sparkles, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';

export const Programs: React.FC = () => {
  const { t, getField, isRtl } = useLanguage();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const data = await getPrograms(false);
        setPrograms(data);
      } catch (err) {
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrograms();
  }, []);

  const filteredPrograms = programs.filter((p) => {
    const title = (p.title_en + ' ' + p.title_ur).toLowerCase();
    const desc = (p.short_desc_en + ' ' + p.short_desc_ur).toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('sec_programs_title')}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight">
            {isRtl ? 'جامعہ کے تعلیمی شعبہ جات' : 'Educational Curricula & Programs'}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('sec_programs_subtitle')}
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder={isRtl ? 'شعبہ تلاش کریں...' : 'Search programs by keyword...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 bg-white rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-sm shadow-2xs"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-4 rtl:left-auto rtl:right-4 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm text-stone-500">Loading programs...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPrograms.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 mb-1">
              {t('no_programs')}
            </h3>
            <p className="text-xs text-stone-500">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Please check back shortly.'}
            </p>
          </div>
        )}

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((prog) => {
            const title = getField(prog, 'title');
            const shortDesc = getField(prog, 'short_desc');
            const ageGroup = getField(prog, 'age_group');
            const timing = getField(prog, 'timing');

            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {prog.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                      <SafeImage
                        src={prog.image_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {ageGroup && (
                        <span className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-bold bg-emerald-950/80 text-amber-300 px-3 py-1 rounded-full backdrop-blur-xs border border-amber-400/20">
                          {ageGroup}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="px-6 pt-6 flex items-center justify-between">
                      {ageGroup ? (
                        <span className="text-[11px] font-bold bg-emerald-100/80 text-emerald-900 px-3 py-1 rounded-full border border-emerald-200">
                          {ageGroup}
                        </span>
                      ) : <span />}
                      <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl">
                        <BookOpen className="w-4 h-4" />
                      </span>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <h2 className="text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                      {title}
                    </h2>

                    {timing && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Clock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="line-clamp-1">{timing}</span>
                      </div>
                    )}

                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {shortDesc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => setSelectedProgram(prog)}
                    className="w-full py-2.5 px-4 bg-stone-50 hover:bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl border border-stone-200 hover:border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t('view_details')}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Program Modal / Dialog */}
        {selectedProgram && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                  {t('program_details')}
                </span>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {/* Media */}
                {selectedProgram.video_url ? (
                  <VideoEmbed url={selectedProgram.video_url} title={getField(selectedProgram, 'title')} />
                ) : selectedProgram.image_url ? (
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100">
                    <SafeImage
                      src={selectedProgram.image_url}
                      alt={getField(selectedProgram, 'title')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                <div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2">
                    {getField(selectedProgram, 'title')}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-xs text-stone-500 pt-1">
                    {selectedProgram.age_group_en && (
                      <span className="inline-flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
                        <Users className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{getField(selectedProgram, 'age_group')}</span>
                      </span>
                    )}
                    {selectedProgram.timing_en && (
                      <span className="inline-flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{getField(selectedProgram, 'timing')}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Detailed description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    {isRtl ? 'تفصیلی تعارف' : 'Program Overview'}
                  </h4>
                  <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
                    {getField(selectedProgram, 'detailed_desc') || getField(selectedProgram, 'short_desc')}
                  </p>
                </div>

                {/* Curriculum Highlights */}
                {getField(selectedProgram, 'curriculum_highlights') && (
                  <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>{t('curriculum')}</span>
                    </h4>
                    <p className="text-emerald-950 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                      {getField(selectedProgram, 'curriculum_highlights')}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold"
                >
                  {t('back')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
