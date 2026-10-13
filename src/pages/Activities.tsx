import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { StudentActivity } from '../types';
import { getStudentActivities } from '../lib/db';
import { SafeImage } from '../components/common/SafeImage';
import { VideoEmbed } from '../components/common/VideoEmbed';
import { 
  Award, 
  Search, 
  Calendar, 
  X, 
  ArrowRight, 
  Video, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export const Activities: React.FC = () => {
  const { t, getField, isRtl } = useLanguage();
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<StudentActivity | null>(null);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    try {
      const data = await getStudentActivities(false); // only published
      setActivities(data);
    } catch (err) {
      console.error('Failed to load activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();

    const handleUpdate = () => {
      loadActivities();
    };

    window.addEventListener('madrasa_activities_updated', handleUpdate);
    return () => {
      window.removeEventListener('madrasa_activities_updated', handleUpdate);
    };
  }, []);

  // Compute unique categories
  const categories = ['all', ...Array.from(new Set(activities.map((a) => a.category_en).filter(Boolean)))];

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    const matchesCategory = selectedCategory === 'all' || act.category_en === selectedCategory;
    const q = searchQuery.toLowerCase();
    const titleMatch = (act.title_en + ' ' + act.title_ur).toLowerCase().includes(q);
    const descMatch = (act.description_en + ' ' + act.description_ur).toLowerCase().includes(q);
    const catMatch = (act.category_en + ' ' + act.category_ur).toLowerCase().includes(q);
    return matchesCategory && (titleMatch || descMatch || catMatch);
  });

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-4 py-1.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>{t('sec_activities_title')}</span>
          </span>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {isRtl ? 'جامعہ کی تعلیمی و تربیتی سرگرمیاں' : 'Student Activities, Events & Tarbiyah'}
          </h1>

          <p className="text-stone-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t('sec_activities_subtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-2 sm:pt-4">
            <div className="relative">
              <input
                type="text"
                placeholder={isRtl ? 'سرگرمی تلاش کریں...' : 'Search activities by keyword or topic...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-2.5 sm:py-3 bg-white rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 focus:border-emerald-700 text-xs sm:text-sm shadow-2xs"
              />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-4 rtl:left-auto rtl:right-4 top-3 sm:top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {cat === 'all' ? (isRtl ? 'تمام سرگرمیاں' : 'All Activities') : cat}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs sm:text-sm text-stone-500">Loading student activities...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredActivities.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 max-w-md mx-auto shadow-2xs">
            <Award className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 mb-1">
              {t('no_activities')}
            </h3>
            <p className="text-xs text-stone-500">
              {searchQuery ? 'Try adjusting your search query or filters.' : 'Please check back shortly as new events are added.'}
            </p>
          </div>
        )}

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredActivities.map((act) => {
            const title = getField(act, 'title');
            const description = getField(act, 'description');
            const category = getField(act, 'category');

            return (
              <div
                key={act.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedActivity(act)}
              >
                <div>
                  {/* Image with badges */}
                  <div className="aspect-[16/10] overflow-hidden bg-stone-100 relative">
                    <SafeImage
                      src={act.image_url}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category pill */}
                    <span className="absolute top-3 left-3 rtl:left-auto rtl:right-3 text-[11px] font-bold bg-emerald-950/80 text-amber-300 px-3 py-1 rounded-full backdrop-blur-xs border border-amber-400/20">
                      {category}
                    </span>

                    {/* Video badge if video is present */}
                    {act.video_url && (
                      <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 p-1.5 bg-red-600 text-white rounded-full shadow-md" title={t('watch_video')}>
                        <Video className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {/* Date */}
                    {act.activity_date && (
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="font-medium">{act.activity_date}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-emerald-800 transition-colors line-clamp-2 leading-snug">
                      {title}
                    </h2>

                    {/* Description Snippet */}
                    <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedActivity(act);
                    }}
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

        {/* Detailed Activity Modal */}
        {selectedActivity && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelectedActivity(null)}
          >
            <div 
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                    {getField(selectedActivity, 'category')}
                  </span>
                  {selectedActivity.activity_date && (
                    <span className="text-xs font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      <span>{selectedActivity.activity_date}</span>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Media Presentation: Video embed or Hero image */}
                {selectedActivity.video_url ? (
                  <div className="space-y-3">
                    <VideoEmbed
                      url={selectedActivity.video_url}
                      title={getField(selectedActivity, 'title')}
                    />
                    {selectedActivity.image_url && (
                      <div className="aspect-[21/9] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                        <SafeImage
                          src={selectedActivity.image_url}
                          alt={getField(selectedActivity, 'title')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : selectedActivity.image_url ? (
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                    <SafeImage
                      src={selectedActivity.image_url}
                      alt={getField(selectedActivity, 'title')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                    {getField(selectedActivity, 'title')}
                  </h3>
                  <p className="text-xs text-stone-400 font-urdu mt-1" dir={isRtl ? 'ltr' : 'rtl'}>
                    {isRtl ? selectedActivity.title_en : selectedActivity.title_ur}
                  </p>
                </div>

                {/* Extended Content or Description */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    {isRtl ? 'تفصیلات و رپورٹ' : 'Activity Summary & Report'}
                  </h4>
                  <div className="text-stone-700 text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-line">
                    {getField(selectedActivity, 'content') || getField(selectedActivity, 'description')}
                  </div>
                </div>

                {/* Video URL Link if external link needed */}
                {selectedActivity.video_url && (
                  <div className="pt-1">
                    <a
                      href={selectedActivity.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                    >
                      <Video className="w-4 h-4 text-red-600" />
                      <span>{t('watch_video')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="px-5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
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
